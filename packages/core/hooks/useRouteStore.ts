import { create } from "zustand";
import { Assignment, Route, Task } from "@core/services";

interface RouteState {
  currentRoute: Route | null;
  assignments: Assignment[];
  selectedAssignment: Assignment | null;
  selectedTask: Task | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentRoute: (route: Route) => void;
  setAssignments: (assignments: Assignment[]) => void;
  selectAssignment: (assignmentId: string) => void;
  selectTask: (taskId: string) => void;
  completeTask: (taskId: string, formData: any) => void;
  clearSelection: () => void;
}

export const useRouteStore = create<RouteState>((set, get) => ({
  currentRoute: null,
  assignments: [],
  selectedAssignment: null,
  selectedTask: null,
  isLoading: false,
  error: null,

  setCurrentRoute: (route) => set({ currentRoute: route }),

  setAssignments: (assignments) => set({ assignments }),

  selectAssignment: (assignmentId) => {
    const assignment =
      get().assignments.find((a) => a.id === assignmentId) || null;
    set({ selectedAssignment: assignment, selectedTask: null });
  },

  selectTask: (taskId) => {
    if (!get().selectedAssignment) return;

    const task =
      get().selectedAssignment.tasks.find((t) => t.id === taskId) || null;
    set({ selectedTask: task });
  },

  completeTask: (taskId, formData) => {
    const { assignments, selectedAssignment } = get();

    if (!selectedAssignment) return;

    // Update the task status
    const updatedAssignments = assignments.map((assignment) => {
      if (assignment.id !== selectedAssignment.id) return assignment;

      const updatedTasks = assignment.tasks.map((task) => {
        if (task.id !== taskId) return task;
        return { ...task, status: "completed", formData };
      });

      // Check if all tasks are completed
      const allTasksCompleted = updatedTasks.every(
        (task) => task.status === "completed",
      );

      return {
        ...assignment,
        tasks: updatedTasks,
        status: allTasksCompleted ? "completed" : "in-progress",
      };
    });

    set({ assignments: updatedAssignments });
  },

  clearSelection: () => set({ selectedAssignment: null, selectedTask: null }),
}));
