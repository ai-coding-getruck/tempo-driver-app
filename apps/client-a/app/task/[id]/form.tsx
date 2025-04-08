import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { useRouteStore } from '@core/hooks';
import { Button, FormField } from '../../../../../packages/shared/components/src';
import { getContainer } from '../../_layout';
import { RouteService } from '@core/services';

export default function TaskFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { selectedAssignment, selectedTask, completeTask } = useRouteStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data: any) => {
    if (!selectedAssignment || !selectedTask) return;

    try {
      // Update local state
      completeTask(selectedTask.id, data);

      // Update remote state
      const container = getContainer();
      const routeService = container.get(RouteService);
      await routeService.completeTask(
        selectedAssignment.id,
        selectedTask.id,
        data,
      );

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
      <View style={styles.header}>
        <Text style={styles.title}>{selectedTask.title}</Text>
        <Text style={styles.subtitle}>{selectedAssignment.title}</Text>
      </View>

      <View style={styles.formContainer}>
        {selectedTask.formFields.map((field) => (
          <FormField
            key={field.id}
            control={control}
            name={field.id}
            label={field.label}
            type={field.type}
            required={field.required}
            options={field.options}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Cancel"
          onPress={() => router.back()}
          variant="outline"
          style={styles.cancelButton}
        />
        <Button
          title="Submit"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          style={styles.submitButton}
        />
      </View>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 18,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 16,
  },
  backButton: {
    marginTop: 16,
  },
});
