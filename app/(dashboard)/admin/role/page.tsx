"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Camera, Cloud, X } from 'lucide-react'
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';


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

export default function RoleUpgradeForm() {
  const [selectedRole, setSelectedRole] = useState<Role | "">("")
  const [uploadedFiles, setUploadedFiles] = useState<{
    [key: string]: File | null
  }>({})

  // Refs for file inputs
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  const roleFields: RoleFields = {
    driver: {
      fields: [
        // {
        //   name: "idCard",
        //   type: "upload",
        //   label: "Upload ID Card",
        // },
        // {
        //   name: "license",
        //   type: "upload",
        //   label: "Upload Driver's license",
        // },
        {
          name: "licenseNumber",
          type: "text",
          label: "License Number",
          placeholder: "Input your license number...",
        },
      ],
    },
    owner: {
      fields: [
        {
          name: "idCard",
          type: "upload",
          label: "Upload ID Card",
        },
        {
          name: "vehicleType",
          type: "text",
          label: "Vehicle type",
          placeholder: "Input vehicle type...",
        },
        {
          name: "registrationNumber",
          type: "text",
          label: "Registration Number",
          placeholder: "Input Registration Number...",
        },
      ],
    },
    mate: {
      fields: [
        {
          name: "idCard",
          type: "upload",
          label: "Upload ID Card",
        },
        {
          name: "selfie",
          type: "camera",
          label: "Take A Selfie",
        },
      ],
    },
    master: {
      fields: [
        {
          name: "idCard",
          type: "upload",
          label: "Upload ID Card",
        },
        {
          name: "stationId",
          type: "upload",
          label: "Upload Station ID",
        },
      ],
    },
  }

  const handleFileChange = (fieldName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFiles(prev => ({
        ...prev,
        [fieldName]: file
      }))
    }
  }

  const handleInputChange = (fieldName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUploadedFiles(prev => ({
      ...prev,
      [fieldName]: value
    }));
  }

  const handleFileRemove = (fieldName: string) => {
    setUploadedFiles(prev => {
      const newFiles = { ...prev }
      delete newFiles[fieldName]
      return newFiles
    })

    // Reset the file input
    if (fileInputRefs.current[fieldName]) {
      fileInputRefs.current[fieldName]!.value = ''
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate that all required files are uploaded
    if (!selectedRole) {
      toast.error("Please select a role")
      return
    }

    const requiredFields = roleFields[selectedRole].fields
    const missingFiles = requiredFields
      .filter(field => field.type === "upload" || field.type === "camera")
      .filter(field => !uploadedFiles[field.name])

    if (missingFiles.length > 0) {
      toast.error(`Please upload all required files: ${missingFiles.map(f => f.label).join(', ')}`)
      return
    }

    if (selectedRole === "driver" && !uploadedFiles["licenseNumber"]) {
      toast.error("Please enter your license number")
      return
    }

    // Create FormData to handle file uploads
    const formData = new FormData()

    formData.append("role", selectedRole)

    const user = localStorage.getItem("user.id")

    // const user = {
    //   // Assuming you can get the user data, either from context, cookies, or a global state
    //   // Example: cookies, or user state data
    //   id: localStorage.getItem("id"), // Replace with actual method to fetch user data
    //   // email: localStorage.getItem("email"), // Replace with actual method to fetch user data
    //   // username: Cookies.get("username"), // Adjust to reflect actual user data from your app
    // };

    console.log("Driver User: ", user);

    formData.append("user", JSON.stringify(user));  // Add the user field to the form data

    // Append all uploaded files
    Object.entries(uploadedFiles).forEach(([key, file]) => {
      if (file) {
        if (key === "idCard") {
          formData.append("ghana_card", file);
        } else {
          formData.append(key, file);
        }
      }
    })

    // Append text input fields
    requiredFields.forEach((field) => {
      if (field.type === "text" && field.name) {
        const inputValue = (document.getElementById(field.name) as HTMLInputElement)?.value
        if (inputValue) {
          formData.append(field.name, inputValue)
        }
      }
    })

    try {
      // Replace with your actual authentication token logic
      const authToken = Cookies.get('access_token');
      console.log("Role Token: ", authToken);

      const endpoint = selectedRole === 'driver'
      ? `${process.env.NEXT_PUBLIC_API_URL}/accounts/api/driver/`
      : `${process.env.NEXT_PUBLIC_API_URL}/accounts/role-upgrade/`;

      const response = await fetch(endpoint, {
        method: "POST",
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${authToken}`.replace(/\s+/g, ' ').trim()
        },
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        toast.success("Role upgraded successfully!")
        console.log(data)
        // Optional: Reset form after successful submission
        handleClearForm()
      } else {
        const errorData = await response.json()
        toast.error("Failed to upgrade role.")
        console.error(errorData)
      }
    } catch (error) {
      console.error("An error occurred:", error)
      toast.error("Something went wrong.")
    }
  }

  const handleClearForm = () => {
    setSelectedRole("")
    setUploadedFiles({})
    // Reset all file inputs
    Object.values(fileInputRefs.current).forEach(ref => {
      if (ref) ref.value = ''
    })
  }

  return (
    <div className="max-w-2xl mx-auto pt-10">
      <Card className="relative">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl items-left text-[#C81E78]">Role Upgrade</CardTitle>
            <Button
              type="button"
              variant="ghost"
              className="text-[#C81E78] items-right"
              onClick={handleClearForm}
            >
              Clear Form
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-base font-medium">Select Role</label>
              <Select
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value as Role)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="driver">Trotro Driver</SelectItem>
                  <SelectItem value="owner">Trotro Car Owner</SelectItem>
                  <SelectItem value="mate">Trotro Mate</SelectItem>
                  <SelectItem value="master">Trotro Station Master</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedRole && roleFields[selectedRole].fields.map((field, index) => (
              <div key={index} className="space-y-2">
                <label className="text-base font-medium">{field.label}</label>
                {(field.type === "upload" || field.type === "camera") ? (
                  <div>
                    <input
                      type="file"
                      accept={field.type === "camera" ? "image/*" : "*/*"}
                      capture={field.type === "camera" ? "environment" : undefined}
                      ref={(el) => fileInputRefs.current[field.name] = el}
                      onChange={(e) => handleFileChange(field.name, e)}
                      className="hidden"
                      id={`file-upload-${field.name}`}
                    />
                    <label
                      htmlFor={`file-upload-${field.name}`}
                      className="border rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 flex items-center justify-center"
                    >
                      {field.type === "upload" ? (
                        <Cloud className="w-6 h-6 mr-2 text-[#C81E78]" />
                      ) : (
                        <Camera className="w-6 h-6 mr-2 text-[#C81E78]" />
                      )}
                      <span>{uploadedFiles[field.name]
                        ? uploadedFiles[field.name]!.name
                        : "Select File"}</span>
                      {uploadedFiles[field.name] && (
                        <X
                          className="w-4 h-4 ml-2 text-red-500"
                          onClick={(e) => {
                            e.preventDefault()
                            handleFileRemove(field.name)
                          }}
                        />
                      )}
                    </label>
                  </div>
                ) : (
                  <Input
                    placeholder={field.placeholder}
                    value={uploadedFiles[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e)}
                  />
                )}
              </div>
            ))}

            <Button
              type="submit"
              className="w-full bg-[#C81E78] hover:bg-[#A61860] text-white"
            >
              SUBMIT
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
