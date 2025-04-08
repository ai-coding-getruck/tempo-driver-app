import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface TaskItemProps {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  onPress: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  id,
  title,
  description,
  status,
  onPress,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "#ffc107";
      case "in-progress":
        return "#17a2b8";
      case "completed":
        return "#28a745";
      default:
        return "#ffc107";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "pending":
        return "Pending";
      case "in-progress":
        return "In Progress";
      case "completed":
        return "Completed";
      default:
        return "Pending";
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(id)}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666666",
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
});
