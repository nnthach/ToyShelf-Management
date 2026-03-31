"use client";

import { Button } from "@/src/styles/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
      toast.error("Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
      form.reset();
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
                  sizes="50px"
                  className="object-contain"
                />
              </div>
              {/*#0D47A1 */}
              <p className="text-[#1E88E5] font-bold text-xl">ToyShelf</p>
            </div>
          </CardTitle>
          <CardDescription>Đăng nhập</CardDescription>
        </CardHeader>

        <CardContent>
          <form
            id="form-rhf-demo"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3"
          >
            {/* Email */}
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="abc@example.com"
                      autoComplete="off"
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            {/* Password */}
            <FieldGroup>
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id="password"
                        aria-invalid={fieldState.invalid}
                        placeholder="******"
                        type={isViewPassword ? "text" : "password"}
                        autoComplete="off"
                        className="pr-10"
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
                className="text-sm text-gray-500 hover:text-black cursor-pointer"
              >
                Quên mật khẩu?
              </span>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <div className="flex w-full gap-3">
            <GoogleLoginButton />

            <Button
              type="submit"
              form="form-rhf-demo"
              className="w-[50%]"
              disabled={isLoading}
            >
              <LogIn />
              Đăng nhập
            </Button>
          </div>

          <div className="text-sm text-gray-500 text-center">
            Chưa kích hoạt tài khoản?{" "}
            <span
              onClick={() => router.push("/active-account")}
              className="text-blue-500 hover:text-blue-700 cursor-pointer"
            >
              Kích hoạt ngay
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
