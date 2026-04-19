import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../styles/components/ui/popover";
import { Badge } from "../styles/components/ui/badge";
import { Bell } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import {
  getNotificationByUserIdAPI,
  readNotificationAPI,
} from "../services/notification.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDateTime } from "../utils/format";
import { Notification } from "../types";
import { useSidebar } from "../styles/components/ui/sidebar";
import { Button } from "../styles/components/ui/button";

function NotificationModal() {
  const { user } = useAuth();
  const userId = user?.id || "";
  const queryClient = useQueryClient();

  const { data: notificationList = [] } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => getNotificationByUserIdAPI(userId!),
    select: (res) => res.data,
    enabled: !!userId,
  });

  const unreadCount = notificationList.filter(
    (n: Notification) => !n.isRead,
  ).length;

  const handleRead = async (notiId: string) => {
    try {
      await readNotificationAPI(notiId, userId);
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    } catch (error) {
      console.log("errro", error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Notification</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="end"
        className="w-80 p-0 shadow-2xl border-slate-200 overflow-hidden rounded-2xl bg-white"
        sideOffset={10}
      >
        {/* Header */}
        <div className="p-4 border-b bg-white flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Thông báo</h3>
        </div>

        {/* List Notifications */}
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
          {notificationList.length > 0 ? (
            notificationList.map((noti: Notification) => (
              <div
                key={noti.id}
                onClick={() => handleRead(noti.id)}
                className={`group/item p-4 border-b last:border-0 hover:bg-slate-50 transition-all cursor-pointer relative
                           ${!noti.isRead ? "bg-blue-50/30" : ""}`}
              >
                {!noti.isRead && (
                  <div className="absolute right-4 top-5 w-2.5 h-2.5 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
                )}

                <div className="flex flex-col gap-1 pr-4">
                  <h4
                    className={`text-sm leading-tight ${!noti.isRead ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}
                  >
                    {noti.title}
                  </h4>

                  {/* Content giới hạn 2 dòng */}
                  <p className="text-xs text-slate-500 leading-normal line-clamp-2">
                    {noti.content}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-slate-400 font-medium italic">
                      {formatDateTime(noti.createdAt).full}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400">
              <Bell className="w-8 h-8 mb-2 opacity-20" />
              <p className="text-xs italic">Không có thông báo nào</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default NotificationModal;
