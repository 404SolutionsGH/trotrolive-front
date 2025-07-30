'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StationsApi, type Station } from '@/lib/api/stations';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Route {
  id: number;
  name: string;
  start_station: Station;
  end_station: Station;
  transport_type: string;
  created_at?: string;
}

export default function RoutesAdminPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [stationsNext, setStationsNext] = useState<string | null>(null); // For pagination
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRoute, setNewRoute] = useState({
    name: '',
    start_station: '',
    end_station: '',
    transport_type: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [apiStationsResp] = await Promise.all([
        StationsApi.getStationsWithPagination()
      ]);
      setStations(apiStationsResp.results);
      setStationsNext(apiStationsResp.next || null);
      
      // For now, we'll use mock routes since we don't have a routes API yet
      setRoutes([
        {
          id: 1,
          name: "Circle to Accra Mall",
          start_station: apiStationsResp.results[0] || { id: 1, name: "Circle" },
          end_station: apiStationsResp.results[1] || { id: 2, name: "Accra Mall" },
          transport_type: "trotro"
        },
        {
          id: 2,
          name: "Kokrobite to Accra",
          start_station: apiStationsResp.results[2] || { id: 3, name: "Kokrobite" },
          end_station: apiStationsResp.results[0] || { id: 1, name: "Circle" },
          transport_type: "bus"
        }
      ]);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load data');
      setStations([]);
      setStationsNext(null);
    } finally {
      setLoading(false);
    }
  };

  // Handler to load more stations (pagination)
  const handleLoadMoreStations = async () => {
    if (!stationsNext) return;
    try {
      setLoadingMore(true);
      const resp = await StationsApi.getStationsWithPagination(stationsNext);
      setStations((prev) => [...prev, ...resp.results]);
      setStationsNext(resp.next || null);
    } catch (error) {
      toast.error('Failed to load more stations.');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleAddRoute = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!newRoute.name || !newRoute.start_station || !newRoute.end_station || !newRoute.transport_type) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const startStation = stations.find(s => s.id.toString() === newRoute.start_station);
      const endStation = stations.find(s => s.id.toString() === newRoute.end_station);

      if (!startStation || !endStation) {
        toast.error('Invalid station selection');
        return;
      }

      const newRouteObj: Route = {
        id: Date.now(),
        name: newRoute.name,
        start_station: startStation,
        end_station: endStation,
        transport_type: newRoute.transport_type
      };

      setRoutes([...routes, newRouteObj]);
      setNewRoute({ name: '', start_station: '', end_station: '', transport_type: '' });
      setShowAddForm(false);
      toast.success('Route added successfully');
    } catch (error) {
      console.error('Failed to add route:', error);
      toast.error('Failed to add route');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#B4257A]">Routes Management</h1>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#B4257A] hover:bg-[#A61860] text-white"
        >
          {showAddForm ? 'Cancel' : 'Add Route'}
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Route</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddRoute} className="space-y-4">
              <div>
                <Label htmlFor="name">Route Name *</Label>
                <Input
                  id="name"
                  value={newRoute.name}
                  onChange={(e) => setNewRoute({...newRoute, name: e.target.value})}
                  placeholder="Enter route name"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_station">Start Station *</Label>
                  <Select 
                    value={newRoute.start_station} 
                    onValueChange={(value) => setNewRoute({...newRoute, start_station: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select start station" />
                    </SelectTrigger>
                    <SelectContent>
                      {stations.map((station) => (
                        <SelectItem key={station.id} value={station.id.toString()}>
                          {station.name}
                        </SelectItem>
                      ))}
                      {/* Pagination: Load more stations button if available */}
                      {stationsNext && (
                        <Button
                          type="button"
                          className="mt-2 bg-pink-100 text-pink-800 hover:bg-pink-200"
                          onClick={handleLoadMoreStations}
                          disabled={loadingMore}
                        >
                          {loadingMore ? "Loading more..." : "Load More Stations"}
                        </Button>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="end_station">End Station *</Label>
                  <Select 
                    value={newRoute.end_station} 
                    onValueChange={(value) => setNewRoute({...newRoute, end_station: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select end station" />
                    </SelectTrigger>
                    <SelectContent>
                      {stations.map((station) => (
                        <SelectItem key={station.id} value={station.id.toString()}>
                          {station.name}
                        </SelectItem>
                      ))}
                      {/* Pagination: Load more stations button if available */}
                      {stationsNext && (
                        <Button
                          type="button"
                          className="mt-2 bg-pink-100 text-pink-800 hover:bg-pink-200"
                          onClick={handleLoadMoreStations}
                          disabled={loadingMore}
                        >
                          {loadingMore ? "Loading more..." : "Load More Stations"}
                        </Button>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="transport_type">Transport Type *</Label>
                <Select 
                  value={newRoute.transport_type} 
                  onValueChange={(value) => setNewRoute({...newRoute, transport_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select transport type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trotro">Trotro</SelectItem>
                    <SelectItem value="bus">Bus</SelectItem>
                    <SelectItem value="taxi">Taxi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-[#B4257A] hover:bg-[#A61860] text-white">
                  Add Route
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {routes.map((route) => (
          <Card key={route.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{route.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {route.start_station.name} → {route.end_station.name}
                  </p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                    route.transport_type === 'trotro' ? 'bg-blue-100 text-blue-800' :
                    route.transport_type === 'bus' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {route.transport_type.charAt(0).toUpperCase() + route.transport_type.slice(1)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button size="sm" variant="outline" className="text-red-600">Delete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {routes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No routes found</p>
        </div>
      )}
    </div>
  );
}