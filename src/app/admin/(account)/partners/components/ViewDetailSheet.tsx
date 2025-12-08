import { Button } from "@/styles/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/styles/components/ui/card";
import { Input } from "@/styles/components/ui/input";
import { Label } from "@/styles/components/ui/label";
import { ScrollArea } from "@/styles/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/styles/components/ui/sheet";
import { DollarSign, Eye, Home } from "lucide-react";
import { User } from "types";

function ViewDetailSheet({ user }: { user: User }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <span title="Detail" className="cursor-pointer text-blue-400">
          <Eye />
        </span>
      </SheetTrigger>
      <SheetContent className="w-full !max-w-[1200px]">
        <SheetHeader>
          <SheetTitle>Partner Information</SheetTitle>
          <SheetDescription>Information about {user.email}</SheetDescription>
        </SheetHeader>
        <div className="flex bg-gray-200 dark:bg-muted h-full">
          {/*Left */}
          <div className="w-[70%] p-4">
            {/* --- Top Stats Cards --- */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex items-center justify-center">
                        <Home className="text-white dark:text-black" />
                      </div>
                      <p className="text-primary text-lg">Total Orders</p>
                    </div>

                    <p className="text-xl font-bold text-primary">7 Orders</p>
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
                      <p className="text-primary text-lg">Total Spending</p>
                    </div>

                    <p className="text-xl font-bold text-primary">
                      19,000,000 VND
                    </p>
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* --- Recent order --- */}
            <div className="mt-4 border rounded-lg bg-background">
              <div className="border-b px-4 py-3 bg-background">
                <p className="font-medium">
                  Recent Orders <span className="text-gray-500">(9)</span>
                </p>
              </div>

              {/* Item */}
              <ScrollArea className="h-[380px] mt-3">
                <div className="flex flex-col gap-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 px-4 hover:bg-gray-200 dark:hover:bg-accent"
                    >
                      {/* Thumbnail */}
                      <div className="w-16 h-16 rounded-md bg-gray-200" />

                      {/* Info */}
                      <div className="flex-1">
                        <p className="font-semibold">
                          £{(2300000 - i * 100000).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          📍 London, St John’s Hill 62
                        </p>
                      </div>

                      {/* Status */}
                      <span className="px-3 py-1 text-xs rounded-md bg-green-100 text-green-700">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/*Right */}
          <div className="bg-background flex-1 border-t border-border flex flex-col">
            <div className="grid flex-1 auto-rows-min gap-6 px-4 mt-4">
              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-name">Name</Label>
                <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-username">Username</Label>
                <Input id="sheet-demo-username" defaultValue="@peduarte" />
              </div>
            </div>

            <SheetFooter>
              <Button type="submit">Save changes</Button>
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
            </SheetFooter>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ViewDetailSheet;
