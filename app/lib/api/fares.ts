const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Fare {
  id: number;
  start_station: number;
  end_station: number;
  transport_type: string;
  fare_amount: string;
  created_at?: string;
  updated_at?: string;
}

export interface FareResponse {
  results: Fare[];
}

export class FaresApi {
  static async getFares(): Promise<Fare[]> {
    try {
      const response = await fetch(`${API_URL}/api/fares/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch fares');
      }

      const data: FareResponse = await response.json();
      return data.results || data;
    } catch (error) {
      console.warn('Using mock fares data due to API error:', error);
      // Return empty array for fares since we don't have mock fare data
      return [];
    }
  }

  static async getFare(id: number): Promise<Fare | null> {
    try {
      const response = await fetch(`${API_URL}/api/fares/${id}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch fare');
      }

      return await response.json();
    } catch (error) {
      console.warn('Using mock fare data due to API error:', error);
      return null;
    }
  }

  static async createFare(fareData: Partial<Fare>): Promise<Fare> {
    try {
      const response = await fetch(`${API_URL}/api/fares/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fareData),
      });

      if (!response.ok) {
        throw new Error('Failed to create fare');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create fare:', error);
      throw error;
    }
  }

  static async updateFare(id: number, fareData: Partial<Fare>): Promise<Fare> {
    try {
      const response = await fetch(`${API_URL}/api/fares/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fareData),
      });

      if (!response.ok) {
        throw new Error('Failed to update fare');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update fare:', error);
      throw error;
    }
  }

  static async patchFare(id: number, fareData: Partial<Fare>): Promise<Fare> {
    try {
      const response = await fetch(`${API_URL}/api/fares/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fareData),
      });

      if (!response.ok) {
        throw new Error('Failed to patch fare');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to patch fare:', error);
      throw error;
    }
  }

  static async deleteFare(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/fares/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete fare');
      }
    } catch (error) {
      console.error('Failed to delete fare:', error);
      throw error;
    }
  }
} 