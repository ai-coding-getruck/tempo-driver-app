import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  ClientAssignment,
  AssignmentItemType,
  FormInputField,
} from "@core/services";
import { ImagePickerDialog, FormField } from "@shared/components";
import { useForm } from "react-hook-form";

// Mock data - in a real app, this would come from a service or API
const mockAssignments: Record<string, ClientAssignment> = {
  "1": {
    id: "1",
    name: "Delivery to Main Office",
    type: "Delivery",
    address: "123 Main St, New York, NY",
    latitude: 40.7128,
    longitude: -74.006,
    contactName: "John Smith",
    contactPhone: "555-123-4567",
    phone: "555-123-4567",
    notes: "Leave packages at the front desk. Signature required.",
    userId: "user1",
    companyId: "company1",
    index: 0,
    plannedArrivalTime: "10:30 AM",
    items: [
      {
        id: "item1",
        type: AssignmentItemType.ManualReport,
        index: 0,
        status: "success",
        isOptional: false,
        isHidden: false,
        isCertificate: false,
        assignmentId: "1",
        companyId: "company1",
        form: [],
      },
      {
        id: "item2",
        type: AssignmentItemType.OCR,
        index: 1,
        status: "initial",
        isOptional: false,
        isHidden: false,
        isCertificate: true,
        assignmentId: "1",
        companyId: "company1",
        form: [
          {
            key: "certificateNumber",
            label: "Certificate Number",
            type: "TEXT",
            editable: true,
            required: true,
          },
          {
            key: "expirationDate",
            label: "Expiration Date",
            type: "DATE",
            editable: true,
            required: true,
          },
        ],
      },
    ],
  },
  "2": {
    id: "2",
    name: "Equipment Installation",
    type: "Installation",
    address: "456 Park Ave, Boston, MA",
    latitude: 42.3601,
    longitude: -71.0589,
    contactName: "Emily Johnson",
    contactPhone: "555-987-6543",
    phone: "555-987-6543",
    notes: "Access code: 4321. Installation in server room.",
    userId: "user1",
    companyId: "company1",
    index: 1,
    plannedArrivalTime: "2:00 PM",
    items: [
      {
        id: "item3",
        type: AssignmentItemType.OCR,
        index: 0,
        status: "initial",
        isOptional: false,
        isHidden: false,
        isCertificate: true,
        assignmentId: "2",
        companyId: "company1",
        form: [
          {
            key: "equipmentId",
            label: "Equipment ID",
            type: "TEXT",
            editable: true,
            required: true,
          },
          {
            key: "installationDate",
            label: "Installation Date",
            type: "DATE",
            editable: true,
            required: true,
          },
          {
            key: "technicianId",
            label: "Technician ID",
            type: "TEXT",
            editable: true,
            required: true,
          },
        ],
      },
    ],
  },
  "3": {
    id: "3",
    name: "Maintenance Check",
    type: "Maintenance",
    address: "789 Broadway, Chicago, IL",
    latitude: 41.8781,
    longitude: -87.6298,
    contactName: "Michael Brown",
    contactPhone: "555-456-7890",
    phone: "555-456-7890",
    notes: "Quarterly maintenance check. Ask for Michael at reception.",
    userId: "user1",
    companyId: "company1",
    index: 2,
    plannedArrivalTime: "9:00 AM",
    items: [
      {
        id: "item4",
        type: AssignmentItemType.ManualReport,
        index: 0,
        status: "initial",
        isOptional: false,
        isHidden: false,
        isCertificate: false,
        assignmentId: "3",
        companyId: "company1",
        form: [
          {
            key: "maintenanceType",
            label: "Maintenance Type",
            type: "TEXT",
            editable: true,
            required: true,
          },
          {
            key: "completionStatus",
            label: "Completion Status",
            type: "TEXT",
            editable: true,
            required: true,
          },
        ],
      },
    ],
  },
};

// In a real app, this would be a service that fetches data from an API
const assignmentService = {
  getAssignment: async (id: string): Promise<ClientAssignment | null> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockAssignments[id] || null;
  },
  submitAssignment: async (
    assignmentId: string,
    itemId: string,
    formData: any,
  ): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("Submitting form data:", { assignmentId, itemId, formData });
    return true;
  },
};

