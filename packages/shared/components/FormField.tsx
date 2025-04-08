import React from "react";
import { View, Text, TextInput, StyleSheet, Switch } from "react-native";
import { Controller, Control } from "react-hook-form";
import { PhotoUpload } from "./PhotoUpload";

interface FormFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  type: "text" | "number" | "select" | "checkbox" | "photo";
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  control,
  name,
  label,
  type,
  required = false,
  options = [],
  placeholder = "",
}) => {
  const renderField = (field: any) => {
    switch (type) {
      case "text":
        return (
          <TextInput
            style={styles.input}
            value={field.value}
            onChangeText={field.onChange}
            placeholder={placeholder}
          />
        );
      case "number":
        return (
          <TextInput
            style={styles.input}
            value={field.value ? field.value.toString() : ""}
            onChangeText={(text) => {
              const numValue = text.replace(/[^0-9]/g, "");
              field.onChange(numValue ? parseInt(numValue, 10) : "");
            }}
            keyboardType="numeric"
            placeholder={placeholder}
          />
        );
      case "checkbox":
        return (
          <Switch value={field.value || false} onValueChange={field.onChange} />
        );
      case "photo":
        return (
          <PhotoUpload
            photoUri={field.value}
            onPhotoSelected={field.onChange}
            required={required}
          />
        );
      case "select":
        // In a real app, this would be a proper dropdown
        // For now, we'll just use a text input as a placeholder
        return (
          <TextInput
            style={styles.input}
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Select an option"
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {type !== "photo" && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}

      <Controller
        control={control}
        name={name}
        rules={{ required }}
        render={({ field, fieldState }) => (
          <>
            {renderField(field)}
            {fieldState.error && (
              <Text style={styles.errorText}>
                {fieldState.error.message || "This field is required"}
              </Text>
            )}
          </>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  required: {
    color: "#dc3545",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  errorText: {
    color: "#dc3545",
    fontSize: 12,
    marginTop: 4,
  },
});
