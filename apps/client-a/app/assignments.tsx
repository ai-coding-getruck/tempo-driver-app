import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { AssignmentItem } from '@org/shared/components';
import { ClientAssignment, AssignmentItemType } from '@org/core/services/types';
import { getContainer } from './_layout';
import { WAZE_SERVICE } from '@org/core/infrastructure/container';
import { IWazeService } from '@org/core/services/waze.service';

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
];

export default function AssignmentsScreen() {
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
  listContent: {
    padding: 16,
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
