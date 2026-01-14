"use client";

import { useAppDispatch, useAppSelector } from "@/shared/redux/hooks";
import { loginAPI } from "@/shared/services/user.service";
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
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";

const formSchema = z.object({
  email: z.string("Not correct email format."),
  // email: z.email("Not correct email format."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(20, "Password must be at most 20 characters."),
});

export default function HomePage() {
  const t = useTranslations("home");
  const tForm = useTranslations("form");
  const tButton = useTranslations("button");

  const [isLoading, setIsLoading] = useState(false);

  const locale = useLocale();

  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

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
      console.log("login res", res);
      const token = res.data?.accessToken;

      form.reset();

      localStorage.setItem("token", token);

      toast.success(
        locale === "vi" ? "Đăng nhập thành công" : "Login successfully!"
      );
    } catch (error) {
      console.log("login err", error);
      toast.error(locale === "vi" ? "Đăng nhập thất bại" : "Failed to login!");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url(/images/home_background.jpg)" }}
    >
      <Card className="w-full max-w-md shadow-xl bg-white/80 dark:bg-card/80 backdrop-blur-md">
        <CardHeader className="text-center">
          <CardTitle className="font-bold text-2xl">Toys Cabin</CardTitle>
          <CardDescription>{t("subheader")}</CardDescription>
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
                    <FieldLabel htmlFor="email">{tForm("email")}</FieldLabel>
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
                    <FieldLabel htmlFor="password">
                      {tForm("password")}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="******"
                      type="password"
                      autoComplete="off"
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter className="flex justify-between gap-3">
          <Button
            variant="outline"
            type="button"
            className="w-[50%] cursor-pointer"
            disabled={isLoading}
          >
            <Image
              src="/icons/google.png"
              width={18}
              height={18}
              alt="Google Icon"
            />
            Google
          </Button>
          <Button
            type="submit"
            form="form-rhf-demo"
            className="w-[50%] cursor-pointer"
            disabled={isLoading}
          >
            <LogIn />
            {tButton("signIn")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
