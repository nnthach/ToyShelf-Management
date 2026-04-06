"use client";

import { useAppDispatch } from "@/src/redux/hooks";
import { setMyStore, setUser } from "@/src/redux/slice/authSlice";
import {
  acceptStoreInviteAPI,
  getMyStoreAPI,
  getMyStoreInviteAPI,
  rejectStoreInviteAPI,
} from "@/src/services/store-invite.service";
import { getMyProfileAPI } from "@/src/services/user.service";
import { formatStoreRoleToVN } from "@/src/utils/format";
import { getErrorMessage } from "@/src/utils/getErrorMessage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Calendar, Check, Store, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

export type StoreRole = "Owner" | "Manager" | "Staff" | "Admin";

export type InviteStatus = "Pending" | "Accepted" | "Rejected" | "Expired";

export interface StoreInvite {
  invitationId: string;
  storeId: string;
  storeName: string;
  invitedByName: string;
  storeRole: StoreRole;
  status: InviteStatus;
  createdAt: string;
  expiredAt: string;
}

export default function StoreInvitations() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const { data: storeInviteList = [], isLoading } = useQuery({
    queryKey: ["storeInvites"],
    queryFn: () => getMyStoreInviteAPI(),
    select: (res) => res.data,
  });

  const handleAccept = async (id: string) => {
    try {
      await acceptStoreInviteAPI(id);

      queryClient.invalidateQueries({ queryKey: ["storeInvites"] });

      const fetchProfileRes = await getMyProfileAPI();
      const roles = JSON.parse(localStorage.getItem("roles") || "[]");

      const payload = {
        ...fetchProfileRes.data,
        roles,
      };

      console.log("payload", payload);

      dispatch(setUser(payload));

      const myStoreRes = await getMyStoreAPI();

      if (myStoreRes.data.length > 0) {
        dispatch(setMyStore(myStoreRes.data[0]));
      }

      toast.success("Chào mừng bạn!");
      router.replace("/manager/dashboard");
    } catch (error) {
      console.log("accept invite err", error);
      toast.error(getErrorMessage(error, "Chấp nhận lời mời thất bại"));
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectStoreInviteAPI(id);

      queryClient.invalidateQueries({ queryKey: ["storeInvites"] });
    } catch (error) {
      console.log("reject invite err", error);
      toast.error(getErrorMessage(error, "Từ chối lời mời thất bại"));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Bell size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                Lời mời vào cửa hàng
              </h1>
              <p className="text-sm text-slate-500">
                Bạn có {storeInviteList.length} lời mời đang chờ
              </p>
            </div>
          </div>
        </div>

        {/* Danh sách Scroll */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {isLoading ? (
            <div className="py-10 text-center text-slate-400">Đang tải...</div>
          ) : storeInviteList.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-slate-400 italic">
                Không có lời mời nào dành cho bạn.
              </p>
            </div>
          ) : (
            storeInviteList.map((invite: StoreInvite) => (
              <div
                key={invite.invitationId}
                className="p-4 rounded-xl border border-slate-200 hover:border-primary/30 transition-colors bg-white shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Store size={18} className="text-primary" />
                    <span className="font-bold text-slate-800">
                      {invite.storeName}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-1 bg-blue-50 text-blue-600 rounded-full font-bold uppercase">
                    {formatStoreRoleToVN(invite.storeRole)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <User size={14} />
                    <span>
                      Mời bởi:{" "}
                      <b className="text-slate-700">{invite.invitedByName}</b>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar size={14} />
                    <span>
                      Ngày mời:{" "}
                      {new Date(invite.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button
                    onClick={() => handleReject(invite.invitationId)}
                    className="flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-all"
                  >
                    <X size={16} /> Từ chối
                  </button>
                  <button
                    onClick={() => handleAccept(invite.invitationId)}
                    className="flex items-center justify-center gap-2 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-medium shadow-md shadow-primary/20 transition-all"
                  >
                    <Check size={16} /> Chấp nhận
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={() => router.back()}
            className="text-sm text-slate-500 hover:text-primary transition-colors"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
