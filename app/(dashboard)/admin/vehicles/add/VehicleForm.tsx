/* "use client"

// import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const VehicleForm = () => {

  return (
    <main className="flex-1 p-6">
    {/* <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
    <Link className="hover:text-foreground" href="#">
        Admin
    </Link>
    <span>/</span>
    <Link className="hover:text-foreground" href="#">
        Stations
    </Link>
    <span>/</span>
    <span className="text-foreground">Vehicles</span>
    </div> 
    <div className="space-y-6">
    <div className="space-y-4">
        <div className="grid gap-2">
        <label htmlFor="make">Make:</label>
        <Input id="make" />
        </div>
        <div className="grid gap-2">
        <label htmlFor="model">Model:</label>
        <Select>
            <SelectTrigger id="model">
            <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="model1">Model 1</SelectItem>
            <SelectItem value="model2">Model 2</SelectItem>
            <SelectItem value="model3">Model 3</SelectItem>
            </SelectContent>
        </Select>
        </div>
        <div className="grid gap-2">
        <label htmlFor="year">Year:</label>
        <Input id="year" type="number" />
        </div>
        <div className="grid gap-2">
        <label htmlFor="registration">Registration number:</label>
        <Input id="registration" />
        </div>
        <div className="grid gap-2">
        <label htmlFor="capacity">Capacity:</label>
        <Input id="capacity" type="number" />
        </div>
        <div className="grid gap-2">
        <label>Route:</label>
        <div className="flex gap-4">
            <Select>
            <SelectTrigger>
                <SelectValue placeholder="From" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="location1">Location 1</SelectItem>
                <SelectItem value="location2">Location 2</SelectItem>
                <SelectItem value="location3">Location 3</SelectItem>
            </SelectContent>
            </Select>
            <Select>
            <SelectTrigger>
                <SelectValue placeholder="To" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="location1">Location 1</SelectItem>
                <SelectItem value="location2">Location 2</SelectItem>
                <SelectItem value="location3">Location 3</SelectItem>
            </SelectContent>
            </Select>
        </div>
        </div>
    </div>
    <div className="flex gap-4">
        <Button className="bg-[#B4197D] text-white hover:bg-[#B4197D]/90">
        Save and add another
        </Button>
        <Button className="bg-[#B4197D] text-white hover:bg-[#B4197D]/90">
        Save and continue editing
        </Button>
        <Button className="bg-[#B4197D] text-white hover:bg-[#B4197D]/90">
        Save
        </Button>
    </div>
    </div>
        </main>
  )
}

export default VehicleForm

*/