"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Eye, EyeOff, Mail, Phone, User, Lock, ArrowRight, Mail as GmailIcon} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '../../lib/axios';
import { AxiosError } from 'axios';

//form values type
interface FormValues {
    name: string;
    email: string;
    phone_number: string;
    password: string;
}

interface ErrorResponse {
  message: string;
}

// Full Name Regex
const fullNameRegex = /^[A-Za-z]+(?:[-\s'][A-Za-z]+)*$/;

// Validation Schema
const schema = yup.object().shape({
    name: yup
        .string()
        .required("Full Name is required")
        .matches(fullNameRegex, 'Invalid full name')
        .min(8, 'Full name must at least 8 characters')
        .max(50, "Full name must be at most 50 characters"),

    email: yup
        .string()
        .required("Email is required")
        .email("Invalid email format"),

    phone_number: yup
        .string()
        .required("Phone number is required")
        .matches(/^[0-9]+$/, 'Phone number must be numeric')
        .length(10, "Phone number must be exactly 10 characters long"),

    password: yup
        .string()
        .required("Password is required")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])/, 'Use upper and lower case letters (e.g. Aa)')
        .matches(/[0-9]/, 'Use a number (e.g. 1234)')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Use a symbol (e.g. !@#$)')
        .min(8, 'Use 8 or more characters')
        .max(50, 'Password must be at most 50 characters'),
});

export default function SignUp() {

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorVisibility, setErrorVisibility] = useState<{ [key: string]: boolean }>({});

    const formik = useFormik<FormValues>({
      initialValues: {
        name: '',
        email: '',
        phone_number: '',
        password: ''
      },
      validationSchema: schema,
      onSubmit: async (values) => {
        try {
          const response = await axios.post('/accounts/register', values);
          toast.success("Form submitted successfully!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          console.log('Response:', response.data);
        } catch (error) {
          const axiosError = error as AxiosError<ErrorResponse>;
          const errorMsg = axiosError.response?.data?.message || "Error submitting the form";
          toast.error(errorMsg, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          console.error('Error:', axiosError);
        }
      }
    });

    useEffect(() => {
      const timers: { [key: string]: NodeJS.Timeout } = {};

      Object.keys(formik.errors).forEach((field) => {
        if (formik.touched[field as keyof FormValues] && formik.errors[field as keyof FormValues]) {
          setErrorVisibility((prev) => ({ ...prev, [field]: true }));
          timers[field] = setTimeout(() => {
            setErrorVisibility((prev) => ({ ...prev, [field]: false }));
          }, 20000);
        }
      });

      return () => {
        Object.values(timers).forEach(clearTimeout);
      };
    }, [formik.errors, formik.touched]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
        <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Left Column */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
        <div className="absolute left-8 top-8 z-10">
            <h1 className="text-xl font-bold">
                TroTro<span className="text-sm font-normal">live</span>
            </h1>
        </div>

          {/* Main Form */}
          <div className="w-full">
            <h2 className="text-2xl font-semibold mb-8">CREATE ACCOUNT</h2>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="sr-only">
                  Name
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input id="name" placeholder="Name" className="pl-10"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}/>
                </div>
                {formik.touched.name && formik.errors.name && errorVisibility.name && (
                  <div className="text-red-500 text-sm">{formik.errors.name}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="sr-only">
                  Email
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center">
                    <Mail className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input id="email" type="email" placeholder="Email" className="pl-10"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}/>
                </div>
                {formik.touched.email && formik.errors.email && errorVisibility.email && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                  )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="sr-only">
                  Phone
                </Label>
                <div className="relative flex">
                  <div className="absolute inset-y-0 left-3 flex items-center">
                    <Phone className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input
                    id="country-code"
                    className="w-20 pl-10 rounded-r-none border-r-0"
                    defaultValue="233"
                  />
                  <Input id="phone_number" placeholder="Phone Number" className="flex-1 rounded-l-none"
                  value={formik.values.phone_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}/>
                </div>
                {formik.touched.phone_number && formik.errors.phone_number && errorVisibility.phone_number && (
                    <div className="text-red-500 text-sm">{formik.errors.phone_number}</div>
                  )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="sr-only">
                  Password
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center">
                    <Lock className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="pl-10 pr-10"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute inset-y-0 right-0 px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
                {formik.touched.password && formik.errors.password && errorVisibility.password && (
                    <div className="text-red-500 text-sm">{formik.errors.password}</div>
                )}
              </div>

              <Button type="submit" className="w-full bg-purple-700 hover:bg-purple-800">
                Sign up
              </Button>
            </form>

            <div className="mt-8 justify-end">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-2">
                Already a member?{" "}
              <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
              By signing in you agree to our{" "}
              <Link href="/terms" className="text-purple-700 hover:underline">
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-purple-700 hover:underline">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              <div className="h-px bg-gray-300 flex-1" />
              <span className="text-gray-500">or</span>
              <div className="h-px bg-gray-300 flex-1" />
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-gray-600">Sign up with any of these:</p>
          </div>

          <div className="space-y-4">
            <Button variant="outline" className="w-full">
                <GmailIcon className="h-5 w-5 text-red-500" />
                <span>Sign up with Gmail</span>
            </Button>
            <Button variant="outline" className="w-full">
                <Mail className="h-5 w-5 text-blue-500" />
                <span>Sign up with Outlook</span>
            </Button>
            <Button variant="outline" className="w-full">
                <Mail className="h-5 w-5 text-purple-500" />
                <span>Sign up with Yahoo Mail</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
