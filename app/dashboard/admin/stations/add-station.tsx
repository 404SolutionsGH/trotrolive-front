/* 'use client'

import { Button } from "@/components/ui/button"
import {
//   Card,
  CardContent,
  CardFooter,
  // CardHeader,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function StationForm() {
  return (
    <main className="flex-1 p-4 lg:p-6">
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name:</Label>
                <Input id="name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="user">User:</Label>
                <Select>
                  <SelectTrigger id="user">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user1">User 1</SelectItem>
                    <SelectItem value="user2">User 2</SelectItem>
                    <SelectItem value="user3">User 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Station address:</Label>
                <Input id="address" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="latitude">Station latitude:</Label>
                <Input id="latitude" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="longitude">Station longitude:</Label>
                <Input id="longitude" />
              </div>
              <div className="grid gap-2">
                <Label>Image:</Label>
                <Input type="file" className="cursor-pointer" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-start gap-2">
              <Button className="bg-[#D81B60] hover:bg-[#D81B60]/90">Save and add another</Button>
              <Button className="bg-[#D81B60] hover:bg-[#D81B60]/90">Save and continue editing</Button>
              <Button className="bg-[#D81B60] hover:bg-[#D81B60]/90">Save</Button>
            </CardFooter>

        </main>
  )
}
*/

export {};