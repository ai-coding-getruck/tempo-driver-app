import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { useRouteStore } from '../../../../../packages/core/hooks';
import { Button, FormField } from '../../../../../packages/shared/components';
import { getContainer } from '../../_layout';
import { RouteService } from '../../../../../packages/core/services';

export default function TaskFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { selectedAssignment, selectedTask, completeTask } = useRouteStore();
  
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data: any) => {
    if (!selectedAssignment || !selectedTask) return;
    
    try {
      // Update local state
      completeTask(selectedTask.id, data);
      
      // Update remote state
      const container = getContainer();
      const routeService = container.get(RouteService);
      await routeService.completeTask(selectedAssignment.id, selectedTask.id, data);
      
      // Navigate back to task details
      router.back();
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error
    }
  };

  if (!selectedAssignment || !selectedTask) {
    return (
      <View style={styles.container}>
        <Text style={