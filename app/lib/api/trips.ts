import { generateAllPossibleTrips } from '@/data/dummy-data';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Trip {
  id: number;
  start_station: { id: number; name: string };
  destination: { id: number; name: string };
  transport_type: string;
  fare: string;
  route: string;
  departure_time?: string;
  schedule_type?: string;
}

export interface TripSearchRequest {
  start_station?: number;
  destination?: number;
  transport_type?: string;
}

export interface TripSearchResponse {
  results: Trip[];
}

export class TripsApi {
  static async getTrips(): Promise<Trip[]> {
    try {
      const response = await fetch(`${API_URL}/api/trips/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch trips');
      }

      const data = await response.json();
      return data.results || data;
    } catch (error) {
      console.warn('Using mock trips data due to API error:', error);
      return generateAllPossibleTrips();
    }
  }

  static async searchTrips(searchParams: TripSearchRequest): Promise<Trip[]> {
    try {
      const queryParams = new URLSearchParams();
      if (searchParams.start_station) queryParams.append('start_station', searchParams.start_station.toString());
      if (searchParams.destination) queryParams.append('destination', searchParams.destination.toString());
      if (searchParams.transport_type) queryParams.append('transport_type', searchParams.transport_type);

      const response = await fetch(`${API_URL}/api/trips/search/?${queryParams.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });

      if (!response.ok) {
        throw new Error('Failed to search trips');
      }

      const data: TripSearchResponse = await response.json();
      return data.results || [];
    } catch (error) {
      console.warn('Using mock trips data for search due to API error:', error);
      // Use mock data and filter based on search params
      const allTrips = generateAllPossibleTrips();
      
      return allTrips.filter(trip => {
        if (searchParams.start_station && trip.start_station.id !== searchParams.start_station) {
          return false;
        }
        if (searchParams.destination && trip.destination.id !== searchParams.destination) {
          return false;
        }
        if (searchParams.transport_type && trip.transport_type !== searchParams.transport_type) {
          return false;
        }
        return true;
      });
    }
  }

  static async getTrip(id: number): Promise<Trip | null> {
    try {
      const response = await fetch(`${API_URL}/api/trips/${id}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch trip');
      }

      return await response.json();
    } catch (error) {
      console.warn('Using mock trip data due to API error:', error);
      const allTrips = generateAllPossibleTrips();
      return allTrips.find(trip => trip.id === id) || null;
    }
  }

  static async createTrip(tripData: Partial<Trip>): Promise<Trip> {
    try {
      const response = await fetch(`${API_URL}/api/trips/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      });

      if (!response.ok) {
        throw new Error('Failed to create trip');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create trip:', error);
      throw error;
    }
  }

  static async updateTrip(id: number, tripData: Partial<Trip>): Promise<Trip> {
    try {
      const response = await fetch(`${API_URL}/api/trips/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      });

      if (!response.ok) {
        throw new Error('Failed to update trip');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update trip:', error);
      throw error;
    }
  }

  static async deleteTrip(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/trips/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete trip');
      }
    } catch (error) {
      console.error('Failed to delete trip:', error);
      throw error;
    }
  }

  static async approveTrip(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/trips/${id}/approve/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve trip');
      }
    } catch (error) {
      console.error('Failed to approve trip:', error);
      throw error;
    }
  }

  static async rejectTrip(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/trips/${id}/reject/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reject trip');
      }
    } catch (error) {
      console.error('Failed to reject trip:', error);
      throw error;
    }
  }

  static async updateTripFare(id: number, fare: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/trips/${id}/update_fare/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fare }),
      });

      if (!response.ok) {
        throw new Error('Failed to update trip fare');
      }
    } catch (error) {
      console.error('Failed to update trip fare:', error);
      throw error;
    }
  }
} 