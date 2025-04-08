import { injectable } from 'inversify';
import { Location } from './types';

/**
 * Interface for the Waze service
 */
export interface IWazeService {
  /**
   * Opens Waze with navigation to the specified location
   * @param location The destination location
   * @returns Promise that resolves when the deep link is opened
   */
  navigateTo(location: Location): Promise<boolean>;

  /**
   * Checks if Waze is installed on the device
   * @returns Promise that resolves to true if Waze is installed
   */
  isWazeInstalled(): Promise<boolean>;
}

@injectable()
export class WazeService implements IWazeService {
  /**
   * Opens Waze with navigation to the specified location
   * @param location The destination location
   * @returns Promise that resolves when the deep link is opened
   */
  async navigateTo(location: Location): Promise<boolean> {
    try {
      const { latitude, longitude } = location;
      const wazeUrl = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;

      // For web, we can just open a new window
      if (typeof window !== 'undefined') {
        window.open(wazeUrl, '_blank');
        return true;
      }

      // For React Native, this would use Linking API
      // This is a placeholder - in a real implementation, we would use
      // React Native's Linking API or a library like react-native-url-handler
      console.warn('WazeService: Native implementation not available');
      return false;
    } catch (error) {
      console.error('Error opening Waze:', error);
      return false;
    }
  }

  /**
   * Checks if Waze is installed on the device
   * @returns Promise that resolves to true if Waze is installed
   */
  async isWazeInstalled(): Promise<boolean> {
    try {
      // For web, we can't reliably check if Waze is installed
      if (typeof window !== 'undefined') {
        return true; // Always return true for web
      }

      // For React Native, this would use Linking.canOpenURL
      // This is a placeholder - in a real implementation, we would use
      // React Native's Linking API to check if the app can handle waze:// URLs
      console.warn('WazeService: Native implementation not available');
      return false;
    } catch (error) {
      console.error('Error checking if Waze is installed:', error);
      return false;
    }
  }
}
