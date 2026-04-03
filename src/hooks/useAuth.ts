"use client";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  logout,
  setLoading,
  setMyStore,
  setPartner,
  setUser,
  setWarehouse,
} from "../redux/slice/authSlice";
import {
  getMyPartnerProfileAPI,
  getMyProfileAPI,
  getMyWarehouseProfileAPI,
} from "../services/user.service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { getMyStoreAPI } from "../services/store-invite.service";
import { LoginRes } from "../types/SubType";

export function useAuth() {
  const router = useRouter();
  const { user, partner, myStore, isLoading, warehouse } = useAppSelector(
    (state) => state.auth,
  );
  const dispatch = useAppDispatch();

  const navigateByRole = (roles: string[]) => {
    if (roles.includes("Admin")) {
      router.replace("/admin/dashboard");
      return;
    }

    if (roles.includes("PartnerAdmin")) {
      router.replace("/partner/dashboard");
      return;
    }

    if (roles.includes("Partner")) {
      router.replace("/manager/dashboard");
      return;
    }

    if (roles.includes("Customer")) {
      toast.error("Hệ thống dành cho quản trị viên!");
      return;
    }
  };

  const isAtAuthPage = () => {
    const pathname = window.location.pathname;
    return pathname === "/" || pathname === "/login";
  };

  const initAuth = async () => {
    const token = localStorage.getItem("token");
    const roles = JSON.parse(localStorage.getItem("roles") || "[]");

    dispatch(setLoading(true));

    try {
      if (token && !user) {
        const userProfile = await getMyProfileAPI();
        const data = userProfile.data;
        dispatch(setUser({ ...data, roles }));

        // if role partnerAdmin => get partner by userId
        if (roles.includes("PartnerAdmin")) {
          const partnerDetail = await getMyPartnerProfileAPI({
            userId: userProfile.data.id,
          });
          dispatch(setPartner(partnerDetail.data));
        }

        // if role warehouse => get warehouse by userId
        if (roles.includes("Warehouse")) {
          const warehouseDetail = await getMyWarehouseProfileAPI({
            userId: userProfile.data.id,
          });
          dispatch(setWarehouse(warehouseDetail.data[0]));
          if (warehouseDetail?.data[0]?.warehouseRole === "Manager") {
            router.replace("/warehouse/dashboard");
            toast.success("Đăng nhập thành công");
          } else {
            toast.error("Bạn không có quyền truy cập vào hệ thống!");
            logoutUser();
          }
          return;
        }

        // if role partner (manager/staff)=> get store detail
        if (roles.includes("Partner")) {
          const myStoreRes = await getMyStoreAPI();

          if (myStoreRes.data.length > 0) {
            dispatch(setMyStore(myStoreRes.data[0]));
          } else {
            router.replace("/store-invitations");
            return;
          }
        }

        if (isAtAuthPage()) {
          navigateByRole(roles);
        }
      } else {
        dispatch(logout());
      }
    } catch (error) {
      dispatch(logout());
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLoginSuccess = async (res: LoginRes) => {
    const token = res.data?.accessToken;
    const roles = res.data?.roles;

    localStorage.setItem("token", token);
    localStorage.setItem("roles", JSON.stringify(roles));

    const fetchProfileRes = await getMyProfileAPI();

    const payload = {
      ...fetchProfileRes.data,
      roles,
    };

    dispatch(setUser(payload));

    // if role partnerAdmin => get partner by userId
    if (roles.includes("PartnerAdmin")) {
      const partnerDetail = await getMyPartnerProfileAPI({
        userId: fetchProfileRes.data.id,
      });

      dispatch(setPartner(partnerDetail.data));
    }

    // if role warehouse => get warehouse by userId
    if (roles.includes("Warehouse")) {
      const warehouseDetail = await getMyWarehouseProfileAPI({
        userId: fetchProfileRes.data.id,
      });
      dispatch(setWarehouse(warehouseDetail.data[0]));

      if (warehouseDetail?.data[0]?.warehouseRole === "Manager") {
        router.replace("/warehouse/dashboard");
        toast.success("Đăng nhập thành công");

        return;
      } else {
        toast.error("Bạn không có quyền truy cập vào hệ thống!");
        return;
      }
    }

    toast.success("Đăng nhập thành công");

    // if role partner (manager/staff)=> get store detail
    if (roles.includes("Partner")) {
      const myStoreRes = await getMyStoreAPI();

      if (myStoreRes.data.length > 0) {
        dispatch(setMyStore(myStoreRes.data[0]));
      } else {
        router.replace("/store-invitations");
        return;
      }
    }

    navigateByRole(roles);
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    dispatch(logout());
    toast.success("Đăng xuất thành công");
    router.replace("/");
  };

  return {
    initAuth,
    user,
    partner,
    myStore,
    warehouse,
    isLoading,
    logout: logoutUser,
    handleLoginSuccess,
  };
}
