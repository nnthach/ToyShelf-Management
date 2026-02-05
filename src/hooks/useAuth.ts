"use client";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout, setLoading, setUser } from "../redux/slice/authSlice";
import { getMyProfileAPI } from "../services/user.service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const initAuth = async () => {
    const token = localStorage.getItem("token");

    if (token && !user) {
      dispatch(setLoading(true));
      try {
        const userProfile = await getMyProfileAPI();
        const data = userProfile.data;

        dispatch(setUser(data));
      } catch (error) {
        console.log("init auth err", error);
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

  return { user, logout: logoutUser };
}
