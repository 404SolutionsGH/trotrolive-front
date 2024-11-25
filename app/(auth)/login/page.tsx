'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation'; // Add this import
import { ArrowLeft, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import gen from "../../../public/assets/generated.jpg";
import { loginUser } from '@/app/features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/lib/store';
import { LoginCredentials } from '@/app/features/auth/types';

const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be 8 or more characters"),
  rememberMe: yup.boolean(),
});

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const [rememberMe, setRememberMe] = useState(false);
  const [storedEmail, setStoredEmail] = useState<string>("");
  const [errorVisibility, setErrorVisibility] = useState<{ [key: string]: boolean }>({});

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(schema),
    criteriaMode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      // Handle Remember Me
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("email", data.email);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("email");
      }

      // Dispatch login action
      const resultAction = await dispatch(
        loginUser({ email: data.email, password: data.password })
      );

      if (loginUser.fulfilled.match(resultAction)) {
        toast.success("Login successful!");
        setTimeout(() => {
          router.push("/admin");
        }, 100);
        // reset();
      } else {
        const error = resultAction.payload as { message: string };
        toast.error(error.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
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
    const userEmail = localStorage.getItem("email");

    if (rememberMeValue === "true" && userEmail) {
      setRememberMe(true);
      setStoredEmail(userEmail);
      setValue("email", userEmail); // Set the email in the form
    }
  }, [setValue]);

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
                  {...register("email")}
                  className="flex-1"
                  placeholder="Email address"
                  type="email"
                  defaultValue={storedEmail}
                />
              </div>
              {errors.email && errorVisibility.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
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
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
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
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? "Logging in..." : "Log In"}
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
