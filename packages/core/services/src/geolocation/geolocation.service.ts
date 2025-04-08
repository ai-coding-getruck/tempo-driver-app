import { injectable } from 'inversify';
import {
  IGeolocationService,
  GeolocationCoordinates,
} from './geolocation.interface';

@injectable()
export class GeolocationService implements IGeolocationService {
  /**
   * Gets the current position of the device
   * @returns Promise with the current coordinates
   */
  async getCurrentPosition(): Promise<GeolocationCoordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator || !navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this device'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp,
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    });
  }

  /**
   * Watches the position of the device and calls the callback when it changes
   * @param callback Function to be called when the position changes
   * @returns ID of the watcher that can be used to clear it
   */
  watchPosition(callback: (position: GeolocationCoordinates) => void): number {
    if (!navigator || !navigator.geolocation) {
      throw new Error('Geolocation is not supported by this device');
    }

    return navigator.geolocation.watchPosition(
      (position) => {
        callback({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        console.error(`Geolocation watch error: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 },
    );
  }

  /**
   * Clears a position watcher
   * @param watchId ID of the watcher to clear
   */
  clearWatch(watchId: number): void {
    if (navigator && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
    }
  }

  /**
   * Calculates the distance between two coordinates in meters using the Haversine formula
   * @param start Starting coordinates
   * @param end Ending coordinates
   * @returns Distance in meters
   */
  calculateDistance(
    start: GeolocationCoordinates,
    end: GeolocationCoordinates,
  ): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (start.latitude * Math.PI) / 180;
    const φ2 = (end.latitude * Math.PI) / 180;
    const Δφ = ((end.latitude - start.latitude) * Math.PI) / 180;
    const Δλ = ((end.longitude - start.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }
}
