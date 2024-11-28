"use client"

import { useState } from "react"
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
import { Camera, Cloud } from 'lucide-react'

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

  const roleFields: RoleFields = {
    driver: {
      fields: [
        {
          name: "idCard",
          type: "upload",
          label: "Upload ID Card",
        },
        {
          name: "license",
          type: "upload",
          label: "Upload Driver's license",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
  }

  const handleClearForm = () => {
    setSelectedRole("")
  }

  return (
    <div className="max-w-2xl mx-auto pt-10">
      <Card className="relative">
        <CardHeader className="space-y-1">
          <div className="flex justify-center items-center">
            <CardTitle className="text-xl items-left text-[#C81E78]">Role Upgrade</CardTitle>
            <Button
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
                {field.type === "upload" ? (
                  <div className="border rounded-md p-4 text-center cursor-pointer hover:bg-gray-50">
                    <Cloud className="w-6 h-6 mx-auto mb-2 text-[#C81E78]" />
                    <span>Select</span>
                  </div>
                ) : field.type === "camera" ? (
                  <div className="border rounded-md p-4 text-center cursor-pointer hover:bg-gray-50">
                    <Camera className="w-6 h-6 mx-auto mb-2 text-[#C81E78]" />
                    <span>Select</span>
                  </div>
                ) : (
                  <Input placeholder={field.placeholder} />
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
