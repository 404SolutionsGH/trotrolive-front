'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { ContributeApi, type ContributeStationData, type ContributeFareData } from '@/app/lib/api/contribute';

// Form schema for different contribution types
const contributionSchema = z.object({
  contributionType: z.enum(['station', 'fare', 'trip']),
  // Station fields
  stationName: z.string().optional(),
  stationAddress: z.string().optional(),
  stationLatitude: z.string().optional(),
  stationLongitude: z.string().optional(),
  // Fare fields
  startStation: z.string().optional(),
  endStation: z.string().optional(),
  transportType: z.enum(['trotro', 'taxi', 'bus']).optional(),
  fareAmount: z.string().optional(),
  // Trip fields
  routeName: z.string().optional(),
  scheduleType: z.enum(['Regular', 'Express', 'Special']).optional(),
  departureTime: z.string().optional(),
});

type ContributionForm = z.infer<typeof contributionSchema>;

export default function ContributePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contributionType, setContributionType] = useState<'station' | 'fare' | 'trip'>('station');
  const { isAuthenticated } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContributionForm>({
    resolver: zodResolver(contributionSchema)
  });


  const onSubmit = async (data: ContributionForm) => {
    if (!isAuthenticated) {
      setError('You must be logged in to contribute data');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      switch (data.contributionType) {
        case 'station':
          if (!data.stationName || !data.stationAddress) {
            throw new Error('Please fill in all required station fields');
          }
          const stationData: ContributeStationData = {
            name: data.stationName,
            station_address: data.stationAddress,
            station_latitude: data.stationLatitude || '0',
            station_longitude: data.stationLongitude || '0',
          };
          try {
            await ContributeApi.contributeStation(stationData);
          } catch (apiError) {
            setError('Failed to contribute station. Please try again later.');
            return;
          }
          break;
        case 'fare':
          if (!data.startStation || !data.endStation || !data.fareAmount || !data.transportType) {
            throw new Error('Please fill in all required fare fields');
          }
          const fareData: ContributeFareData = {
            start_station: data.startStation,
            end_station: data.endStation,
            transport_type: data.transportType,
            fare_amount: data.fareAmount,
          };
          try {
            await ContributeApi.contributeFare(fareData);
          } catch (apiError) {
            setError('Failed to contribute fare. Please try again later.');
            return;
          }
          break;
        case 'trip':
          if (!data.startStation || !data.endStation || !data.transportType) {
            throw new Error('Please fill in all required trip fields');
          }
          const tripData: ContributeFareData = {
            start_station: data.startStation,
            end_station: data.endStation,
            transport_type: data.transportType,
            fare_amount: '0', // Default fare for trip contribution
          };
          try {
            await ContributeApi.contributeFare(tripData);
          } catch (apiError) {
            setError('Failed to contribute trip. Please try again later.');
            return;
          }
          break;
        default:
          setError('Invalid contribution type.');
          return;
      }

      reset();
      router.push('/dashboard/contribute/success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Contribute Trotro Data</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Contribution Type
            <select
              {...register('contributionType')}
              onChange={(e) => setContributionType(e.target.value as 'station' | 'fare' | 'trip')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="station">Station Information</option>
              <option value="fare">Fare Information</option>
              <option value="trip">Trip Information</option>
            </select>
          </label>
        </div>

        {contributionType === 'station' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">
                Station Name
                <input
                  {...register('stationName')}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  placeholder="e.g., Circle Station"
                />
              </label>
              {errors.stationName && (
                <p className="text-red-600 text-sm mt-1">{errors.stationName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Station Address
                <input
                  {...register('stationAddress')}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  placeholder="Full address of the station"
                />
              </label>
              {errors.stationAddress && (
                <p className="text-red-600 text-sm mt-1">{errors.stationAddress.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Latitude
                  <input
                    {...register('stationLatitude')}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    placeholder="e.g., 5.6037"
                  />
                </label>
                {errors.stationLatitude && (
                  <p className="text-red-600 text-sm mt-1">{errors.stationLatitude.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Longitude
                  <input
                    {...register('stationLongitude')}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    placeholder="e.g., -0.1870"
                  />
                </label>
                {errors.stationLongitude && (
                  <p className="text-red-600 text-sm mt-1">{errors.stationLongitude.message}</p>
                )}
              </div>
            </div>
          </>
        )}

        {contributionType === 'fare' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Start Station
                  <input
                    {...register('startStation')}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    placeholder="Starting station"
                  />
                </label>
                {errors.startStation && (
                  <p className="text-red-600 text-sm mt-1">{errors.startStation.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  End Station
                  <input
                    {...register('endStation')}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    placeholder="End station"
                  />
                </label>
                {errors.endStation && (
                  <p className="text-red-600 text-sm mt-1">{errors.endStation.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Transport Type
                <select
                  {...register('transportType')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                >
                  <option value="">Select transport type</option>
                  <option value="trotro">Trotro</option>
                  <option value="taxi">Taxi</option>
                  <option value="bus">Bus</option>
                </select>
              </label>
              {errors.transportType && (
                <p className="text-red-600 text-sm mt-1">{errors.transportType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Fare Amount (GHS)
                <input
                  {...register('fareAmount')}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  placeholder="e.g., 5.00"
                />
              </label>
              {errors.fareAmount && (
                <p className="text-red-600 text-sm mt-1">{errors.fareAmount.message}</p>
              )}
            </div>
          </>
        )}

        {contributionType === 'trip' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Start Station
                  <input
                    {...register('startStation')}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    placeholder="Starting station"
                  />
                </label>
                {errors.startStation && (
                  <p className="text-red-600 text-sm mt-1">{errors.startStation.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  End Station
                  <input
                    {...register('endStation')}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    placeholder="End station"
                  />
                </label>
                {errors.endStation && (
                  <p className="text-red-600 text-sm mt-1">{errors.endStation.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Transport Type
                <select
                  {...register('transportType')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                >
                  <option value="">Select transport type</option>
                  <option value="trotro">Trotro</option>
                  <option value="taxi">Taxi</option>
                  <option value="bus">Bus</option>
                </select>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Departure Time
                <input
                  {...register('departureTime')}
                  type="time"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </label>
              {errors.departureTime && (
                <p className="text-red-600 text-sm mt-1">{errors.departureTime.message}</p>
              )}
            </div>
          </>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Data'}
          </button>
        </div>
      </form>
    </div>
  );
}
