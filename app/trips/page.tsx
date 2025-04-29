'use client';

import { useSearchParams } from "next/navigation";
import { trips } from "@/data/dummy-data";

export default function TripsPage() {
  const searchParams = useSearchParams();
  const startStation = searchParams.get("start");
  const destination = searchParams.get("destination");

  const matchedTrips = trips.filter(
    (trip) =>
      trip.start_station.id.toString() === startStation &&
      trip.destination.id.toString() === destination
  );

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-8">Trip Results</h1>
      {matchedTrips.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-3">Start Station</th>
              <th className="border border-gray-300 p-3">Destination</th>
              <th className="border border-gray-300 p-3">Fare</th>
              <th className="border border-gray-300 p-3">Transport Type</th>
              <th className="border border-gray-300 p-3">Route</th>
            </tr>
          </thead>
          <tbody>
            {matchedTrips.map((trip) => (
              <tr key={trip.id}>
                <td className="border border-gray-300 p-3">{trip.start_station.name}</td>
                <td className="border border-gray-300 p-3">{trip.destination.name}</td>
                <td className="border border-gray-300 p-3">GHS {trip.fare}</td>
                <td className="border border-gray-300 p-3">{trip.transport_type_display}</td>
                <td className="border border-gray-300 p-3">{trip.route}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-lg text-gray-600">No trips found for the selected stations.</p>
      )}
    </div>
  );
}