'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Phone, User, Lock, ArrowRight, Mail as GmailIcon} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';

  //form values type
  interface FormValues {
    name: string;
    email: string;
    phone_number: string;
    password: string;
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


export default function Signup() {

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
      onSubmit: (values) => {
        // Simulate API submission
        console.log(values);
        toast.success("Form submitted successfully!");
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
    <div className="ontainer mx-auto min-h-screen flex items-center justify-center px-4 py-8">
      <ToastContainer />
      <div className="max-w-6xl w-full">
        <div className="grid gap-8 lg:grid-cols-2 items-center justify-items-center">
        <div className="absolute left-8 top-8 z-10">
          <h1 className="text-xl font-bold">
            TroTro<span className="text-sm font-normal">live</span>
          </h1>
        </div>
          {/* Left Column - Sign Up Form */}
          <div className="space-y-6 w-full max-w-md">
            <div className="space-y-2 text-center lg:text-left">
              <h1 className="text-2xl font-bold tracking-tight">CREATE ACCOUNT</h1>
            </div>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <Input className="flex-1" id="name"
                  placeholder="Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}/>
                </div>
                {formik.touched.name && formik.errors.name && errorVisibility.name && (
                  <div className="text-red-500 text-sm">{formik.errors.name}</div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <Input className="flex-1" id="email" placeholder="Email" type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}/>
                </div>
                  {formik.touched.email && formik.errors.email && errorVisibility.email && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                  )}
              </div>
             <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div className="flex items-center w-full">
                    <span className="text-gray-500 px-3 py-2 bg-gray-100 rounded-l-md">+233</span>
                    <Input className="flex-1 rounded-none rounded-r-md" id="phone_number" placeholder="Phone" type="tel"
                    value={formik.values.phone_number}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}/>
                  </div>
                </div>
                  {formik.touched.phone_number && formik.errors.phone_number && errorVisibility.phone_number && (
                    <div className="text-red-500 text-sm">{formik.errors.phone_number}</div>
                  )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <div className="relative flex-1">
                    <Input
                      className="pr-10"
                      id="password"
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />

                    <Button
                      className="absolute inset-y-0 right-0 px-3"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                      variant="ghost"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Eye className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                    {formik.touched.password && formik.errors.password && errorVisibility.password && (
                      <div className="text-red-500 text-sm">{formik.errors.password}</div>
                    )}
              </div>
              <div className="flex justify-end py-5">
                <Button className="w-[50%] bg-purple-900 hover:bg-purple-800" type="submit">
                    Sign up
                </Button>
              </div>
            </form>
            <div className="flex justify-end">
              <Link
                href="/login"
                className="inline-flex items-center underline text-sm text-gray-600 hover:text-gray-900"
              >
                Already a member?{" "}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="text-center p-5 text-xs text-muted-foreground">
              By signing in you agree to our{" "}
              <Link className="text-purple-900 underline" href="/terms">
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link className="text-purple-900 underline" href="/privacy">
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Right Column - Alternative Sign Up */}
          <div className="space-y-6 text-center w-full max-w-md">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or</span>
              </div>
            </div>
            <p className="text-center text-sm mb-4">Sign up with any of these:</p>
            <div className="flex flex-col space-y-4">
              <Button variant="outline" className="w-full justify-start space-x-2">
                <GmailIcon className="h-5 w-5 text-red-500" />
                <span>Sign up with Gmail</span>
              </Button>
              <Button variant="outline" className="w-full justify-start space-x-2">
                <Mail className="h-5 w-5 text-blue-500" />
                <span>Sign up with Outlook</span>
              </Button>
              <Button variant="outline" className="w-full justify-start space-x-2">
                <Mail className="h-5 w-5 text-purple-500" />
                <span>Sign up with Yahoo Mail</span>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
