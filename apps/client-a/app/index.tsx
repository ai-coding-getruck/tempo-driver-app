import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { getContainer } from './_layout';
import { RouteService, Route, Assignment } from '@core/services';
import { useRouteStore } from '@core/hooks';
import { Button, Card } from '../../../packages/shared/components/src';
import {
  formatDate,
  getRelativeTime,
} from '../../../packages/shared/utils/dateUtils';

export default function HomeScreen() {
  const router = useRouter();
  const { currentRoute, assignments, setCurrentRoute, setAssignments } =
    useRouteStore();

  useEffect(() => {
    // Mock route data instead of fetching from service
    const mockRoute: Route = {
      id: 'route-123',
      driverId: 'driver-456',
      date: new Date().toISOString(),
      status: 'in-progress',
      assignments: ['assign-1', 'assign-2', 'assign-3', 'assign-4'],
    };

    // Mock assignment data
    const mockAssignments: Assignment[] = [
      {
        id: 'assign-1',
        clientId: 'client-789',
        title: 'Delivery to Main Office',
        description: 'Deliver package to the main office reception desk',
        location: { latitude: 37.7749, longitude: -122.4194 },
        status: 'completed',
        tasks: [
          {
            id: 'task-1',
            title: 'Signature Collection',
            description: 'Get signature from recipient',
            status: 'completed',
            requiredPhotos: 0,
            formFields: [],
          },
        ],
        scheduledTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      },
      {
        id: 'assign-2',
        clientId: 'client-789',
        title: 'Pickup from Warehouse',
        description: 'Collect packages from warehouse loading dock',
        location: { latitude: 37.7833, longitude: -122.4167 },
        status: 'in-progress',
        tasks: [
          {
            id: 'task-2',
            title: 'Package Verification',
            description: 'Verify package contents match manifest',
            status: 'in-progress',
            requiredPhotos: 1,
            formFields: [],
          },
        ],
        scheduledTime: new Date().toISOString(), // now
      },
      {
        id: 'assign-3',
        clientId: 'client-789',
        title: 'Equipment Installation',
        description: 'Install new router and configure network',
        location: { latitude: 37.7694, longitude: -122.4862 },
        status: 'pending',
        tasks: [
          {
            id: 'task-3',
            title: 'Equipment Setup',
            description: 'Install and test new equipment',
            status: 'pending',
            requiredPhotos: 2,
            formFields: [],
          },
        ],
        scheduledTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      },
      {
        id: 'assign-4',
        clientId: 'client-789',
        title: 'Maintenance Check',
        description: 'Perform routine maintenance on HVAC system',
        location: { latitude: 37.7835, longitude: -122.4256 },
        status: 'pending',
        tasks: [
          {
            id: 'task-4',
            title: 'System Inspection',
            description: 'Check all components and record readings',
            status: 'pending',
            requiredPhotos: 3,
            formFields: [],
          },
        ],
        scheduledTime: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
      },
    ];

    // Set the mock data in state
    setCurrentRoute(mockRoute);
    setAssignments(mockAssignments);
  }, []);

  const getCompletionStatus = () => {
    if (!assignments.length) return '0%';

    const completed = assignments.filter(
      (a) => a.status === 'completed',
    ).length;
    return `${Math.round((completed / assignments.length) * 100)}%`;
  };

  const navigateToAssignments = () => {
    router.push('/assignments');
  };

  if (!currentRoute) {
    return (
      <View style={styles.container}>
        <Text>Loading route information...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Route</Text>
        <Text style={styles.date}>{formatDate(currentRoute.date)}</Text>
      </View>

      <Card style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Assignments</Text>
            <Text style={styles.summaryValue}>{assignments.length}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Completion</Text>
            <Text style={styles.summaryValue}>{getCompletionStatus()}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Status</Text>
            <Text style={[styles.summaryValue, { color: '#17a2b8' }]}>
              {currentRoute.status.charAt(0).toUpperCase() +
                currentRoute.status.slice(1)}
            </Text>
          </View>
        </View>
      </Card>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Assignments</Text>
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
                      assignment.status === 'completed'
                        ? '#28a745'
                        : assignment.status === 'in-progress'
                          ? '#17a2b8'
                          : '#ffc107',
                  },
                ]}
              >
                <Text style={styles.statusText}>
                  {assignment.status === 'completed'
                    ? 'Completed'
                    : assignment.status === 'in-progress'
                      ? 'In Progress'
                      : 'Pending'}
                </Text>
              </View>
            </View>
          </Card>
        ))}
      </View>

      <Button
        title="View All Assignments"
        onPress={navigateToAssignments}
        style={styles.viewAllButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  date: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 4,
  },
  summaryCard: {
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  assignmentCard: {
    marginBottom: 12,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  assignmentDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 12,
  },
  assignmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assignmentTime: {
    fontSize: 12,
    color: '#6c757d',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  viewAllButton: {
    marginBottom: 24,
  },
});
