"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/styles/components/ui/sheet";

import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/src/styles/components/ui/card";
import { DollarSign, Home } from "lucide-react";
import { ScrollArea } from "@/src/styles/components/ui/scroll-area";

function ViewPartnerSheet({ children }: { children: React.ReactNode }) {
  const router = useRouter();


  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full !max-w-[800px]">
        <SheetHeader className="pb-0">
          <SheetTitle className="">
            <h1 className="text-xl">Chi tiết đối tác</h1>
          </SheetTitle>
        </SheetHeader>
        <div className="flex bg-gray-200 dark:bg-muted h-full p-4">
          <div className="w-full">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex items-center justify-center">
                        <DollarSign className="text-white dark:text-black" />
                      </div>
                      <p className="text-primary text-lg">Total Sales</p>
                    </div>

                    <p className="text-xl font-bold text-primary">
                      19,000,000 VND
                    </p>
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
                      <p className="text-primary text-lg">Net Revenue</p>
                    </div>

                    <p className="text-xl font-bold text-primary">
                      9,000,000 VND
                    </p>
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* --- Recent Payments to Franchise Partner --- */}
            <div className="mt-4 border rounded-xl bg-background overflow-hidden">
              {/* Header */}
              <div className="border-b px-4 py-3">
                <p className="font-semibold">
                  Recent Payments <span className="text-gray-500">(9)</span>
                </p>
                <p className="text-sm text-gray-500">
                  Payment history to franchise partners
                </p>
              </div>

              {/* List */}
              <ScrollArea className="h-[300px] pb-4">
                <div className="flex flex-col divide-y">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-accent"
                    >
                      {/* Date */}
                      <div className="w-20 text-sm text-gray-500">
                        <p className="font-medium text-gray-700">
                          Jan {10 + i}
                        </p>
                        <p className="text-xs">2026</p>
                      </div>

                      {/* Amount + Note */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold">
                          £{(2300000 - i * 100000).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          Franchise revenue payout – London Branch
                        </p>
                      </div>

                      {/* Receiver / Banking Owner */}
                      <div className="w-40 text-sm">
                        <p className="font-medium text-gray-800">
                          Nguyễn Ngọc Thạch
                        </p>
                        <p className="text-xs text-gray-500">
                          Vietcombank
                        </p>
                      </div>

                      {/* Status */}
                      <span className="px-3 py-1 text-xs rounded-md bg-green-100 text-green-700">
                        Completed
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ViewPartnerSheet;
