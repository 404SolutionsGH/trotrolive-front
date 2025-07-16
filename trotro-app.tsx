"use client"

import { useState } from "react"
import { ArrowLeft, MapPin, Star, Clock, Car, Bus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import dynamic from "next/dynamic"

const MapComponent = dynamic(() => import("./components/trips/map"), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
      Loading map...
    </div>
  ),
})

export default function TrotroApp() {
  const [selectedTransport, setSelectedTransport] = useState("trotro")

  const stations = [
    {
      name: "Tsui Bleoo Station",
      location: "Teshi",
      rating: 3.2,
      status: "Closed",
    },
    {
      name: "Tsui Bleoo Station",
      location: "Teshi",
      rating: 3.2,
      status: "Closed",
    },
    {
      name: "Tsui Bleoo Station",
      location: "Teshi",
      rating: 3.2,
      status: "Closed",
    },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-96 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">Trotro</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-purple-600" />
            <div>
              <div className="font-medium">Current Location</div>
              <div>Amanfro, Kasoa</div>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Accra</h2>
          </div>

          <div className="bg-pink-50 p-4 rounded-lg space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-3 w-3 h-3 bg-purple-600 rounded-full"></div>
              <div className="absolute left-4 top-8 w-1 h-6 border-l-2 border-dashed border-purple-300"></div>
              <Input placeholder="From" className="pl-10 bg-white border-gray-200" />
            </div>

            <div className="relative">
              <Bus className="absolute left-3 top-3 w-3 h-3 text-purple-600" />
              <Input placeholder="Destination" className="pl-10 bg-white border-gray-200" />
            </div>
          </div>
        </div>

        {/* Transport Options */}
        <div className="px-4 mb-6">
          <div className="flex gap-2">
            <Button
              variant={selectedTransport === "trotro" ? "default" : "outline"}
              className={`flex-1 ${selectedTransport === "trotro" ? "bg-purple-600 hover:bg-purple-700" : ""}`}
              onClick={() => setSelectedTransport("trotro")}
            >
              <Bus className="w-4 h-4 mr-2" />
              Trotro
            </Button>
            <Button
              variant={selectedTransport === "taxi" ? "default" : "outline"}
              className={`flex-1 ${selectedTransport === "taxi" ? "bg-purple-600 hover:bg-purple-700" : ""}`}
              onClick={() => setSelectedTransport("taxi")}
            >
              <Car className="w-4 h-4 mr-2" />
              Taxi
            </Button>
          </div>
        </div>

        {/* Ride Details */}
        <div className="px-4 mb-6">
          <h3 className="font-semibold mb-3">Ride Details</h3>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="font-medium">Ride Duration</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="w-4 h-4 text-purple-600" />
            <span className="font-semibold">30-45 mins</span>
          </div>
        </div>

        {/* Total Price */}
        <div className="px-4 mt-auto mb-4">
          <div className="bg-purple-600 text-white p-4 rounded-lg flex justify-between items-center">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold">Ghc 35</span>
          </div>
        </div>
      </div>

      {/* Map and Stations */}
      <div className="flex-1 relative">
        {/* Map Area */}
        <div className="h-2/3 relative">
          <MapComponent />
        </div>

        {/* Stations Section */}
        <div className="h-1/3 bg-white p-6 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4 text-purple-600">Lorry Stations Near You</h3>

          <div className="flex gap-4 overflow-x-auto pb-4">
            {stations.map((station, index) => (
              <Card key={index} className="min-w-64 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                      <Bus className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-purple-600 mb-1">{station.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{station.location}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">{station.rating}</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= Math.floor(station.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {station.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
