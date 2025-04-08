import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { getContainer } from './_layout';
import { WAZE_SERVICE } from '@core/infrastructure';
import {
  IWazeService,
  ClientAssignment,
  AssignmentItemType,
} from '@core/services';
import { AssignmentItem } from '@shared/components';

// Mock data for assignments
const mockAssignments: ClientAssignment[] = [
  {
    id: '1',
    name: 'Delivery to Main Office',
    type: 'Delivery',
    address: '123 Main St, New York, NY',
    latitude: 40.7128,
    longitude: -74.006,
    contactName: 'John Smith',
    contactPhone: '555-123-4567',
    phone: '555-123-4567',
    notes: 'Leave packages at the front desk. Signature required.',
    userId: 'user1',
    companyId: 'company1',
    index: 0,
    plannedArrivalTime: '10:30 AM',
    items: [
      {
        id: 'item1',
        type: AssignmentItemType.ManualReport,
        index: 0,
        status: 'initial',
        isOptional: false,
        isHidden: false,
        isCertificate: false,
        assignmentId: '1',
        companyId: 'company1',
        form: [
          {
            key: 'deliveryConfirmation',
            label: 'Delivery Confirmation',
            type: 'TEXT',
            editable: true,
            required: true,
          },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Pickup from Warehouse',
    type: 'Pickup',
    address: '456 Warehouse Ave, Brooklyn, NY',
    latitude: 40.6782,
    longitude: -73.9442,
    dockingPoint: 'Dock B',
    notes: 'Pickup 3 pallets of merchandise. Check for damages before loading.',
    userId: 'user1',
    companyId: 'company1',
    index: 1,
    plannedArrivalTime: '1:15 PM',
    items: [
      {
        id: 'item2',
        type: AssignmentItemType.Photo,
        index: 0,
        status: 'initial',
        isOptional: false,
        isHidden: false,
        isCertificate: false,
        assignmentId: '2',
        companyId: 'company1',
        form: [],
      },
      {
        id: 'item3',
        type: AssignmentItemType.ManualReport,
        index: 1,
        status: 'initial',
        isOptional: false,
        isHidden: false,
        isCertificate: false,
        assignmentId: '2',
        companyId: 'company1',
        form: [
          {
            key: 'palletCount',
            label: 'Pallet Count',
            type: 'NUMBER',
            editable: true,
            required: true,
          },
          {
            key: 'damageReport',
            label: 'Damage Report',
            type: 'TEXT_AREA',
            editable: true,
            required: false,
          },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'Equipment Installation',
    type: 'Service',
    address: '789 Tech Blvd, Queens, NY',
    latitude: 40.7282,
    longitude: -73.7949,
    contactName: 'Sarah Johnson',
    contactPhone: '555-987-6543',
    phone: '555-987-6543',
    notes:
      'Install new router and configure network. Customer will provide access code.',
    userId: 'user1',
    companyId: 'company1',
    index: 2,
    plannedArrivalTime: '3:00 PM',
    items: [
      {
        id: 'item4',
        type: AssignmentItemType.Photo,
        index: 0,
        status: 'initial',
        isOptional: false,
        isHidden: false,
        isCertificate: false,
        assignmentId: '3',
        companyId: 'company1',
        form: [],
      },
      {
        id: 'item5',
        type: AssignmentItemType.ManualReport,
        index: 1,
        status: 'initial',
        isOptional: false,
        isHidden: false,
        isCertificate: false,
        assignmentId: '3',
        companyId: 'company1',
        form: [
          {
            key: 'installationComplete',
            label: 'Installation Complete',
            type: 'CHECKBOX',
            editable: true,
            required: true,
          },
          {
            key: 'networkSpeed',
            label: 'Network Speed (Mbps)',
            type: 'NUMBER',
            editable: true,
            required: true,
          },
          {
            key: 'additionalNotes',
            label: 'Additional Notes',
            type: 'TEXT_AREA',
            editable: true,
            required: false,
          },
        ],
      },
    ],
  },
  {
    id: '4',
    name: 'Maintenance Check',
    type: 'Maintenance',
    address: '321 Service Rd, Staten Island, NY',
    latitude: 40.5795,
    longitude: -74.1502,
    contactName: 'Mike Rodriguez',
    contactPhone: '555-456-7890',
    phone: '555-456-7890',
    notes: 'Quarterly HVAC maintenance. Check filters and coolant levels.',
    userId: 'user1',
    companyId: 'company1',
    index: 3,
    plannedArrivalTime: '4:45 PM',
    items: [
      {
        id: 'item6',
        type: AssignmentItemType.ManualReport,
        index: 0,
        status: 'initial',
        isOptional: false,
        isHidden: false,
        isCertificate: false,
        assignmentId: '4',
        companyId: 'company1',
        form: [
          {
            key: 'filterReplaced',
            label: 'Filter Replaced',
            type: 'CHECKBOX',
            editable: true,
            required: true,
          },
          {
            key: 'coolantLevel',
            label: 'Coolant Level',
            type: 'TEXT',
            editable: true,
            required: true,
          },
          {
            key: 'systemPerformance',
            label: 'System Performance Rating (1-10)',
            type: 'NUMBER',
            editable: true,
            required: true,
          },
        ],
      },
      {
        id: 'item7',
        type: AssignmentItemType.Photo,
        index: 1,
        status: 'initial',
        isOptional: false,
        isHidden: false,
        isCertificate: false,
        assignmentId: '4',
        companyId: 'company1',
        form: [],
      },
    ],
  },
];

export default function HomeScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [assignments] = useState<ClientAssignment[]>(mockAssignments);

  // Get the WazeService from the container
  let wazeService: IWazeService | undefined;
  try {
    const container = getContainer();
    wazeService = container.get<IWazeService>(WAZE_SERVICE);
  } catch (error) {
    console.error('Error getting WazeService:', error);
  }

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleConfirmAssignment = (assignment: ClientAssignment) => {
    console.log('Assignment confirmed:', assignment.id);
    // In a real app, this would update the assignment status
    // and potentially navigate to the next screen
  };

  if (!assignments.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No assignments found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Assignments</Text>
      </View>
      <FlatList
        data={assignments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AssignmentItem
            assignment={item}
            expanded={expandedId === item.id}
            onToggleExpand={() => handleToggleExpand(item.id)}
            onConfirm={handleConfirmAssignment}
            wazeService={wazeService}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
  },
});
