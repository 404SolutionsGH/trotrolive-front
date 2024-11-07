'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import gen from "../../../public/assets/generated.jpg";

type FormValues = {
  phone_number: string;
  password: string;
  rememberMe?: boolean;
};

const schema = yup.object().shape({
  phone_number: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Phone number must be numeric")
    .length(10, "Phone number must be exactly 10 characters long"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be 8 or more characters"),
  rememberMe: yup.boolean(),
});

export default function Login() {
  // const [rememberMe, setRememberMe] = useState(false);
  const [storedPhoneNumber, setStoredPhoneNumber] = useState<string>("");
  const [errorVisibility, setErrorVisibility] = useState<{ [key: string]: boolean }>({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    criteriaMode: "all",
    defaultValues: {
      phone_number: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (data: FormValues) => {
    if (data.rememberMe) {
      localStorage.setItem("rememberMe", "true");
      localStorage.setItem("phone_number", data.phone_number);
    } else {
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("phone_number");
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(console.log("Form Data: ", data));
        toast.success("Form submitted successfully!");
      }, 2000);
    });
  };

  useEffect(() => {
    const timers: { [key: string]: NodeJS.Timeout } = {};

    Object.keys(errors).forEach((field) => {
      setErrorVisibility((prev) => ({ ...prev, [field]: true }));
      timers[field] = setTimeout(() => {
        setErrorVisibility((prev) => ({ ...prev, [field]: false }));
      }, 20000);
    });

    return () => {
      Object.values(timers).forEach(clearTimeout);
    };
  }, [errors]);

  useEffect(() => {
    const rememberMeValue = localStorage.getItem("rememberMe");
    const userPhoneNumber = localStorage.getItem("phone_number");

    if (rememberMeValue === "true") {
      // setRememberMe(true);
      setStoredPhoneNumber(userPhoneNumber || "");
    }

    if (isSubmitSuccessful) {
      reset({
        phone_number: "",
        password: "",
        rememberMe: false,
      });
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <div className="min-h-screen w-full bg-white">
      <ToastContainer />
      <div className="relative grid min-h-screen md:grid-cols-2">
        {/* Logo */}
        <div className="absolute left-8 top-8 z-10">
          <h1 className="text-xl font-bold text-white">
            TroTro<span className="text-sm font-normal">live</span>
          </h1>
        </div>

        {/* Image Column */}
        <div className="hidden md:block">
          <Image
            src={gen}
            alt="Login visual"
            width={1080}
            height={1080}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Login Form Column */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            <h2 className="text-2xl font-semibold tracking-tight">LOG IN</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <Input
                  {...register("phone_number")}
                  className="flex-1"
                  placeholder="Phone number"
                  type="text"
                  defaultValue={storedPhoneNumber}
                />
              </div>
              {errors.phone_number && errorVisibility.phone_number && (
                <p className="text-sm text-red-500">
                  {errors.phone_number.message}
                </p>
              )}

              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <Input
                  {...register("password")}
                  className="flex-1"
                  placeholder="Password"
                  type="password"
                />
              </div>
              {errors.password && errorVisibility.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}

              <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    {...register("rememberMe")}
                    defaultChecked={storedPhoneNumber ? true : false} // Control checkbox state
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-purple-700 hover:underline"
                >
                  Forget Password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-700 hover:bg-purple-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Log In"}
              </Button>
            </form>

            {/* Create Account Link */}
            <Link
              href="/sign-up"
              className="inline-flex py-5 items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
