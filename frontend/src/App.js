import React, { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
} from "./components/ui/card";
import { Calendar } from "./components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover"
import { format } from 'date-fns';
import { cn } from './lib/utils';


function ImageInputCard({ label, accept, onChange }) {
  return (
    <Card className="w-auto">
      <CardContent className="p-6 space-y-4">
        <div className="border border-dashed rounded-lg flex flex-col gap-1 p-6 items-center">
        <FileIcon className="w-6 h-6" />
        <span className="text-sm font-medium text-muted">
            Drag and drop a file or click to browse
          </span>
          <span className="text-xs text-muted">{accept}</span>
        </div>
        <div className="space-y-2 text-sm">
          <Label htmlFor={label.toLowerCase()} className="text-sm font-medium">
            {label}
          </Label>
          <Input
            id={label.toLowerCase()}
            type="file"
            placeholder="File"
            accept={accept}
            onChange={onChange}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button size="lg">Upload</Button>
      </CardFooter>
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
  const [date, setDate] = useState()

  const handleFileChange = (position) => (event) => {
    const file = event.target.files[0];
    setImages((prev) => ({
      ...prev,
      [position]: file,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Submitted Images:", images);
    // Add your logic to handle the images (e.g., send to an API or process locally)
  };

  return (
    <form onSubmit={handleSubmit} className="p-10">
      <div id="image-upload" className="grid grid-cols-2 gap-10 m-auto">
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
      </div>

      <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          {/* <CalendarIcon /> */}
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>


      <div className="mt-6">
        <Button type="submit" size="lg">
          Submit
        </Button>
      </div>
    </form>
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
  )
}

export default App;
