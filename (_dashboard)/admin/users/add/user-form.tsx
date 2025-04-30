/* "use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function UserForm() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <Label htmlFor="password">Password:</Label>
        <Input id="password" type="password" />
      </div>

      {/* Last Login Section }
      <div className="grid gap-2">
        <Label>Last Login:</Label>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last-week">Last Week</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Morning</SelectItem>
              <SelectItem value="afternoon">Afternoon</SelectItem>
              <SelectItem value="evening">Evening</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <span className="text-[0.8rem] text-muted-foreground">
          Note: You are 1 hour behind server time
        </span>
      </div>

      {/* User Permissions Section }
      <div className="grid gap-2">
        <Label>User Permissions</Label>
        <div className="space-y-2">
          {[
            { id: "driver-add", label: "accounts| driver| can add driver" },
            { id: "driver-change", label: "accounts| driver| can change driver" },
            { id: "driver-delete", label: "accounts| driver| can delete driver" },
            { id: "driver-view", label: "accounts| driver| can view driver" },
            { id: "store-add", label: "accounts| store| can add store" },
            { id: "store-change", label: "accounts| store| can change store" },
            { id: "store-delete", label: "accounts| store| can delete store" },
            { id: "store-view", label: "accounts| store| can view store" },
          ].map(({ id, label }) => (
            <div key={id} className="flex items-center space-x-2">
              <Checkbox id={id} />
              <label htmlFor={id} className="text-sm">{label}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Staff Status Section }
      <div className="grid gap-2">
        <Label>Staff Status</Label>
        <div className="flex items-center gap-2">
          <Checkbox id="active" />
          <Label htmlFor="active">Active</Label>
        </div>
        <p className="text-sm text-muted-foreground">
          Designate whether this user should be treated as active. Unselect this instead of deleting accounts.
        </p>
      </div>

      {/* Date Joined Section }
      <div className="grid gap-2">
        <Label>Date Joined:</Label>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last-week">Last Week</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Morning</SelectItem>
              <SelectItem value="afternoon">Afternoon</SelectItem>
              <SelectItem value="evening">Evening</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <span className="text-[0.8rem] text-muted-foreground">
          Note: You are 1 hour behind server time
        </span>
      </div>

      {/* User Type Section }
      <div className="grid gap-2">
        <Label>User Type</Label>
        <RadioGroup defaultValue="basic-user">
          <div className="flex items-center space-x-2">
            <RadioGroupItem id="station-master" value="station-master" />
            <Label htmlFor="station-master">Station Master</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem id="premium-user" value="premium-user" />
            <Label htmlFor="premium-user">Premium User</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem id="basic-user" value="basic-user" />
            <Label htmlFor="basic-user">Basic User</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Avatar Section }
      <div className="grid gap-2">
        <Label>Avatar</Label>
        <div className="flex items-center gap-4">
          <Button variant="outline">Choose File</Button>
          <span className="text-sm text-muted-foreground">No file chosen</span>
        </div>
      </div>

      {/* Basic Information Section }
      <div className="grid gap-2">
        <Label htmlFor="name">Name:</Label>
        <Input id="name" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Phone Number:</Label>
        <Input id="phone" type="tel" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="gps">GPS :</Label>
        <Input id="gps" />
      </div>

      {/* Verification Section }
      <div className="flex items-center gap-2">
        <Checkbox id="verified" />
        <Label htmlFor="verified">Is Verified</Label>
      </div>

      {/* Form Actions }
      <div className="flex gap-2">
        <Button className="bg-[#D81B60] text-white hover:bg-[#C2185B]">Save and add another</Button>
        <Button className="bg-[#D81B60] text-white hover:bg-[#C2185B]">Save and continue editing</Button>
        <Button className="bg-[#D81B60] text-white hover:bg-[#C2185B]">Save</Button>
      </div>
    </div>
  )
}
*/

export {};