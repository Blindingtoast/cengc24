import axios from 'axios';
import React, { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { useDropzone } from "react-dropzone";
import { Particles } from "./components/ui/particles";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";

function ImageInputCard({ label, accept, onChange }) {
  const [preview, setPreview] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setPreview(URL.createObjectURL(file));
        onChange({ target: { files: acceptedFiles } });
      }
    },
  });

  return (
    <Card className="w-auto">
      <CardTitle>{label}</CardTitle>
      <CardContent >
        <div
          {...getRootProps()}
          className={`border border-dashed rounded-lg flex gap-4 p-4 items-center cursor-pointer ${isDragActive ? "bg-gray-100 border-blue-500" : ""
            }`}
        >
          <div>
            {preview ? (
              <div className="mt-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-md border"
                />
              </div>
            ) :
              <div className="w-24 h-24 bg-muted rounded-md flex justify-center items-center"><FileIcon className="w-6 h-6" /></div>
            }
          </div>
          <div>
            <input {...getInputProps()} />
            <span className="text-sm font-medium text-muted">
              Drag and drop an image or click to browse
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function App() {
  const [images, setImages] = useState({
    bow: null,
    stern: null,
    port: null,
    starboard: null,
  });
  const [month, setMonth] = useState('0');
  const [day, setDay] = useState('0');
  const [hour, setHour] = useState('0');
  const [minute, setMinute] = useState('0');

  const [resuts, setResults] = useState({
    longitude: null,
    latitude: null,
    altitude: null,
  });

  const handleFileChange = (position) => (event) => {
    const file = event.target.files[0];
    setImages((prev) => ({
      ...prev,
      [position]: file,
    }));
  };

  const handleMonthChange = (e) => {
    const value = e.target.value;
    if (/^(0?[1-9]|1[0-2])?$/.test(value)) {
      setMonth(value);
      setDay('');
    }
  };

  const handleDayChange = (e) => {
    const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const value = e.target.value;
    if (value === '' || (Number(value) >= 1 && Number(value) <= (daysInMonth[month] || 31))) {
      setDay(value);
    }
  };

  const handleHourChange = (e) => {
    const value = e.target.value;
    if (/^(0?[0-9]|1[0-9]|2[0-3])?$/.test(value)) {
      setHour(value);
    }
  };

  const handleMinuteChange = (e) => {
    const value = e.target.value;
    if (/^(0?[0-9]|[1-5][0-9])?$/.test(value)) {
      setMinute(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const formData = new FormData();

    // Append images to formData
    Object.keys(images).forEach((position) => {
        if (images[position]) {
            formData.append(position, images[position]);
        }
    });

    try {
        const response = await axios.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(response.data);
        alert('Files uploaded successfully!');
    } catch (error) {
        console.error('Error uploading files:', error);
        alert('Failed to upload files. Please try again.');
    }
};


  return (
    <div className="max-w-[1000px] m-auto">
      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        color="#5b6f95"
        refresh
      />
      <div className="text-5xl font-bold mt-10 mb-4 text-center">wya? we know!</div>
      <div className="text-lg font-semibold text-center text-muted-foreground">
        Ever confused about where you are? Don't know where you are going? We got you covered!
      </div>
      <form onSubmit={handleSubmit} className="p-10">
        <div id="image-upload" className="grid grid-cols-2 gap-4 m-auto">
          <ImageInputCard
            label="Bow"
            accept="image/*"
            onChange={handleFileChange("bow")}
          />
          <ImageInputCard
            label="Stern"
            accept="image/*"
            onChange={handleFileChange("stern")}
          />
          <ImageInputCard
            label="Port"
            accept="image/*"
            onChange={handleFileChange("port")}
          />
          <ImageInputCard
            label="Starboard"
            accept="image/*"
            onChange={handleFileChange("starboard")}
          />

          <Card>
            <CardTitle>Date</CardTitle>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="month">
                  Month
                </Label>
                <Input
                  id="month"
                  name="month"
                  type="number"
                  required
                  value={month}
                  onChange={handleMonthChange}
                  placeholder="mm"
                />
              </div>


              <div className="space-y-2">
                <Label htmlFor="day" className={(!month && 'text-muted')}>
                  Day
                </Label>
                <Input
                  id="day"
                  name="day"
                  type="number"
                  required
                  value={day}
                  onChange={handleDayChange}
                  disabled={!month}
                  placeholder="dd"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardTitle>Time</CardTitle>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hour">
                  Hour
                </Label>
                <Input
                  id="hour"
                  name="hour"
                  type="number"
                  required
                  value={hour}
                  onChange={handleHourChange}
                  placeholder="hh"
                />
              </div>


              <div className="space-y-2">
                <Label htmlFor="minute">
                  Minute
                </Label>
                <Input
                  id="minute"
                  name="minute"
                  type="number"
                  required
                  value={minute}
                  onChange={handleMinuteChange}
                  placeholder="mm"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" size="lg">
            Submit
          </Button>
        </div>
      </form>

      <div className="w-full px-10 rounded-md">
        <div className="w-full flex gap-4">
          <Card className="bg-popover grow">
            <CardHeader className="text-lg">
              Longitude
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-semibold">
              {"numbers"}
            </div>
            </CardContent>
          </Card>

          <Card className="bg-popover grow">
            <CardHeader className="text-lg">
              Longitude
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-semibold">
              {"numbers"}
            </div></CardContent>
          </Card>

          <Card className="bg-popover grow">
            <CardHeader className="text-lg">
              Longitude
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-semibold">
              {"numbers"}
            </div></CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}

function FileIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

export default App;
