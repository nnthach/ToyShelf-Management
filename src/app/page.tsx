"use client";

import { Button } from "@/src/styles/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/styles/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/src/styles/components/ui/field";
import { Input } from "@/src/styles/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogIn } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";
import { loginAPI } from "../services/user.service";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/getErrorMessage";

const formSchema = z.object({
  email: z.string("Not correct email format."),
  password: z
    .string()
    .min(5, "Mật khẩu phải tối thiểu 5 ký tự.")
    .max(20, "Mật khẩu phải tối đa 20 ký tự."),
});

export default function HomePage() {
  const router = useRouter();
  const { handleLoginSuccess } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [isViewPassword, setIsViewPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const res = await loginAPI(data);
      await handleLoginSuccess(res);
    } catch (error) {
      toast.error(getErrorMessage(error, "Đăng nhập thất bại"));
    } finally {
      setIsLoading(false);
      form.reset();
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

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col md:flex-row items-center justify-center gap-12">
        {/* LEFT PANEL (Chỉ hiện trên desktop) */}
        <div className="hidden lg:flex flex-col max-w-md">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 w-fit mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700">
              Hệ thống quản lý
            </span>
          </div>

          <h1 className="text-4xl font-extrabold leading-tight">
            Hệ thống quản lý đồ chơi ký gửi & kệ trưng bày thông minh
          </h1>
          <p className="text-[#4a6880] text-md leading-relaxed my-8">
            Nền tảng quản trị toàn diện cho ToyShelf — theo dõi đơn hàng, đối
            tác, doanh thu và hệ thống kệ theo thời gian thực.
          </p>

          {/* Stats Preview */}
          <div className="space-y-4">
            {[
              { icon: "💰", label: "Doanh thu", val: "250,520 VND" },
              { icon: "📦", label: "Đơn hàng", val: "15,640" },
              { icon: "🤝", label: "Đối tác", val: "153" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-white/40 backdrop-blur-md border border-white/60 p-4 rounded-2xl shadow-sm hover:translate-x-2 transition-transform"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400">
                    {item.label}
                  </p>
                  <p className="font-bold text-[#1e3a52]">{item.val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LOGIN CARD */}
        <Card className="w-full max-w-[420px] shadow-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-2xl border-white/70 rounded-[28px] overflow-hidden">
          <CardHeader className="text-center pt-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-300 to-blue-200 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 animate-bounce-subtle relative overflow-hidden">
                <div className="relative w-full h-full">
                  <Image
                    src="/images/finallogo.png"
                    alt="Logo ToyShelf"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div>
                <CardTitle className="font-black text-2xl tracking-tight bg-gradient-to-br from-blue-500 to-blue-400 bg-clip-text text-transparent">
                  ToyShelf
                </CardTitle>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-10">
            <form
              id="form-rhf-demo"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-2"
            >
              <FieldGroup className="space-y-1">
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="gap-1">
                      <FieldLabel className="text-[10px] uppercase font-bold text-gray-400 ml-1">
                        Email
                      </FieldLabel>
                      <Input
                        {...field}
                        className="bg-white/60 border-blue-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-lg transition-all h-11"
                        placeholder="abc@example.com"
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="gap-1">
                      <FieldLabel className="text-[10px] uppercase font-bold text-gray-400 ml-1">
                        Mật khẩu
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          type={isViewPassword ? "text" : "password"}
                          className="bg-white/60 border-blue-100 focus:bg-white rounded-lg h-11 pr-10"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setIsViewPassword(!isViewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          {isViewPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <div className="text-right">
                <span
                  onClick={() => router.push("/forgot-password")}
                  className="text-xs font-bold text-blue-500 hover:text-blue-700 cursor-pointer transition-colors"
                >
                  Quên mật khẩu?
                </span>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 px-10 pb-10">
            <div className="flex w-full gap-3">
              <GoogleLoginButton />
              <Button
                type="submit"
                form="form-rhf-demo"
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg shadow-lg shadow-blue-500/25 transition-all active:scale-95"
                disabled={isLoading}
              >
                <LogIn className="mr-2 h-4 w-4" /> Đăng nhập
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Chưa kích hoạt tài khoản?{" "}
              <span
                onClick={() => router.push("/active-account")}
                className="text-blue-500 font-bold hover:underline cursor-pointer"
              >
                Kích hoạt ngay
              </span>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
