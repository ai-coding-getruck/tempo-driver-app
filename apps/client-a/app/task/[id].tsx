import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRouteStore } from "../../../../packages/core/hooks";
import { Button, Card } from "../../../../packages/shared/components";

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { selectedAssignment, selectedTask } = useRouteStore();

  const handleStartTask = () => {
    if (selectedTask) {
      router.push(`/task/${selectedTask.id}/form`);
    }
  };

  if (!selectedAssignment || !selectedTask) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Task not found</Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          style={styles.backButton}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>{selectedTask.title}</Text>
        <Text style={styles.description}>{selectedTask.description}</Text>

        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Status:</Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  selectedTask.status === "completed"
                    ? "#28a745"
                    : selectedTask.status === "in-progress"
                      ? "#17a2b8"
                      : "#ffc107",
              },
            ]}
          >
            <Text style={styles.statusText}>
              {selectedTask.status === "completed"
                ? "Completed"
                : selectedTask.status === "in-progress"
                  ? "In Progress"
                  : "Pending"}
            </Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Assignment:</Text>
          <Text style={styles.infoValue}>{selectedAssignment.title}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Required Photos:</Text>
          <Text style={styles.infoValue}>{selectedTask.requiredPhotos}</Text>
        </View>

        <View style={styles.formFieldsContainer}>
          <Text style={styles.formFieldsTitle}>Required Information:</Text>
          {selectedTask.formFields.map((field) => (
            <View key={field.id} style={styles.formField}>
              <Text style={styles.formFieldLabel}>{field.label}</Text>
              <Text style={styles.formFieldType}>
                {field.type.charAt(0).toUpperCase() + field.type.slice(1)}
                {field.required && <Text style={styles.required}> *</Text>}
              </Text>
            </View>
          ))}
        </View>

        {selectedTask.status !== "completed" && (
          <Button
            title="Start Task"
            onPress={handleStartTask}
            style={styles.startButton}
          />
        )}

        {selectedTask.status === "completed" && selectedTask.formData && (
          <View style={styles.completedContainer}>
            <Text style={styles.completedTitle}>Submitted Information:</Text>
            {/* Display submitted form data here */}
            <Text style={styles.completedText}>Task has been completed.</Text>
          </View>
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#212529",
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
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
  infoContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
    width: 120,
  },
  infoValue: {
    fontSize: 16,
    flex: 1,
  },
  formFieldsContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  formFieldsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  formField: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  formFieldLabel: {
    fontSize: 16,
  },
  formFieldType: {
    fontSize: 14,
    color: "#6c757d",
  },
  required: {
    color: "#dc3545",
  },
  startButton: {
    marginTop: 16,
  },
  completedContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#e9ecef",
    borderRadius: 8,
  },
  completedTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  completedText: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    color: "#dc3545",
    textAlign: "center",
    marginBottom: 16,
  },
  backButton: {
    marginTop: 16,
  },
});
