'use client';

import { useSearchParams } from "next/navigation";
import { generateAllPossibleTrips } from "@/data/dummy-data";
import Footer from "@/components/footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TripsPage() {
  const searchParams = useSearchParams();
  const startStation = searchParams.get("start");
  const destination = searchParams.get("destination");

  // Use the function to get all possible trips
  const allTrips = generateAllPossibleTrips();
  
  const matchedTrips = allTrips.filter(
    (trip) =>
      trip.start_station.id.toString() === startStation &&
      trip.destination.id.toString() === destination
  );

  // Format transport type for display
  const formatTransportType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto py-8 md:py-16 px-4 mb-24">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-pink-500 hover:text-pink-600">
            <ArrowLeft size={20} className="mr-2" />
            <span>Back to Home</span>
          </Link>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8 text-gray-800">
          Trip Results
        </h1>
        
        {matchedTrips.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow">
            {/* Table for medium screens and above */}
            <table className="hidden md:table w-full border-collapse">
              <thead>
                <tr className="bg-pink-100">
                  <th className="border-b p-3 text-left">Start Station</th>
                  <th className="border-b p-3 text-left">Destination</th>
                  <th className="border-b p-3 text-left">Fare</th>
                  <th className="border-b p-3 text-left">Transport Type</th>
                  <th className="border-b p-3 text-left">Route</th>
                </tr>
              </thead>
              <tbody>
                {matchedTrips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-gray-50 border-b border-gray-200">
                    <td className="p-3">{trip.start_station.name}</td>
                    <td className="p-3">{trip.destination.name}</td>
                    <td className="p-3">GHS {trip.fare}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        trip.transport_type === 'trotro' ? 'bg-blue-100 text-blue-800' :
                        trip.transport_type === 'okada' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {formatTransportType(trip.transport_type)}
                      </span>
                    </td>
                    <td className="p-3">{trip.route}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Cards for small screens */}
            <div className="md:hidden space-y-4">
              {matchedTrips.map((trip) => (
                <div key={trip.id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{trip.start_station.name} → {trip.destination.name}</h3>
                      <p className="text-gray-500 text-sm">{trip.route}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      trip.transport_type === 'trotro' ? 'bg-blue-100 text-blue-800' :
                      trip.transport_type === 'okada' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {formatTransportType(trip.transport_type)}
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <p className="text-lg font-bold text-pink-500">GHS {trip.fare}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-lg text-gray-600 mb-4">
              No trips found for the selected stations.
            </p>
            <Button asChild className="bg-pink-500 hover:bg-pink-600">
              <Link href="/">
                Try Different Stations
              </Link>
            </Button>
          </div>
        )}
      </main>

      {/* Disclaimer */}
      <div className="text-center text-xs text-gray-500 px-4 mb-24">
        Disclaimer: Trip results are dummy data and for demo purposes only.
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}