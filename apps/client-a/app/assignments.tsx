import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useRouteStore } from "../../../packages/core/hooks";
import { TaskItem } from "../../../packages/shared/components";
import { formatDateTime } from "../../../packages/shared/utils/dateUtils";

export default function AssignmentsScreen() {
  const router = useRouter();
  const { assignments, selectAssignment, selectTask } = useRouteStore();

  const handleTaskPress = (assignmentId: string, taskId: string) => {
    selectAssignment(assignmentId);
    selectTask(taskId);
    router.push(`/task/${taskId}`);
  };

  if (!assignments.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No assignments found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={assignments}
        keyExtractor={(item) => item.id}
        renderItem={({ item: assignment }) => (
          <View style={styles.assignmentContainer}>
            <View style={styles.assignmentHeader}>
              <Text style={styles.assignmentTitle}>{assignment.title}</Text>
              <Text style={styles.assignmentTime}>
                {formatDateTime(assignment.scheduledTime)}
              </Text>
            </View>
            <Text style={styles.assignmentDescription}>
              {assignment.description}
            </Text>

            <Text style={styles.tasksTitle}>Tasks:</Text>
            {assignment.tasks.map((task) => (
              <TaskItem
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                status={task.status}
                onPress={(taskId) => handleTaskPress(assignment.id, taskId)}
              />
            ))}
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  listContent: {
    padding: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 24,
    fontSize: 16,
    color: "#6c757d",
  },
  assignmentContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  assignmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  assignmentTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  assignmentTime: {
    fontSize: 12,
    color: "#6c757d",
  },
  assignmentDescription: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 16,
  },
  tasksTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
});
