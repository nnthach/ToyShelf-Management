import {
  Card,
  CardHeader,
  CardTitle,
} from "@/src/styles/components/ui/card";
import { Box, DollarSign, Home } from "lucide-react";
import BarChartExample from "./BarChart";

function ProductStatistics() {
  return (
    <div className="flex flex-col gap-3">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex items-center justify-center">
                  <Box className="text-white dark:text-black" />
                </div>
                <p className="text-primary text-lg">Total Products Sold</p>
              </div>

              <p className="text-xl font-bold text-primary">7 Products</p>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Card 2 */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex items-center justify-center">
                  <DollarSign className="text-white dark:text-black" />
                </div>
                <p className="text-primary text-lg">Total Order Buy Product</p>
              </div>

              <p className="text-xl font-bold text-primary">12 Orders</p>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/*Chart */}
      <div className="bg-white dark:bg-background p-4 rounded-lg h-[400px] w-full">
        <BarChartExample />
      </div>
    </div>
  );
}

export default ProductStatistics;
