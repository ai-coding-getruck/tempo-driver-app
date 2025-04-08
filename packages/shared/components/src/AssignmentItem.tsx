import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  IWazeService,
  ClientAssignment,
  AssignmentItemType,
} from '@core/services';

interface AssignmentItemProps {
  assignment: ClientAssignment;
  expanded: boolean;
  onToggleExpand: () => void;
  onConfirm: (assignment: ClientAssignment) => void;
  wazeService?: IWazeService;
}

export const AssignmentItem: React.FC<AssignmentItemProps> = ({
  assignment,
  expanded,
  onToggleExpand,
  onConfirm,
  wazeService,
}) => {
  const router = useRouter();
  const handleWazeNavigation = async () => {
    if (!wazeService) return;

    if (assignment.latitude && assignment.longitude) {
      await wazeService.navigateTo({
        latitude: assignment.latitude,
        longitude: assignment.longitude,
      });
    } else if (assignment.address) {
      // Fallback to address-based navigation
      const encodedAddress = encodeURIComponent(assignment.address);
      const wazeUrl = `https://waze.com/ul?q=${encodedAddress}&navigate=yes`;

      if (Platform.OS === 'web') {
        window.open(wazeUrl, '_blank');
      } else {
        Linking.openURL(wazeUrl);
      }
    }
  };

  const handlePhoneCall = () => {
    if (!assignment.phone) return;

    const phoneUrl = `tel:${assignment.phone}`;
    if (Platform.OS === 'web') {
      window.open(phoneUrl, '_blank');
    } else {
      Linking.openURL(phoneUrl);
    }
  };

  const handleConfirm = () => {
    // Check if there's at least one ManualReport item with initial status
    const hasManualReport = assignment.items.some(
      (item) =>
        item.type === AssignmentItemType.ManualReport &&
        item.status === 'initial',
    );

    if (hasManualReport) {
      // In a real app, this would make an API call
      console.log('Submitting assignment:', assignment.id);
    }

    // Navigate to the assignment details screen
    router.push(`/assignments/${assignment.id}`);

    // Also call the original onConfirm callback
    onConfirm(assignment);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onToggleExpand} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.name}>{assignment.name}</Text>
          <Text style={styles.address}>{assignment.address}</Text>
          {assignment.plannedArrivalTime && (
            <Text style={styles.time}>
              ETA: {assignment.plannedArrivalTime}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expandedContent}>
          {assignment.notes && (
            <Text style={styles.notes}>Notes: {assignment.notes}</Text>
          )}

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.wazeButton]}
              onPress={handleWazeNavigation}
            >
              <Text style={styles.buttonText}>Navigate</Text>
            </TouchableOpacity>

            {assignment.phone && (
              <TouchableOpacity
                style={[styles.actionButton, styles.phoneButton]}
                onPress={handlePhoneCall}
              >
                <Text style={styles.buttonText}>Call</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.actionButton, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
  },
  headerContent: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  expandedContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  notes: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft: 8,
  },
  wazeButton: {
    backgroundColor: '#33ccff',
  },
  phoneButton: {
    backgroundColor: '#4CAF50',
  },
  confirmButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
});
