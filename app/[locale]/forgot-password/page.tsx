"use client";

import { useAppDispatch, useAppSelector } from "@/shared/redux/hooks";
import { setUser } from "@/shared/redux/slice/authSlice";
import {
  forgotPasswordRequestAPI,
  forgotPasswordResetAPI,
  getMyProfileAPI,
  loginAPI,
} from "@/shared/services/user.service";
import { Button } from "@/shared/styles/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/styles/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/styles/components/ui/field";
import { Input } from "@/shared/styles/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z, { set } from "zod";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const locale = useLocale();

  const [isLoading, setIsLoading] = useState(false);

  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);

  const [form, setForm] = useState({
    email: "",
    otpCode: "",
    newPassword: "",
    confirmPassword: "",
  });

  async function onSubmit(data: typeof form) {
    setIsLoading(true);
    console.log("data", data);
    if (forgotPasswordStep === 1) {
      try {
        const res = await forgotPasswordRequestAPI(data.email);

        console.log("res", res);

        toast.success(
          locale === "vi"
            ? "Mã OTP đã được gửi đến email của bạn"
            : "OTP code has been sent to your email",
        );

        setForgotPasswordStep(2);
      } catch (error) {
        toast.error(
          locale === "vi" ? "Gửi mã OTP thất bại" : "Failed to send OTP code!",
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const res = await forgotPasswordResetAPI(data);

        console.log("res", res);

        setForm({
          email: "",
          otpCode: "",
          newPassword: "",
          confirmPassword: "",
        });

        toast.success(
          locale === "vi"
            ? "Đặt lại mật khẩu thành công"
            : "Reset password successfully!",
        );

        router.replace("/");
      } catch (error) {
        toast.error(
          locale === "vi"
            ? "Đặt lại mật khẩu thất bại"
            : "Failed to reset password!",
        );
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url(/images/home_background.jpg)" }}
    >
      <Card className="w-full max-w-md shadow-xl bg-white/80 dark:bg-card/80 backdrop-blur-md">
        <CardHeader className="text-center">
          <CardTitle className="font-bold text-2xl">
            <div className=" flex items-center gap-1 justify-center">
              <div className="relative w-[50px] h-[50px]">
                <Image
                  src="/images/finallogo.png"
                  alt="Toyscabin logo"
                  fill
                  className="object-contain"
                />
              </div>
              {/*#0D47A1 */}
              <p className="text-[#1E88E5] font-bold text-xl">Toys Shelf</p>
            </div>
          </CardTitle>
          <CardDescription>Đặt lại mật khẩu</CardDescription>
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
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="abc@example.com"
                  autoComplete="off"
                />
              </FieldGroup>
            ) : (
              <>
                <FieldGroup className="gap-1">
                  <FieldLabel htmlFor="otpCode">Mã OTP</FieldLabel>
                  <Input
                    value={form.otpCode}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, otpCode: e.target.value }))
                    }
                    placeholder="123456"
                  />
                </FieldGroup>
                <FieldGroup className="gap-1">
                  <FieldLabel htmlFor="newPassword">Mật khẩu mới</FieldLabel>
                  <Input
                    type="password"
                    value={form.newPassword}
                    placeholder="******"
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                  />
                </FieldGroup>

                <FieldGroup className="gap-1">
                  <FieldLabel htmlFor="confirmPassword">
                    Xác nhận mật khẩu mới
                  </FieldLabel>
                  <Input
                    type="password"
                    value={form.confirmPassword}
                    placeholder="******"
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                  />
                </FieldGroup>
              </>
            )}
          </form>
        </CardContent>

        <CardFooter className="flex justify-between gap-3">
          {forgotPasswordStep === 1 ? (
            <Button
              type="submit"
              form="form-rhf-demo"
              className="w-full"
              disabled={isLoading}
            >
              <LogIn />
              Gửi mã OTP
            </Button>
          ) : (
            <>
              <Button
                type="button"
                className="w-[50%]"
                disabled={isLoading}
                onClick={() => setForgotPasswordStep(1)}
              >
                <LogIn />
                Quay về
              </Button>
              <Button
                type="submit"
                form="form-rhf-demo"
                className="w-[50%]"
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
