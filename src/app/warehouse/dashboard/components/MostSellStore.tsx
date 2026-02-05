import React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../../styles/components/ui/card";
import { ShoppingCart, Users, DollarSign } from "lucide-react";

const MostSellStore = () => {
  return (
    <Card className="flex flex-col h-full border-none p-0 max-w-sm shadow-none">
      <CardHeader className="p-0">
        <CardTitle className="text-lg font-bold">
          C\u1eeda h\u00e0ng b\u00e1n ch\u1ea1y nh\u1ea5t
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          C\u1eeda h\u00e0ng b\u00e1n nhi\u1ec1u s\u1ea3n ph\u1ea9m nh\u1ea5t
          th\u00e1ng n\u00e0y
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex flex-col gap-2">
        <div className="relative w-full aspect-4/3 rounded-md overflow-hidden">
          <Image
            src="https://dddn.1cdn.vn/2020/08/03/diendandoanhnghiep.vn-media-uploaded-493-2020-07-28-_ven6oi9tabzmnhzp3atbcx-enternews-1595875625.jpg"
            alt="Most Sell Store"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex justify-between mt-2">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-500" />
            <span>1,200</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span>$25,000</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" />
            <span>800</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-0 text-sm text-muted-foreground">
        Trend: 🔺 +5% vs last month
      </CardFooter>
    </Card>
  );
};

export default MostSellStore;
