"use client";
import { Button } from "../../../../../shared/styles/components/ui/button";
import { Calendar } from "../../../../../shared/styles/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../../shared/styles/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../../shared/styles/components/ui/popover";
import { ScrollArea } from "../../../../../shared/styles/components/ui/scroll-area";
import { format } from "date-fns";
import { CalendarIcon, Star } from "lucide-react";
import React, { useState } from "react";

interface Feedback {
  id: string;
  storeName: string;
  email: string;
  comment: string;
  rating: number; // 0-5
}

const feedbacks: Feedback[] = [
  {
    id: "1",
    storeName: "SuperMart",
    email: "alice@example.com",
    comment: "Products arrived late, but quality was okay.",
    rating: 3.5,
  },
  {
    id: "2",
    storeName: "DailyGroceries",
    email: "bob@example.com",
    comment: "Very satisfied with fast delivery and good customer service!",
    rating: 5,
  },
  {
    id: "3",
    storeName: "TechHub",
    email: "charlie@example.com",
    comment: "Some items were missing in the package.",
    rating: 2,
  },
  {
    id: "4",
    storeName: "BookWorld",
    email: "diana@example.com",
    comment: "Great selection of books, will order again.",
    rating: 4.5,
  },
];

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<Star key={i} className="w-4 h-4 text-yellow-400" />);
    } else if (i - rating < 1) {
      stars.push(<Star key={i} className="w-4 h-4 text-yellow-200" />);
    } else {
      stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
    }
  }
  return stars;
};

const StoreFeedbackList = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [open, setOpen] = useState(false);
  return (
    <div className="">
      <h1 className="text-lg font-bold mb-4">Currently Feedback</h1>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="w-full">
            <CalendarIcon />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-auto">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      {/* LIST */}
      <ScrollArea className="h-[240px] mt-4">
        <div className="flex flex-col gap-3">
          {feedbacks.map((f) => (
            <Card
              key={f.id}
              className="p-4 border-0 shadow-sm gap-2 bg-slate-50 dark:bg-neutral-800"
            >
              <CardHeader className="p-0">
                <CardTitle className="text-sm font-semibold">
                  {f.storeName}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {f.email}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-sm">{f.comment}</p>
              </CardContent>
              <CardFooter className="p-0 flex items-center gap-1">
                {renderStars(f.rating)}
                <span className="text-xs text-muted-foreground ml-2">
                  {f.rating.toFixed(1)} / 5
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default StoreFeedbackList;
