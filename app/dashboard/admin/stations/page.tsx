'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StationsApi, type Station } from '@/app/lib/api/stations';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function StationsAdminPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [stationsNext, setStationsNext] = useState<string | null>(null); // For pagination
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStation, setNewStation] = useState({
    name: '',
    station_address: '',
    latitude: '',
    longitude: ''
  });

  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    try {
      setLoading(true);
      const apiStationsResp = await StationsApi.getStationsWithPagination();
      setStations(apiStationsResp.results);
      setStationsNext(apiStationsResp.next || null);
    } catch (error) {
      console.error('Failed to load stations:', error);
      toast.error('Failed to load stations');
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

  const handleAddStation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!newStation.name || !newStation.station_address) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const stationData = {
        name: newStation.name,
        station_address: newStation.station_address,
        station_latitude: newStation.latitude || '0',
        station_longitude: newStation.longitude || '0'
      };

      // For now, we'll just add to the local state since we don't have a create endpoint
      const newStationObj: Station = {
        id: Date.now(), // Temporary ID
        name: stationData.name,
        station_address: stationData.station_address,
        latitude: stationData.station_latitude,
        longitude: stationData.station_longitude
      };

      setStations([...stations, newStationObj]);
      setNewStation({ name: '', station_address: '', latitude: '', longitude: '' });
      setShowAddForm(false);
      toast.success('Station added successfully');
    } catch (error) {
      console.error('Failed to add station:', error);
      toast.error('Failed to add station');
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
        <h1 className="text-2xl font-bold text-[#B4257A]">Stations Management</h1>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#B4257A] hover:bg-[#A61860] text-white"
        >
          {showAddForm ? 'Cancel' : 'Add Station'}
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Station</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddStation} className="space-y-4">
              <div>
                <Label htmlFor="name">Station Name *</Label>
                <Input
                  id="name"
                  value={newStation.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewStation({...newStation, name: e.target.value})}
                  placeholder="Enter station name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Station Address *</Label>
                <Input
                  id="address"
                  value={newStation.station_address}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewStation({...newStation, station_address: e.target.value})}
                  placeholder="Enter station address"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={newStation.latitude}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewStation({...newStation, latitude: e.target.value})}
                    placeholder="e.g., 5.6037"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={newStation.longitude}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewStation({...newStation, longitude: e.target.value})}
                    placeholder="e.g., -0.1870"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-[#B4257A] hover:bg-[#A61860] text-white">
                  Add Station
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
        {stations.map((station) => (
          <Card key={station.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{station.name}</h3>
                  <p className="text-gray-600 text-sm">{station.station_address}</p>
                  {station.latitude && station.longitude && (
                    <p className="text-gray-500 text-xs">
                      {station.latitude}, {station.longitude}
                    </p>
                  )}
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

      {stations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No stations found</p>
        </div>
      )}
    </div>
  );
}