export default function AssignmentDetailsScreen() {
  const { assignmentId } = useLocalSearchParams<{ assignmentId: string }>();
  const [assignment, setAssignment] = useState<ClientAssignment | null>(null);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [imagePickerVisible, setImagePickerVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formFields, setFormFields] = useState<FormInputField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    // Fetch assignment data
    const fetchAssignment = async () => {
      if (!assignmentId) return;

      setIsLoading(true);
      try {
        const data = await assignmentService.getAssignment(assignmentId);
        if (data) {
          setAssignment(data);

          // If there's only one item, expand it by default
          if (data.items.length === 1) {
            setExpandedItemId(data.items[0].id);
          }
        } else {
          Alert.alert("Error", "Assignment not found");
        }
      } catch (error) {
        console.error("Error fetching assignment:", error);
        Alert.alert("Error", "Failed to load assignment details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignment();
  }, [assignmentId]);

  const handleToggleExpand = (itemId: string) => {
    setExpandedItemId(expandedItemId === itemId ? null : itemId);
  };

  const handleOpenImagePicker = (itemId: string) => {
    setSelectedItemId(itemId);
    setImagePickerVisible(true);
  };

  const handleImageSelected = async (uri: string) => {
    setSelectedImage(uri);
    setIsProcessing(true);

    try {
      // In a real app, this would be an API call to an OCR service
      // For now, we'll simulate a delay and use the mock form fields
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (assignment && selectedItemId) {
        const item = assignment.items.find(
          (item) => item.id === selectedItemId,
        );
        if (item && item.form) {
          setFormFields(item.form);
        }
      }
    } catch (error) {
      console.error("Error processing image:", error);
      // Fallback to predefined form
      if (assignment && selectedItemId) {
        const item = assignment.items.find(
          (item) => item.id === selectedItemId,
        );
        if (item && item.form) {
          setFormFields(item.form);
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const onSubmit = async (data: any) => {
    if (!assignment || !selectedItemId) return;

    setIsSubmitting(true);
    try {
      const success = await assignmentService.submitAssignment(
        assignment.id,
        selectedItemId,
        data,
      );

      if (success) {
        Alert.alert("Success", "Form submitted successfully!");

        // Update the local assignment data to reflect the completed item
        setAssignment((prev) => {
          if (!prev) return null;

          const updatedItems = prev.items.map((item) => {
            if (item.id === selectedItemId) {
              return { ...item, status: "success" };
            }
            return item;
          });

          return { ...prev, items: updatedItems };
        });

        // Reset form and selected image
        reset();
        setSelectedImage(null);
        setSelectedItemId(null);
        setExpandedItemId(null);
      } else {
        Alert.alert("Error", "Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Alert.alert("Error", "An error occurred while submitting the form");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !assignment) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading assignment details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImagePickerDialog
        visible={imagePickerVisible}
        onClose={() => setImagePickerVisible(false)}
        onImageSelected={handleImageSelected}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{assignment.name}</Text>
          <Text style={styles.address}>{assignment.address}</Text>
          {assignment.plannedArrivalTime && (
            <Text style={styles.time}>
              ETA: {assignment.plannedArrivalTime}
            </Text>
          )}
          {assignment.notes && (
            <Text style={styles.notes}>Notes: {assignment.notes}</Text>
          )}
        </View>

        <View style={styles.itemsContainer}>
          <Text style={styles.sectionTitle}>Assignment Items</Text>

          {assignment.items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <TouchableOpacity
                style={styles.itemHeader}
                onPress={() => handleToggleExpand(item.id)}
              >
                <Text style={styles.itemTitle}>
                  {item.type === AssignmentItemType.OCR
                    ? "Certificate Scan"
                    : item.type === AssignmentItemType.ManualReport
                      ? "Manual Report"
                      : item.type}
                </Text>
                <Text
                  style={[
                    styles.itemStatus,
                    item.status === "success" || item.status === "Success"
                      ? styles.successStatus
                      : styles.pendingStatus,
                  ]}
                >
                  {item.status === "success" || item.status === "Success"
                    ? "Completed"
                    : "Pending"}
                </Text>
              </TouchableOpacity>

              {expandedItemId === item.id && (
                <View style={styles.itemContent}>
                  {item.status === "success" || item.status === "Success" ? (
                    <View style={styles.successMessage}>
                      <Text style={styles.successText}>
                        This item has been successfully completed.
                      </Text>
                    </View>
                  ) : item.type === AssignmentItemType.OCR ? (
                    <View style={styles.ocrContainer}>
                      {!selectedImage || selectedItemId !== item.id ? (
                        <>
                          <Text style={styles.ocrText}>
                            Scan certificate to automatically fill form fields
                          </Text>
                          <TouchableOpacity
                            style={styles.ocrButton}
                            onPress={() => handleOpenImagePicker(item.id)}
                          >
                            <Text style={styles.buttonText}>
                              Scan Certificate
                            </Text>
                          </TouchableOpacity>
                        </>
                      ) : isProcessing ? (
                        <View style={styles.processingContainer}>
                          <ActivityIndicator size="large" color="#007bff" />
                          <Text style={styles.processingText}>
                            Processing certificate...
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.formContainer}>
                          <Image
                            source={{ uri: selectedImage }}
                            style={styles.certificateImage}
                            resizeMode="contain"
                          />

                          {formFields.map((field) => (
                            <FormField
                              key={field.key}
                              control={control}
                              name={field.key}
                              label={field.label}
                              type={
                                field.type === "DATE"
                                  ? "text"
                                  : field.type === "NUMBER"
                                    ? "number"
                                    : field.type === "CHECKBOX"
                                      ? "checkbox"
                                      : "text"
                              }
                              required={field.required}
                              placeholder={`Enter ${field.label.toLowerCase()}`}
                            />
                          ))}

                          <TouchableOpacity
                            style={[
                              styles.submitButton,
                              isSubmitting && styles.disabledButton,
                            ]}
                            onPress={handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <ActivityIndicator size="small" color="#fff" />
                            ) : (
                              <Text style={styles.buttonText}>Submit</Text>
                            )}
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  ) : (
                    <Text style={styles.notImplementedText}>
                      This item type is not implemented yet.
                    </Text>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  disabledButton: {
    backgroundColor: "#6c757d",
    opacity: 0.7,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
  notes: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  itemsContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  itemCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  itemStatus: {
    fontSize: 14,
    fontWeight: "500",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  successStatus: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  pendingStatus: {
    backgroundColor: "#fff3cd",
    color: "#856404",
  },
  itemContent: {
    padding: 16,
  },
  successMessage: {
    backgroundColor: "#d4edda",
    padding: 12,
    borderRadius: 4,
  },
  successText: {
    color: "#155724",
    textAlign: "center",
  },
  ocrContainer: {
    alignItems: "center",
    width: "100%",
  },
  ocrText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    textAlign: "center",
  },
  ocrButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
    textAlign: "center",
  },
  notImplementedText: {
    color: "#6c757d",
    fontStyle: "italic",
    textAlign: "center",
  },
  processingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  processingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  formContainer: {
    width: "100%",
    marginTop: 16,
  },
  certificateImage: {
    width: "100%",
    height: 200,
    marginBottom: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  submitButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    marginTop: 16,
  },
});
