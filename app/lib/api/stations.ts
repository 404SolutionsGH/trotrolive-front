import { stations as mockStations } from '@/data/dummy-data';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Station {
  id: number;
  name: string;
  latitude?: string;
  longitude?: string;
  station_address?: string;
}

export interface StationAutosuggestResponse {
  results: Station[];
}

export class StationsApi {
  static async getStations(): Promise<Station[]> {
    try {
      const response = await fetch(`${API_URL}/api/stations/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stations');
      }

      const data = await response.json();
      return data.results || data;
    } catch (error) {
      console.warn('Using mock stations data due to API error:', error);
      return mockStations;
    }
  }

  static async getStationsWithPagination(nextUrl?: string): Promise<{ results: Station[]; next: string | null }> {
    try {
      const url = nextUrl || `${API_URL}/api/stations/`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch stations');
      }
      const data = await response.json();
      // If paginated, expect { results, next }, else fallback
      if (Array.isArray(data)) {
        return { results: data, next: null };
      }
      return {
        results: data.results || data,
        next: data.next || null,
      };
    } catch (error) {
      console.warn('Using mock stations data due to API error:', error);
      return { results: mockStations, next: null };
    }
  }

  static async getStationAutosuggest(query: string): Promise<Station[]> {
    try {
      const response = await fetch(`${API_URL}/api/stations/autosuggest/?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch station suggestions');
      }

      const data: StationAutosuggestResponse = await response.json();
      return data.results || [];
    } catch (error) {
      console.warn('Using mock stations data for autosuggest due to API error:', error);
      // Filter mock stations based on query
      return mockStations.filter(station => 
        station.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  static async getNearestStations(lat: number, lng: number): Promise<Station[]> {
    try {
      const response = await fetch(`${API_URL}/api/stations/nearest/?lat=${lat}&lng=${lng}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch nearest stations');
      }

      const data = await response.json();
      return data.results || data;
    } catch (error) {
      console.warn('Using mock stations data for nearest stations due to API error:', error);
      return mockStations;
    }
  }

  static async getStation(id: number): Promise<Station | null> {
    try {
      const response = await fetch(`${API_URL}/api/stations/${id}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch station');
      }

      return await response.json();
    } catch (error) {
      console.warn('Using mock station data due to API error:', error);
      return mockStations.find(station => station.id === id) || null;
    }
  }
} 