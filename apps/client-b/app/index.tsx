import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { getContainer } from "./_layout";
import { RouteService } from "../../../packages/core/services";
import { useRouteStore } from "../../../packages/core/hooks";
import { Button, Card } from "../../../packages/shared/components";
import {
  formatDate,
  getRelativeTime,
} from "../../../packages/shared/utils/dateUtils";

export default function HomeScreen() {
  const router = useRouter();
  const { currentRoute, assignments, setCurrentRoute, setAssignments } =
    useRouteStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        const container = getContainer();
        const routeService = container.get(RouteService);

        const route = await routeService.getCurrentRoute();
        if (route) {
          setCurrentRoute(route);

          const assignmentList = await routeService.getAssignments(route.id);
          setAssignments(assignmentList);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  const getCompletionStatus = () => {
    if (!assignments.length) return "0%";

    const completed = assignments.filter(
      (a) => a.status === "completed",
    ).length;
    return `${Math.round((completed / assignments.length) * 100)}%`;
  };

  const navigateToAssignments = () => {
    router.push("/assignments");
  };

  if (!currentRoute) {
    return (
      <View style={styles.container}>
        <Text>Loading service information...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Service Route</Text>
        <Text style={styles.date}>{formatDate(currentRoute.date)}</Text>
      </View>

      <Card style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Service Tasks</Text>
            <Text style={styles.summaryValue}>{assignments.length}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Completion</Text>
            <Text style={styles.summaryValue}>{getCompletionStatus()}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Status</Text>
            <Text style={[styles.summaryValue, { color: "#6610f2" }]}>
              {currentRoute.status.charAt(0).toUpperCase() +
                currentRoute.status.slice(1)}
            </Text>
          </View>
        </View>
      </Card>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Service Tasks</Text>
        {assignments.slice(0, 3).map((assignment) => (
          <Card key={assignment.id} style={styles.assignmentCard}>
            <Text style={styles.assignmentTitle}>{assignment.title}</Text>
            <Text style={styles.assignmentDescription}>
              {assignment.description}
            </Text>
            <View style={styles.assignmentFooter}>
              <Text style={styles.assignmentTime}>
                {getRelativeTime(assignment.scheduledTime)}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      assignment.status === "completed"
                        ? "#198754"
                        : assignment.status === "in-progress"
                          ? "#6610f2"
                          : "#fd7e14",
                  },
                ]}
              >
                <Text style={styles.statusText}>
                  {assignment.status === "completed"
                    ? "Completed"
                    : assignment.status === "in-progress"
                      ? "In Progress"
                      : "Pending"}
                </Text>
              </View>
            </View>
          </Card>
        ))}
      </View>

      <Button
        title="View All Service Tasks"
        onPress={navigateToAssignments}
        style={styles.viewAllButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#212529",
  },
  date: {
    fontSize: 16,
    color: "#6c757d",
    marginTop: 4,
  },
  summaryCard: {
    marginBottom: 24,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#212529",
  },
  assignmentCard: {
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#6610f2",
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#212529",
  },
  assignmentDescription: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 12,
  },
  assignmentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  assignmentTime: {
    fontSize: 12,
    color: "#6c757d",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
  },
  viewAllButton: {
    marginBottom: 24,
    backgroundColor: "#6610f2",
  },
});
