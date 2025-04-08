import { injectable } from "inversify";
import { Assignment, Route, Task } from "./types";
import { STORAGE_SERVICE, StorageService, useInject } from "@core/infrastructure";

@injectable()
export class RouteService {
  private storageService: StorageService = useInject<StorageService>(STORAGE_SERVICE);

  async getCurrentRoute(): Promise<Route | null> {
    try {
      // In a real app, this would call an API
      // For now, we'll use mock data from storage
      return await this.storageService.getData("currentRoute");
    } catch (error) {
      console.error("Error fetching current route:", error);
      return null;
    }
  }

  async getAssignments(routeId: string): Promise<Assignment[]> {
    try {
      // In a real app, this would call an API
      const assignments =
        (await this.storageService.getData("assignments")) || [];
      return assignments.filter(
        (assignment: Assignment) =>
          assignment.clientId === this.storageService.getClientId(),
      );
    } catch (error) {
      console.error("Error fetching assignments:", error);
      return [];
    }
  }

  async completeTask(
    assignmentId: string,
    taskId: string,
    formData: any,
  ): Promise<boolean> {
    try {
      // In a real app, this would call an API
      // For now, we'll update local storage
      const assignments =
        (await this.storageService.getData("assignments")) || [];

      const updatedAssignments = assignments.map((assignment: Assignment) => {
        if (assignment.id !== assignmentId) return assignment;

        const updatedTasks = assignment.tasks.map((task: Task) => {
          if (task.id !== taskId) return task;
          return { ...task, status: "completed", formData };
        });

        // Check if all tasks are completed
        const allTasksCompleted = updatedTasks.every(
          (task: Task) => task.status === "completed",
        );

        return {
          ...assignment,
          tasks: updatedTasks,
          status: allTasksCompleted ? "completed" : "in-progress",
        };
      });

      await this.storageService.setData("assignments", updatedAssignments);
      return true;
    } catch (error) {
      console.error("Error completing task:", error);
      return false;
    }
  }

  async uploadTaskPhoto(
    assignmentId: string,
    taskId: string,
    photoUri: string,
  ): Promise<string | null> {
    try {
      // In a real app, this would upload to a server and return the URL
      // For now, we'll just return the local URI
      return photoUri;
    } catch (error) {
      console.error("Error uploading photo:", error);
      return null;
    }
  }
}
