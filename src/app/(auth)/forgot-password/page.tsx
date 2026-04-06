"use client";

import {
  forgotPasswordRequestAPI,
  forgotPasswordResetAPI,
} from "@/src/services/user.service";
import { Button } from "@/src/styles/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/styles/components/ui/card";
import { FieldGroup, FieldLabel } from "@/src/styles/components/ui/field";
import { Input } from "@/src/styles/components/ui/input";
import { getErrorMessage } from "@/src/utils/getErrorMessage";
import { ArrowLeft, Eye, EyeOff, LogIn, LogOut, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isViewPassword, setIsViewPassword] = useState(false);
  const [isViewNewPassword, setIsViewNewPassword] = useState(false);

  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);

  const [form, setForm] = useState({
    email: "",
    otpCode: "",
    newPassword: "",
    confirmPassword: "",
  });

  async function onSubmit(data: typeof form) {
    setIsLoading(true);
    if (forgotPasswordStep === 1) {
      try {
        await forgotPasswordRequestAPI(data.email);

        toast.success("Mã OTP đã được gửi đến email của bạn");

        setForgotPasswordStep(2);
      } catch (error) {
        toast.error(getErrorMessage(error, "Gửi mã OTP thất bại"));
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        await forgotPasswordResetAPI(data);

        setForm({
          email: "",
          otpCode: "",
          newPassword: "",
          confirmPassword: "",
        });

        toast.success("Đặt lại mật khẩu thành công");

        router.replace("/");
      } catch (error) {
        toast.error(getErrorMessage(error, "Đặt lại mật khẩu thất bại"));
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#dde8f0]">
      {/* --- BACKGROUND LAYER (Giống bản mẫu) --- */}
      <div className="absolute inset-0 z-0">
        {/* Mesh Gradient */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(circle at 15% 10%, #b8d9ef 0%, transparent 60%), radial-gradient(circle at 85% 90%, #96c8e6 0%, transparent 55%)",
          }}
        ></div>

        {/* Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(#2d6a9f 1px, transparent 1px), linear-gradient(90deg, #2d6a9f 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        ></div>

        {/* Animated Orbs */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-300/20 blur-[90px] -top-40 -left-20 animate-drift duration-[13s]"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full bg-blue-400/15 blur-[90px] -bottom-20 -right-10 animate-drift duration-[10s] delay-[-4s]"></div>
      </div>

      <Card className="w-full max-w-[420px] shadow-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-2xl border-white/70 rounded-[28px] overflow-hidden">
        <CardHeader className="text-center">
          <CardTitle className="font-bold text-2xl">
            <div className=" flex items-center gap-1 justify-center">
              <div className="relative w-[50px] h-[50px]">
                <Image
                  src="/images/finallogo.png"
                  alt="ToyShelf logo"
                  fill
                  className="object-contain"
                />
              </div>
              {/*#0D47A1 */}
              <p className="text-[#1E88E5] font-bold text-xl">ToyShelf</p>
            </div>
          </CardTitle>
          <CardDescription className="font-medium">
            Đặt lại mật khẩu
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            id="form-rhf-demo"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(form);
            }}
            className="space-y-3"
          >
            {forgotPasswordStep === 1 ? (
              <FieldGroup className="gap-1">
                <FieldLabel
                  htmlFor="email"
                  className="text-[10px] uppercase font-bold text-gray-400 ml-1"
                >
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="bg-white/60 border-blue-100 focus:bg-white rounded-lg h-11 pr-10"
                  placeholder="abc@example.com"
                  autoComplete="off"
                />
              </FieldGroup>
            ) : (
              <>
                <FieldGroup className="gap-1">
                  <FieldLabel
                    className="text-[10px] uppercase font-bold text-gray-400 ml-1"
                    htmlFor="otpCode"
                  >
                    Mã OTP
                  </FieldLabel>
                  <Input
                    value={form.otpCode}
                    className="bg-white/60 border-blue-100 focus:bg-white rounded-lg h-11 pr-10"
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, otpCode: e.target.value }))
                    }
                    placeholder="123456"
                  />
                </FieldGroup>
                <FieldGroup className="gap-1">
                  <FieldLabel
                    className="text-[10px] uppercase font-bold text-gray-400 ml-1"
                    htmlFor="newPassword"
                  >
                    Mật khẩu mới
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      type={isViewPassword ? "text" : "password"}
                      className="bg-white/60 border-blue-100 focus:bg-white rounded-lg h-11 pr-10"
                      value={form.newPassword}
                      placeholder="******"
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                    />
                    <span
                      onClick={() => setIsViewPassword(!isViewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    >
                      {isViewPassword ? (
                        <EyeOff size={18} className="text-gray-500" />
                      ) : (
                        <Eye size={18} className="text-gray-500" />
                      )}
                    </span>
                  </div>
                </FieldGroup>

                <FieldGroup className="gap-1">
                  <FieldLabel
                    className="text-[10px] uppercase font-bold text-gray-400 ml-1"
                    htmlFor="confirmPassword"
                  >
                    Xác nhận mật khẩu mới
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      type={isViewNewPassword ? "text" : "password"}
                      className="bg-white/60 border-blue-100 focus:bg-white rounded-lg h-11 pr-10"
                      value={form.confirmPassword}
                      placeholder="******"
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                    />
                    <span
                      onClick={() => setIsViewNewPassword(!isViewNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    >
                      {isViewNewPassword ? (
                        <EyeOff size={18} className="text-gray-500" />
                      ) : (
                        <Eye size={18} className="text-gray-500" />
                      )}
                    </span>
                  </div>
                </FieldGroup>
              </>
            )}
          </form>
        </CardContent>

        <CardFooter className="flex justify-between gap-3">
          {forgotPasswordStep === 1 ? (
            <>
              <Button
                type="button"
                variant={"outline"}
                className="w-[48%]"
                disabled={isLoading}
                onClick={() => router.replace("/")}
              >
                <ArrowLeft />
                Quay về
              </Button>
              <Button
                type="submit"
                form="form-rhf-demo"
                className="w-[48%] bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/25 transition-all active:scale-95"
                disabled={isLoading}
              >
                <Mail />
                Gửi mã OTP
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant={"outline"}
                className="w-[48%]"
                disabled={isLoading}
                onClick={() => setForgotPasswordStep(1)}
              >
                <ArrowLeft />
                Quay về
              </Button>
              <Button
                type="submit"
                form="form-rhf-demo"
                className="w-[48%] bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/25 transition-all active:scale-95"
                disabled={isLoading}
              >
                <LogIn />
                Cập nhật mật khẩu
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
