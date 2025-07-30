const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ContributeStationData {
  name: string;
  station_address: string;
  station_latitude: string;
  station_longitude: string;
}

export interface ContributeFareData {
  start_station: string;
  end_station: string;
  transport_type: string;
  fare_amount: string;
}

export interface ContributeShapeData {
  route_name: string;
  shape_data: any; // This will depend on your shape format
}

export interface ContributeShapePointData {
  shape_id: number;
  latitude: number;
  longitude: number;
  sequence: number;
}

export interface ContributeStopTimeData {
  trip_id: number;
  station_id: number;
  arrival_time: string;
  departure_time: string;
  stop_sequence: number;
}

export class ContributeApi {
  static async contributeStation(data: ContributeStationData): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/contribute/station/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to contribute station');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to contribute station:', error);
      throw error;
    }
  }

  static async contributeFare(data: ContributeFareData): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/contribute/fare/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to contribute fare');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to contribute fare:', error);
      throw error;
    }
  }

  static async contributeShape(data: ContributeShapeData): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/contribute/shape/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to contribute shape');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to contribute shape:', error);
      throw error;
    }
  }

  static async contributeShapePoint(data: ContributeShapePointData): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/contribute/shapepoint/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to contribute shape point');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to contribute shape point:', error);
      throw error;
    }
  }

  static async contributeStopTime(data: ContributeStopTimeData): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/contribute/stoptime/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to contribute stop time');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to contribute stop time:', error);
      throw error;
    }
  }
} 