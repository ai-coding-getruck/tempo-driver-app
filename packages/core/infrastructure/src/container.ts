import { Container } from "inversify";
import { StorageService } from "./storageService";
import { WazeService, IWazeService, IGeolocationService, GeolocationService, ApiClient, RouteService } from "@core/services";
import { useEffect, useState } from "react";

// Service identifiers
export const ROUTE_SERVICE = "RouteService";
export const STORAGE_SERVICE = "StorageService";
export const API_CLIENT = "ApiClient";
export const GEOLOCATION_SERVICE = "GeolocationService";
export const WAZE_SERVICE = "WazeService";

const container = new Container();

export function initializeContainer(
  clientId: string,
  register?: (container: Container) => void,
): void {
  // Register services
  container
    .bind<StorageService>(STORAGE_SERVICE)
    .to(StorageService)
    .inSingletonScope();
  container
    .bind<RouteService>(ROUTE_SERVICE)
    .to(RouteService)
    .inSingletonScope();
  container.bind<ApiClient>(API_CLIENT).to(ApiClient).inSingletonScope();
  container
    .bind<IGeolocationService>(GEOLOCATION_SERVICE)
    .to(GeolocationService)
    .inSingletonScope();
  container.bind<IWazeService>(WAZE_SERVICE).to(WazeService).inSingletonScope();

  // Initialize client ID
  const storageService = container.get<StorageService>(STORAGE_SERVICE);
  storageService.setClientId(clientId);

  // Allow additional registrations
  register?.(container);
}

export function useInject<T>(serviceIdentifier: string): T {
  const [service, setService] = useState<T | null>(null);

  useEffect(() => {
    try {
      const resolvedService = container.get<T>(serviceIdentifier);
      setService(resolvedService);
    } catch (error) {
      console.error(`Error injecting service ${serviceIdentifier}:`, error);
    }
  }, [serviceIdentifier]);

  if (!service) {
    throw new Error(`Service ${serviceIdentifier} not available`);
  }

  return service;
}

// For backward compatibility
export const createContainer = (clientId: string) => {
  initializeContainer(clientId);
  return container;
};
