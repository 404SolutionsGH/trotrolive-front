'use client';
import { useSearchParams } from "next/navigation";
import { generateAllPossibleTrips } from "@/data/dummy-data";
import { TripsApi, type TripSearchRequest } from "@/app/lib/api/trips";
import Footer from "@/components/footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function TripsPage() {
  const searchParams = useSearchParams();
  const startStation = searchParams.get("start");
  const destination = searchParams.get("destination");
  
  const [matchedTrips, setMatchedTrips] = useState<any[]>([]);
  const [tripsNext, setTripsNext] = useState<string | null>(null); // For pagination
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTrips = async () => {
      if (!startStation || !destination) {
        setError("Missing start or destination station");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Try to search trips using API first
        const searchParams: TripSearchRequest = {
          start_station: parseInt(startStation),
          destination: parseInt(destination),
        };

        // Search trips using API
        const apiTrips = await TripsApi.searchTrips(searchParams);
        setMatchedTrips(apiTrips);
        setTripsNext(null); // No pagination yet
      } catch (error) {
        console.warn('Using mock trips due to API error:', error);
        // Fallback to mock data
        const allTrips = generateAllPossibleTrips();
        const mockMatchedTrips = allTrips.filter(
          (trip) =>
            trip.start_station.id.toString() === startStation &&
            trip.destination.id.toString() === destination
        );
        setMatchedTrips(mockMatchedTrips);
        setTripsNext(null);
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, [startStation, destination]);

  // Handler to load more trips (pagination)
  const handleLoadMoreTrips = async () => {
    if (!tripsNext) return;
    try {
      setLoadingMore(true);
      // In the future, TripsApi.searchTrips can accept a nextUrl for pagination
      // For now, just a placeholder
      // const resp = await TripsApi.searchTrips({ nextUrl: tripsNext });
      // setMatchedTrips((prev) => [...prev, ...resp.results]);
      // setTripsNext(resp.next || null);
    } catch (error) {
      setError('Failed to load more trips.');
    } finally {
      setLoadingMore(false);
    }
  };

  // Format transport type for display
  const formatTransportType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button asChild className="bg-pink-500 hover:bg-pink-600">
              <Link href="/">
                Go Back Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Search</span>
                </Link>
              </Button>
            </div>
            <div className="text-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Trip Results
              </h1>
            </div>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
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
            {/* Pagination: Load more trips button if available */}
            {tripsNext && (
              <Button
                type="button"
                className="mt-4 bg-pink-100 text-pink-800 hover:bg-pink-200"
                onClick={handleLoadMoreTrips}
                disabled={loadingMore}
              >
                {loadingMore ? "Loading more..." : "Load More Trips"}
              </Button>
            )}
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
        Disclaimer: Trip results may include dummy data when API is unavailable.
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
