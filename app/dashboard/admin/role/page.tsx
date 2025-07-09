/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Camera, CheckCircle, Clock, Car, User, Building, Users } from 'lucide-react'
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';
import Input from "@/components/ui/input"
import { FileUploadCard } from "@/components/ui/file-upload-card"
import { useRoleUpgradeStore } from "@/lib/role-upgrade-store"
import Image from "next/image"

type Role = "driver" | "owner" | "mate" | "master"

interface RoleFields {
  [key: string]: {
    fields: {
      name: string
      type: "upload" | "text" | "camera"
      label: string
      placeholder?: string
    }[]
  }
}

const roleIcons = {
  driver: Car,
  owner: User,
  mate: Users,
  master: Building
};

const roleLabels = {
  driver: "Trotro Driver",
  owner: "Trotro Car Owner", 
  mate: "Trotro Mate",
  master: "Trotro Station Master"
};

export default function RoleUpgradeForm() {
  const {
    selectedRole,
    uploadedFiles,
    isSubmitted,
    isVerified,
    submissionId,
    lastCheckTime,
    intervalCheck,
    setSelectedRole,
    setUploadedFiles,
    setSubmitted,
    setVerified,
    setLastCheckTime,
    resetForm,
    storeFileBlob,
    getFileBlob,
    clearFileBlob
  } = useRoleUpgradeStore();

  const [cameraActive, setCameraActive] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const roleFields: RoleFields = useMemo(() => ({
    driver: {
      fields: [
        { name: "ghana_card_front", type: "upload", label: "Upload Ghana Card (Front)" },
        { name: "ghana_card_back", type: "upload", label: "Upload Ghana Card (Back)" },
        { name: "driver_license_front", type: "upload", label: "Upload Driver's License (Front)" },
        { name: "driver_license_back", type: "upload", label: "Upload Driver's License (Back)" },
        { name: "license_number", type: "text", label: "License Number", placeholder: "Input your license number..." },
        { name: "face_photo", type: "camera", label: "Take a Selfie" },
        { name: "phone_number", type: "text", label: "Phone Number", placeholder: "Input your phone number..." },
        { name: "location", type: "text", label: "Location", placeholder: "Input your location..." },
      ],
    },
    owner: {
      fields: [
        { name: "ghana_card_front", type: "upload", label: "Upload Ghana Card (Front)" },
        { name: "ghana_card_back", type: "upload", label: "Upload Ghana Card (Back)" },
        { name: "face_photo", type: "camera", label: "Take a Selfie" },
      ],
    },
    mate: {
      fields: [
        { name: "ghana_card_front", type: "upload", label: "Upload Ghana Card (Front)" },
        { name: "ghana_card_back", type: "upload", label: "Upload Ghana Card (Back)" },
        { name: "face_photo", type: "camera", label: "Take a Selfie" },
        { name: "location", type: "text", label: "Location", placeholder: "Input your location..." },
      ],
    },
    master: {
      fields: [
        { name: "ghana_card_front", type: "upload", label: "Upload Ghana Card (Front)" },
        { name: "ghana_card_back", type: "upload", label: "Upload Ghana Card (Back)" },
        { name: "station_id_front", type: "upload", label: "Upload Station Card (Front)" },
        { name: "station_id_back", type: "upload", label: "Upload Station Card (Back)" },
        { name: "agency", type: "text", label: "Agency", placeholder: "Input agency name..." },
        { name: "location", type: "text", label: "Location", placeholder: "Input your location..." },
        { name: "phone_number", type: "text", label: "Phone Number", placeholder: "Input your phone number..." },
        { name: "face_photo", type: "camera", label: "Take a Selfie" },
      ],
    },
    passenger_contributor: {
      fields: [
        { name: "ghana_card_front", type: "upload", label: "Upload Ghana Card (Front)" },
        { name: "ghana_card_back", type: "upload", label: "Upload Ghana Card (Back)" },
        { name: "phone_number", type: "text", label: "Phone Number", placeholder: "Input your phone number..." },
        { name: "location", type: "text", label: "Location", placeholder: "Input your location..." },
        { name: "contribution_reason", type: "text", label: "Reason for Contributing", placeholder: "Why do you want to contribute?" },
        { name: "face_photo", type: "camera", label: "Take a Selfie" },
      ],
    },
  }), [])

  // Load file blobs from cookies on mount
  useEffect(() => {
    if (selectedRole) {
      const fields = roleFields[selectedRole].fields;
      fields.forEach(field => {
        if (field.type === "upload") {
          const blob = getFileBlob(field.name);
          if (blob && !uploadedFiles[field.name]) {
            setUploadedFiles({
              ...uploadedFiles,
              [field.name]: blob
            });
          }
        }
      });
    }
  }, [selectedRole, getFileBlob, roleFields, setUploadedFiles, uploadedFiles]);

  // Polling mechanism for verification status
  useEffect(() => {
    if (isSubmitted && !isVerified && submissionId) {
      const checkStatus = async () => {
        try {
          const authToken = Cookies.get('access_token');
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/accounts/api/role-upgrade-status/${submissionId}/`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            if (data.status === 'verified') {
              setVerified(true);
              toast.success("Role upgrade verified successfully!");
            }
          }
        } catch (error) {
          console.error("Error checking status:", error);
        }
      };

      const interval = setInterval(checkStatus, intervalCheck * 1000);
      return () => clearInterval(interval);
    }
  }, [isSubmitted, isVerified, submissionId, intervalCheck, setVerified]);

  const handleCaptureSelfie = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/png");
        setPhoto(imageData);

        // Convert dataURL to a file
        fetch(imageData)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], "selfie.png", { type: "image/png" });
            setUploadedFiles({ ...uploadedFiles, selfie: file });
            storeFileBlob("selfie", file);
          });
      }
    }
    setCameraActive(false);
  };

  const handleCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        console.log('Camera stream started');
      }
      setCameraActive(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Unable to access camera.");
    }
  };

  const handleFileChange = (fieldName: string, file: File | null) => {
    if (file) {
      const newFiles = { ...uploadedFiles, [fieldName]: file };
      setUploadedFiles(newFiles);
      storeFileBlob(fieldName, file);
    } else {
      const newFiles = { ...uploadedFiles };
      delete newFiles[fieldName];
      setUploadedFiles(newFiles);
      clearFileBlob(fieldName);
    }
  };

  const handleInputChange = (fieldName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUploadedFiles({ ...uploadedFiles, [fieldName]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    const requiredFields = roleFields[selectedRole].fields;
    const missingFiles = requiredFields
      .filter(field => field.type === "upload" || field.type === "camera")
      .filter(field => !uploadedFiles[field.name]);

    if (missingFiles.length > 0) {
      toast.error(`Please upload all required files: ${missingFiles.map(f => f.label).join(', ')}`);
      return;
    }

    if (selectedRole === "driver" && !uploadedFiles["licenseNumber"]) {
      toast.error("Please enter your license number");
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append("role", selectedRole);

    const user = localStorage.getItem("user.id");
    formData.append("user", JSON.stringify(user));

    // Append files
    Object.entries(uploadedFiles).forEach(([key, file]) => {
      if (file && file instanceof File) {
        if (key === "idCard") {
          formData.append("ghana_card", file);
        } else {
          formData.append(key, file);
        }
      }
    });

    // Append text fields
    requiredFields.forEach((field) => {
      if (field.type === "text" && field.name) {
        const value = uploadedFiles[field.name];
        if (typeof value === 'string' && value) {
          formData.append(field.name, value);
        }
      }
    });

    try {
      const authToken = Cookies.get('access_token');
      const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/accounts/api/role-upgrade/`;
      const response = await fetch(endpoint, {
        method: "POST",
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setSubmitted(true, data.submission_id || data.id);
        toast.success("Role upgrade submitted successfully! We'll review your application.");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to submit role upgrade.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("Something went wrong.");
    }
  };

  const handleClearForm = () => {
    resetForm();
    setPhoto(null);
    setCameraActive(false);
    cleanupCamera();
  };

  const cleanupCamera = () => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      const stream = video.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      video.srcObject = null;
    }
  };

  useEffect(() => {
    return () => {
      cleanupCamera();
    };
  }, []);

  const isFormDisabled = isSubmitted && !isVerified;
  const RoleIcon = selectedRole ? roleIcons[selectedRole as keyof typeof roleIcons] : null;

  return (
    <div className="max-w-4xl mx-auto pt-10 mb-14">
      <ToastContainer />
      <Card className="relative">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {RoleIcon && <RoleIcon className="w-6 h-6 text-[#C81E78]" />}
              <CardTitle className="text-xl text-[#C81E78]">Role Upgrade</CardTitle>
              {isVerified && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">Verified</span>
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              className="text-[#C81E78]"
              onClick={handleClearForm}
              disabled={isFormDisabled}
            >
              Clear Form
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-base font-medium">Select Role</label>
              <Select
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value as Role)}
                disabled={isFormDisabled}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="driver">Trotro Driver</SelectItem>
                  <SelectItem value="owner">Trotro Car Owner</SelectItem>
                  <SelectItem value="mate">Trotro Mate</SelectItem>
                  <SelectItem value="master">Trotro Station Master</SelectItem>
                  <SelectItem value="passenger_contributor">Passenger Contributor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Form Fields */}
            {selectedRole && (
              <div className="space-y-6">
                {roleFields[selectedRole].fields.map((field, index) => (
                  <div key={index} className="space-y-3">
                    {field.type === "camera" ? (
                      <div className="space-y-3">
                        <label className="text-base font-medium">{field.label}</label>
                        {photo ? (
                          <div className="space-y-2">
                            <Image src={photo} alt="Selfie preview" className="w-full max-w-md rounded-md" width={500} height={500} />
                            <Button 
                              type="button"
                              className="bg-[#C81E78] hover:bg-[#A61860] text-white"
                              onClick={() => setPhoto(null)}
                              disabled={isFormDisabled}
                            >
                              Retake Selfie
                            </Button>
                          </div>
                        ) : cameraActive ? (
                          <div>
                            <video ref={videoRef} className="w-full max-w-md rounded-md" />
                            <Button 
                              type="button"
                              className="bg-[#C81E78] hover:bg-[#A61860] text-white mt-2"
                              onClick={handleCaptureSelfie}
                            >
                              Capture Photo
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            type="button"
                            className="bg-[#C81E78] hover:bg-[#A61860] text-white"
                            onClick={handleCameraAccess}
                            disabled={isFormDisabled}
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            Open Camera
                          </Button>
                        )}
                        <canvas ref={canvasRef} className="hidden" />
                      </div>
                    ) : field.type === "upload" ? (
                      <FileUploadCard
                        fieldName={field.name}
                        label={field.label}
                        value={uploadedFiles[field.name]}
                        onChange={(file) => handleFileChange(field.name, file)}
                        onRemove={() => handleFileChange(field.name, null)}
                        disabled={isFormDisabled}
                        isVerified={isVerified}
                        roleType={roleLabels[selectedRole as keyof typeof roleLabels]}
                      />
                    ) : (
                      <div className="space-y-2">
                        <label className="text-base font-medium">{field.label}</label>
                        <Input
                          placeholder={field.placeholder}
                          value={typeof uploadedFiles[field.name] === 'string' ? uploadedFiles[field.name] as string : ""}
                          onChange={(e) => handleInputChange(field.name, e)}
                          disabled={isFormDisabled}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#C81E78] hover:bg-[#A61860] text-white"
              disabled={isFormDisabled || !selectedRole}
            >
              {isSubmitted && !isVerified ? (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 animate-spin" />
                  Under Review
                </div>
              ) : (
                "SUBMIT"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}