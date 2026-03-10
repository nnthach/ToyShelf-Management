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
import { ArrowLeft, LogIn, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ForgotPasswordPage() {
  const router = useRouter();

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
    if (forgotPasswordStep === 1) {
      try {
        await forgotPasswordRequestAPI(data.email);

        toast.success("Mã OTP đã được gửi đến email của bạn");

        setForgotPasswordStep(2);
      } catch (error) {
        toast.error("Gửi mã OTP thất bại");
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
        toast.error("Đặt lại mật khẩu thất bại");
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
                  alt="ToyShelf logo"
                  fill
                  className="object-contain"
                />
              </div>
              {/*#0D47A1 */}
              <p className="text-[#1E88E5] font-bold text-xl">ToysShelf</p>
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
            <>
              <Button
                type="button"
                variant={"outline"}
                className="w-[50%]"
                disabled={isLoading}
                onClick={() => router.replace("/")}
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
                <Mail />
                Gửi mã OTP
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                className="w-[50%]"
                disabled={isLoading}
                onClick={() => setForgotPasswordStep(1)}
              >
                <ArrowLeft />
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
