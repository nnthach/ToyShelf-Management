"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/styles/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/styles/components/ui/field";
import { Input } from "@/styles/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import React from "react";
import * as z from "zod";
import { Button } from "@/styles/components/ui/button";

export default function RegisterPage() {
  const form = useForm();
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url(/images/auth_background.jpg)" }}
    >
      <Card className="w-full max-w-md shadow-xl bg-white/80 dark:bg-card/80 backdrop-blur-md">
        <CardHeader className="text-center">
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="form-rhf-demo">
            <FieldGroup>
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-title">
                      Email Address
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="abc@example.com"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal" className="w-full">
            <Button
              type="submit"
              form="form-rhf-demo"
              className="w-full cursor-pointer"
            >
              Login
            </Button>
          </Field>{" "}
        </CardFooter>
      </Card>
    </div>
  );
}
