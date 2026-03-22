"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  logout,
  setLoading,
  setMyStore,
  setPartner,
  setUser,
} from "../redux/slice/authSlice";
import {
  getMyPartnerProfileAPI,
  getMyProfileAPI,
} from "../services/user.service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { getMyStoreAPI } from "../services/store-invite.service";
import { LoginRes } from "../types/SubType";

export function useAuth() {
  const router = useRouter();
  const { user, partner, myStore, isLoading } = useAppSelector(
    (state) => state.auth,
  );
  const dispatch = useAppDispatch();

  const initAuth = async () => {
    const token = localStorage.getItem("token");
    const roles = JSON.parse(localStorage.getItem("roles") || "[]");

    if (token && !user) {
      dispatch(setLoading(true));
      try {
        const userProfile = await getMyProfileAPI();
        const data = userProfile.data;

        if (roles.includes("PartnerAdmin")) {
          const partnerDetail = await getMyPartnerProfileAPI({
            userId: userProfile.data.id,
          });
          dispatch(setPartner(partnerDetail.data));
        }
        if (roles.includes("Partner")) {
          const myStoreRes = await getMyStoreAPI();
          console.log("mystore", myStoreRes);
          dispatch(setMyStore(myStoreRes.data[0]));
        }

        dispatch(setUser(data));
      } catch (error) {
        dispatch(logout());
      } finally {
        dispatch(setLoading(false));
      }
    } else if (!token && user) {
      dispatch(logout());
    } else if (!token && !user) {
      dispatch(setLoading(false));
    }
  };

  const handleLoginSuccess = async (res: LoginRes) => {
    const token = res.data?.accessToken;
    const roles = res.data?.roles;

    localStorage.setItem("token", token);
    localStorage.setItem("roles", JSON.stringify(roles));

    const fetchProfileRes = await getMyProfileAPI();

    if (roles.includes("PartnerAdmin")) {
      const partnerDetail = await getMyPartnerProfileAPI({
        userId: fetchProfileRes.data.id,
      });

      dispatch(setPartner(partnerDetail.data));
    }
    if (roles.includes("Partner")) {
      const myStoreRes = await getMyStoreAPI();
      dispatch(setMyStore(myStoreRes.data[0]));
    }

    const payload = {
      ...fetchProfileRes.data,
      roles,
    };

    dispatch(setUser(payload));

    toast.success("Đăng nhập thành công");

    if (roles.includes("Admin")) {
      router.replace("/admin/dashboard");
      return;
    }

    if (roles.includes("PartnerAdmin")) {
      router.replace("/partner/dashboard");
      return;
    }

    if (roles.includes("Warehouse")) {
      router.replace("/warehouse/dashboard");
      return;
    }

    if (roles.includes("Partner")) {
      router.replace("/manager/dashboard");
      return;
    }

    if (roles.includes("Customer")) {
      toast.error("Hệ thống dành cho quản trị viên!");
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    dispatch(logout());
    toast.success("Đăng xuất thành công");
    router.replace("/");
  };

  return {
    user,
    partner,
    myStore,
    isLoading,
    logout: logoutUser,
    handleLoginSuccess,
  };
}
