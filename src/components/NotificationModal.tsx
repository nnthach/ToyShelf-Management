import { ReactNode } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../styles/components/ui/popover";
import { Badge } from "../styles/components/ui/badge";
import { Bell } from "lucide-react";

type SidebarItem = {
  title: string;
  icon: React.ElementType;
  badge?: boolean;
  action?: string;
};

function NotificationModal({ item }: { item: SidebarItem }) {
  const Icon = item.icon;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className="flex items-center justify-between transition-colors
              text-muted-foreground hover:bg-accent px-2 py-1"
        >
          <button className="flex items-center gap-2 rounded-md w-full">
            <Icon className="w-4 h-4" />
            <span>{item.title}</span>
          </button>

          <Badge className="bg-green-100 text-green-700 rounded-full w-6 h-6 p-0 flex items-center justify-center">
            <Bell className="w-3 h-3" />
          </Badge>
        </div>
      </PopoverTrigger>

      <PopoverContent
        side="right"
        align="start"
        className="w-80 p-0"
        sideOffset={14}
      >
        <div className="p-3 border-b font-medium">Thông báo</div>

        <div className="max-h-80 overflow-y-auto">
          <div className="p-3 hover:bg-gray-50 cursor-pointer">
            Bạn có đơn hàng mới
          </div>
          <div className="p-3 hover:bg-gray-50 cursor-pointer">
            Nhân viên mới được thêm
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default NotificationModal;
