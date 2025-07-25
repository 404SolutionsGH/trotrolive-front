"use client";

import { useState } from "react";
import { ArrowLeft, MapPin, Star, Clock, Car, Bus, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";
import Input from "@/components/ui/input";
import { useQueryState, parseAsString } from "nuqs";
import Link from "next/link";
import { useAtomValue } from "jotai";
import { stationsAtom } from "@/states/stations";
import StationComboBox from "@/components/StationComboBox";
import Image from "next/image"

// Utility function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Utility function to calculate estimated travel time
function calculateTravelTime(distance: number): { min: number; max: number } {
  // Average trotro speed: 20-30 km/h in city traffic
  const avgSpeedMin = 20; // km/h
  const avgSpeedMax = 30; // km/h

  const timeMin = (distance / avgSpeedMin) * 60; // Convert to minutes
  const timeMax = (distance / avgSpeedMax) * 60; // Convert to minutes

  return {
    min: Math.round(timeMin),
    max: Math.round(timeMax),
  };
}

// Utility function to calculate estimated fare
function calculateFare(distance: number): number {
  // Base fare: 2 GHS for first 2km
  // Additional fare: 0.5 GHS per km after 2km
  const baseFare = 2;
  const additionalKm = Math.max(0, distance - 2);
  const additionalFare = additionalKm * 0.5;

  return Math.round((baseFare + additionalFare) * 10) / 10; // Round to 1 decimal place
}

const MapComponent = dynamic(() => import("@/components/trips/map"), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
      Loading map...
    </div>
  ),
});

export default function SearchResults() {
  const [selectedTransport, setSelectedTransport] = useState("trotro");
  const [selectedCity] = useQueryState("city", parseAsString.withDefault(""));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const stations = useAtomValue(stationsAtom);

  const [startStation, setStartStation] = useQueryState(
    "start",
    parseAsString.withDefault(""),
  );
  const [destinationStation, setDestinationStation] = useQueryState(
    "destination",
    parseAsString.withDefault(""),
  );

  // Find the actual station objects based on selected names
  const startStationObj =
    stations.find((station) => station.id == Number(startStation)) || null;
  const destinationStationObj =
    stations.find((station) => station.id == Number(destinationStation)) ||
    null;

  // Calculate distance if both stations are selected
  const routeDistance =
    startStationObj && destinationStationObj
      ? calculateDistance(
          parseFloat(startStationObj.station_latitude),
          parseFloat(startStationObj.station_longitude),
          parseFloat(destinationStationObj.station_latitude),
          parseFloat(destinationStationObj.station_longitude),
        )
      : null;

  // Calculate travel time if distance is available
  const travelTime = routeDistance ? calculateTravelTime(routeDistance) : null;

  // Calculate fare if distance is available
  const estimatedFare = routeDistance ? calculateFare(routeDistance) : 35;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b relative z-[60]">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
          <Link href="/" prefetch={true} className="font-bold">
            <Image
              src="/assets/logo.png"
              alt="Logo"
              unoptimized={true}
              width={50}
              height={50}
             />
          </Link>          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar - Mobile Overlay / Desktop Sidebar */}
      <div className={`
        ${isSidebarOpen ? 'fixed inset-0 z-[80] lg:relative lg:z-auto' : 'hidden lg:block'}
        lg:w-96 bg-white shadow-lg flex flex-col z-[80]
      `}>
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end p-4 border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="p-4 border-b">
          <Link href="/" prefetch={true} className="font-bold">
            <Image
              src="/assets/logo.png"
              alt="Logo"
              unoptimized={true}
              width={50}
              height={50}
             />
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={`/?start=${startStation}&destination=${destinationStation}&city=${selectedCity}`}
              aria-label="Back to home"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 cursor-pointer" />
            </Link>
            <h2 className="text-lg font-semibold">{selectedCity}</h2>
          </div>
        </div>

        {/* Location Section */}
        <div className="p-4">
          <div className="bg-pink-50 p-4 rounded-lg space-y-4">
            <div className="relative">
              <StationComboBox
                label="From"
                id="from-station"
                value={startStation}
                onChange={setStartStation}
                options={stations}
                leftIcon={
                  <span className="w-3 h-3 bg-purple-600 rounded-full block" />
                }
              />
            </div>

            <div className="relative">
              <StationComboBox
                label="Destination"
                id="destination-station"
                value={destinationStation}
                onChange={setDestinationStation}
                options={stations}
                leftIcon={<Bus className="w-3 h-3 text-purple-600" />}
              />
            </div>
          </div>
        </div>

        {/* Transport Options */}
        <div className="px-4 mb-6">
          <div className="flex gap-2">
            <Button
              variant={selectedTransport === "trotro" ? "default" : "outline"}
              className={`flex-1 ${
                selectedTransport === "trotro"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : ""
              }`}
              onClick={() => setSelectedTransport("trotro")}
            >
              <Bus className="w-4 h-4 mr-2" />
              Trotro
            </Button>
            <Button
              disabled
              variant={selectedTransport === "taxi" ? "default" : "outline"}
              className={`flex-1 ${
                selectedTransport === "taxi"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : ""
              }`}
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

          {startStationObj && destinationStationObj ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Route Duration</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="font-semibold">
                  {travelTime
                    ? `${travelTime.min}-${travelTime.max} mins`
                    : "30-45 mins"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">Route Distance</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4 text-purple-600" />
                <span className="font-semibold">
                  {routeDistance
                    ? `${routeDistance.toFixed(1)} km`
                    : "~12.5 km"}
                </span>
              </div>

              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-purple-800 mb-1">
                  Route Summary
                </div>
                <div className="text-xs text-purple-600">
                  {startStationObj.name} → {destinationStationObj.name}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Ride Duration</span>
            </div>
          )}
        </div>

        </div>

        {/* Total Price */}
        <div className="px-4 py-4 border-t bg-white">
          <div className="bg-purple-600 text-white p-4 rounded-lg flex justify-between items-center">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold">Ghc {estimatedFare}</span>
          </div>
        </div>
      </div>

      {/* Map and Stations */}
      <div className="flex-1 relative flex flex-col z-[10]">
        {/* Map Area */}
        <div className="h-64 lg:h-2/3 relative z-[10]">
          <MapComponent
            key={`${startStation}-${destinationStation}`}
            startStation={startStationObj}
            destinationStation={destinationStationObj}
          />
        </div>

        {/* Stations Section */}
        <div className="flex-1 lg:h-1/3 bg-white p-4 lg:p-6 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4 text-purple-600">
            Lorry Stations Near You
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
            {stations.slice(0, 6).map((station, index) => (
              <Card key={index} className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                      <Bus className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-purple-600 mb-1 truncate">
                        {station.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
                        {station.station_address}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">
                            {/* {station.rating} */} 0
                          </span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= Math.floor(0)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {/* {station.} */}
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

      {/* Mobile Overlay Background */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[75] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          style={{ touchAction: 'none' }}
        />
      )}
    </div>
  );
}
