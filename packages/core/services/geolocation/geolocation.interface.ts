/**
 * Interface for the Geolocation service
 */
export interface IGeolocationService {
  /**
   * Gets the current position of the device
   * @returns Promise with the current coordinates
   */
  getCurrentPosition(): Promise<GeolocationCoordinates>;

  /**
   * Watches the position of the device and calls the callback when it changes
   * @param callback Function to be called when the position changes
   * @returns ID of the watcher that can be used to clear it
   */
  watchPosition(callback: (position: GeolocationCoordinates) => void): number;

  /**
   * Clears a position watcher
   * @param watchId ID of the watcher to clear
   */
  clearWatch(watchId: number): void;

  /**
   * Calculates the distance between two coordinates in meters
   * @param start Starting coordinates
   * @param end Ending coordinates
   * @returns Distance in meters
   */
  calculateDistance(
    start: GeolocationCoordinates,
    end: GeolocationCoordinates,
  ): number;
}

/**
 * Coordinates returned by the Geolocation API
 */
export interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
  timestamp?: number;
}
