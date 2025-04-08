import { injectable } from "inversify";

@injectable()
export class StorageService {
  private clientId: string = "";

  constructor() {
    // In a real app, this would be set from environment variables
    this.clientId = "default-client";
  }

  setClientId(clientId: string) {
    this.clientId = clientId;
  }

  getClientId(): string {
    return this.clientId;
  }

  async getData(key: string): Promise<any> {
    try {
      // In a real app, this would use AsyncStorage or another storage mechanism
      // For now, we'll use mock data
      return this.getMockData(key);
    } catch (error) {
      console.error(`Error getting data for key ${key}:`, error);
      return null;
    }
  }

  async setData(key: string, value: any): Promise<void> {
    try {
      // In a real app, this would use AsyncStorage or another storage mechanism
      console.log(`Setting data for key ${key}:`, value);
      // Mock implementation - doesn't actually persist
    } catch (error) {
      console.error(`Error setting data for key ${key}:`, error);
    }
  }

  private getMockData(key: string): any {
    const mockData: Record<string, any> = {
      currentRoute: {
        id: "route-1",
        driverId: "driver-1",
        date: new Date().toISOString(),
        status: "in-progress",
        assignments: ["assignment-1", "assignment-2", "assignment-3"],
      },
      assignments: [
        {
          id: "assignment-1",
          clientId: "client-a",
          title: "Delivery to Main St",
          description: "Package delivery to 123 Main St",
          location: { latitude: 37.7749, longitude: -122.4194 },
          status: "pending",
          scheduledTime: new Date().toISOString(),
          tasks: [
            {
              id: "task-1-1",
              title: "Verify address",
              description: "Confirm the delivery address is correct",
              status: "pending",
              requiredPhotos: 0,
              formFields: [
                {
                  id: "address",
                  label: "Address",
                  type: "text",
                  required: true,
                },
              ],
            },
            {
              id: "task-1-2",
              title: "Deliver package",
              description: "Leave package at the door",
              status: "pending",
              requiredPhotos: 1,
              formFields: [
                {
                  id: "recipient",
                  label: "Recipient Name",
                  type: "text",
                  required: false,
                },
                {
                  id: "photo",
                  label: "Delivery Photo",
                  type: "photo",
                  required: true,
                },
              ],
            },
          ],
        },
        {
          id: "assignment-2",
          clientId: "client-a",
          title: "Pickup from Oak Ave",
          description: "Package pickup from 456 Oak Ave",
          location: { latitude: 37.7833, longitude: -122.4167 },
          status: "pending",
          scheduledTime: new Date(Date.now() + 3600000).toISOString(),
          tasks: [
            {
              id: "task-2-1",
              title: "Confirm pickup",
              description: "Confirm the pickup details with the sender",
              status: "pending",
              requiredPhotos: 0,
              formFields: [
                {
                  id: "sender",
                  label: "Sender Name",
                  type: "text",
                  required: true,
                },
                {
                  id: "items",
                  label: "Number of Items",
                  type: "number",
                  required: true,
                },
              ],
            },
            {
              id: "task-2-2",
              title: "Secure package",
              description: "Ensure package is properly secured for transport",
              status: "pending",
              requiredPhotos: 1,
              formFields: [
                {
                  id: "secured",
                  label: "Package Secured",
                  type: "checkbox",
                  required: true,
                },
                {
                  id: "photo",
                  label: "Package Photo",
                  type: "photo",
                  required: true,
                },
              ],
            },
          ],
        },
        {
          id: "assignment-3",
          clientId: "client-b",
          title: "Service at Pine St",
          description: "Equipment service at 789 Pine St",
          location: { latitude: 37.79, longitude: -122.41 },
          status: "pending",
          scheduledTime: new Date(Date.now() + 7200000).toISOString(),
          tasks: [
            {
              id: "task-3-1",
              title: "Inspect equipment",
              description: "Check equipment for any visible damage",
              status: "pending",
              requiredPhotos: 2,
              formFields: [
                {
                  id: "equipment_id",
                  label: "Equipment ID",
                  type: "text",
                  required: true,
                },
                {
                  id: "condition",
                  label: "Condition",
                  type: "select",
                  required: true,
                  options: ["Good", "Fair", "Poor"],
                },
                {
                  id: "photo1",
                  label: "Equipment Photo 1",
                  type: "photo",
                  required: true,
                },
                {
                  id: "photo2",
                  label: "Equipment Photo 2",
                  type: "photo",
                  required: true,
                },
              ],
            },
            {
              id: "task-3-2",
              title: "Perform service",
              description: "Complete the scheduled maintenance",
              status: "pending",
              requiredPhotos: 1,
              formFields: [
                {
                  id: "service_type",
                  label: "Service Performed",
                  type: "select",
                  required: true,
                  options: ["Maintenance", "Repair", "Replacement"],
                },
                {
                  id: "notes",
                  label: "Service Notes",
                  type: "text",
                  required: true,
                },
                {
                  id: "photo",
                  label: "After Service Photo",
                  type: "photo",
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    };

    return mockData[key];
  }
}
