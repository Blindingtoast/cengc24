import os
from flask import Flask, jsonify, request, render_template
from PIL import Image
import torch
import torchvision.transforms as transforms
import math
import torch.nn as nn
from datetime import datetime

class HorizonCNN(nn.Module):
    def __init__(self, num_metadata_features=3):
        super(HorizonCNN, self).__init__()
        
        # CNN for image processing
        self.cnn = nn.Sequential(
            nn.Conv2d(1, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.BatchNorm2d(32),
            
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.BatchNorm2d(64),
            
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.BatchNorm2d(128),
            
            nn.Conv2d(128, 256, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d((1, 1)),
            nn.BatchNorm2d(256)
        )
        
        # Metadata processing
        self.metadata_net = nn.Sequential(
            nn.Linear(num_metadata_features, 64),
            nn.ReLU(),
            nn.BatchNorm1d(64),
            nn.Dropout(0.3)
        )
        
        # Fusion and prediction
        self.fusion = nn.Sequential(
            nn.Linear(256 + 64, 128),
            nn.ReLU(),
            nn.BatchNorm1d(128),
            nn.Dropout(0.3)
        )
        
        self.location_head = nn.Sequential(
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Linear(64, 2)
        )
        
        self.azimuth_head = nn.Sequential(
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Linear(64, 1)
        )

    def forward(self, image, metadata):
        # Process image
        x = self.cnn(image)
        x = x.view(x.size(0), -1)
        
        # Process metadata
        meta = self.metadata_net(metadata)
        
        # Fusion
        combined = torch.cat((x, meta), dim=1)
        fused = self.fusion(combined)
        
        # Predictions
        location = self.location_head(fused)
        azimuth = self.azimuth_head(fused)
        
        return location, azimuth

app = Flask(__name__)

# Load the trained model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = HorizonCNN()
model_path = os.path.join(os.path.dirname(__file__), 'best_horizon_model.pth')
model.load_state_dict(torch.load(model_path, map_location=device)['model_state_dict'])
model.to(device)
model.eval()

# Define the image transform
transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.ToTensor(),
    transforms.Normalize([0.5], [0.5])
])

def denormalize_coordinates(normalized_coords):
    """Convert normalized coordinates back to degrees"""
    lat_rad = math.atan2(normalized_coords[0], normalized_coords[1])
    lon_rad = math.atan2(normalized_coords[2], normalized_coords[3])
    azimuth_rad = math.atan2(normalized_coords[4], normalized_coords[5])
    
    lat_deg = math.degrees(lat_rad)
    lon_deg = math.degrees(lon_rad)
    azimuth_deg = math.degrees(azimuth_rad)
    
    return lat_deg, lon_deg, azimuth_deg

def normalize_time(self, julian_date):
    """Convert Julian date to cyclical features"""
    day_of_year = (julian_date % 365.25) / 365.25 * 2 * math.pi
    return torch.tensor([
        math.sin(day_of_year),
        math.cos(day_of_year)
    ], dtype=torch.float32)

def normalize_time(julian_date):
    day_of_year = (julian_date % 365.25) / 365.25 * 2 * math.pi
    return torch.tensor([
        math.sin(day_of_year),
        math.cos(day_of_year)
    ], dtype=torch.float32)

def convert_date( date_str):
    """Convert date string to timestamp"""
    date = datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
    return date.timestamp()

def normalize_time(date):
    """Convert Julian date to cyclical features"""
    day_of_year = (date % 365.25) / 365.25 * 2 * math.pi
    return torch.tensor([
        math.sin(day_of_year),
        math.cos(day_of_year)
    ], dtype=torch.float32)

def file_uploaded(request):
    file = request.files['image']
    image = Image.open(file)
    image = transform(image)
    image = image.unsqueeze(0).to(device)

    time_features =  normalize_time(convert_date(request.form['date_time']))
    
    metadata = torch.cat([
        time_features,
        torch.tensor([1.0], dtype=torch.float32)
    ]).unsqueeze(0).to(device)
    
    with torch.no_grad():
        pred_location, pred_azimuth = model(image, metadata)

    latitude = pred_location[0][0].item() 
    longitude = pred_location[0][1].item()
    azimuth = pred_azimuth[0][0].item() 

    return jsonify({'latitude': latitude, 'longitude': longitude, 'azimuth': azimuth}), 200
