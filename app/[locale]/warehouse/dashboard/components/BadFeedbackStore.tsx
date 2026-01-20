import React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../../../shared/styles/components/ui/card";
import { Star } from "lucide-react";

const BadFeedBackStore = () => {
  const rating = 2.5; // điểm đánh giá ví dụ
  const totalReviews = 120;

  // Hàm render star
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

  return (
    <Card className="flex flex-col h-full border-none p-0 max-w-sm shadow-none">
      <CardHeader className="p-0">
        <CardTitle className="text-lg font-bold">
          Store With Bad Feedback
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Customers rated this store low
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 flex flex-col gap-2">
        <div className="relative w-full aspect-4/3 rounded-md overflow-hidden">
          <Image
            src="https://dddn.1cdn.vn/2020/08/03/diendandoanhnghiep.vn-media-uploaded-493-2020-07-28-_ven6oi9tabzmnhzp3atbcx-enternews-1595875625.jpg"
            alt="Bad Feedback Store"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex items-center gap-1">
          {renderStars(rating)}
          <span className="text-sm text-muted-foreground ml-2">
            {rating.toFixed(1)} / 5 ({totalReviews} reviews)
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-0  text-sm text-muted-foreground">
        Trend: 🔻 Low ratings this month
      </CardFooter>
    </Card>
  );
};

export default BadFeedBackStore;
