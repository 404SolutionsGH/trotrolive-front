"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Phone, User, Lock, ArrowRight, Mail as GmailIcon} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import axios from '../../lib/axios';
// import { AxiosError } from 'axios';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../features/auth/authSlice';
import { AppDispatch } from '../../lib/store';
import { RegisterData } from '../../features/auth/types';

//form values type
// interface FormValues {
//     full_name: string;
//     email: string;
//     phone_number: string;
//     password: string;
//     password2: string;
// }

// interface ErrorResponse {
//   message: string;
//   error?: {
//     [key: string]: string[];
//   }
// }

// Full Name Regex
const fullNameRegex = /^[A-Za-z]+(?:[-\s'][A-Za-z]+)*$/;

// Phone number regex for Ghana numbers
const phoneRegex = /^(?:233|0)(?:20|24|23|26|27|23|24|54|55|59|27|57|26|56|28|58|50|51|52|53)\d{7}$/;

// Validation Schema
const schema = yup.object().shape({
    full_name: yup
        .string()
        .required("Full Name is required")
        .matches(fullNameRegex, 'Invalid full name')
        .min(8, 'Full name must at least 8 characters')
        .max(50, "Full name must be at most 50 characters"),

    email: yup
        .string()
        .required("Email is required")
        .email("Invalid email format"),

    phone: yup
        .string()
        .required("Phone number is required")
        .matches(phoneRegex, 'Phone number must be numeric')
        .length(10, "Phone number must be exactly 10 characters long"),

    password: yup
        .string()
        .required("Password is required")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])/, 'Use upper and lower case letters (e.g. Aa)')
        .matches(/[0-9]/, 'Use a number (e.g. 1234)')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Use a symbol (e.g. !@#$)')
        .min(8, 'Use 8 or more characters')
        .max(50, 'Password must be at most 50 characters'),

    password2: yup
        .string()
        .required("Password confirmation is required")
        .oneOf([yup.ref('password')], 'Passwords must match'),
});

export default function SignUp() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errorVisibility, setErrorVisibility] = useState<{ [key: string]: boolean }>({});

    const formik = useFormik<RegisterData>({
      initialValues: {
        full_name: '',
        email: '',
        phone: '',
        password: '',
      },
      validationSchema: schema,
      onSubmit: async (values) => {
        try {
          // Format phone number to include country code if needed
          let formattedPhone = values.phone;
          if (formattedPhone.startsWith('0')) {
              formattedPhone = '233' + formattedPhone.slice(1);
          }
          const payload = {
            full_name: values.full_name.trim(),
            email: values.email.trim().toLowerCase(),
            phone: formattedPhone,
            password: values.password,
          };

          console.log('Submitting Registration payload:', payload);
          const resultAction = await dispatch(registerUser(payload));

          if (registerUser.fulfilled.match(resultAction)) {
            toast.success("Registration successful!", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
            // Redirect to login or dashboard after successful registration
            router.push('/login');
          } else if (registerUser.rejected.match(resultAction)) {
            throw new Error(resultAction.payload as string);
          }

        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : "Registration failed. Please try again.";

          toast.error(errorMsg, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      }
    });

    useEffect(() => {
      const timers: { [key: string]: NodeJS.Timeout } = {};

      Object.keys(formik.errors).forEach((field) => {
        if (formik.touched[field as keyof RegisterData] && formik.errors[field as keyof RegisterData]) {
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
                <Label htmlFor="full_name" className="sr-only">
                  Name
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input id="full_name" name="full_name" placeholder="Name" className="pl-10"
                  value={formik.values.full_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}/>
                </div>
                {formik.touched.full_name && formik.errors.full_name && errorVisibility.full_name && (
                  <div className="text-red-500 text-sm">{formik.errors.full_name}</div>
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
                  <Input id="email" name="email" type="email" placeholder="Email" className="pl-10"
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
                  <Input id="phone" name="phone" placeholder="Phone Number" className="flex-1 rounded-l-none"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}/>
                </div>
                {formik.touched.phone && formik.errors.phone && errorVisibility.phone && (
                    <div className="text-red-500 text-sm">{formik.errors.phone}</div>
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
                    name="password"
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

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password2" className="sr-only">Confirm Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center">
                    <Lock className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input
                    id="password2"
                    name="password2"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="pl-10 pr-10"
                    // value={formik.values.password2}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute inset-y-0 right-0 px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
                {/* {formik.touched.password2 && formik.errors.password2 && (
                  <div className="text-red-500 text-sm">{formik.errors.password2}</div>
                )} */}
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
