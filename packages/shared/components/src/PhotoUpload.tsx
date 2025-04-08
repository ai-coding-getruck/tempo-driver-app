import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";

interface PhotoUploadProps {
  onPhotoSelected: (uri: string) => void;
  photoUri?: string;
  label?: string;
  required?: boolean;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onPhotoSelected,
  photoUri,
  label = "Upload Photo",
  required = false,
}) => {
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    // In a real app, this would use expo-image-picker
    // For now, we'll just simulate the process
    setLoading(true);
    setTimeout(() => {
      // Simulate a successful photo selection
      const mockPhotoUri = "https://picsum.photos/400/300";
      onPhotoSelected(mockPhotoUri);
      setLoading(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}

      {photoUri ? (
        <View style={styles.photoContainer}>
          <Image source={{ uri: photoUri }} style={styles.photo} />
          <TouchableOpacity style={styles.changeButton} onPress={handlePress}>
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handlePress}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.uploadButtonText}>Take Photo</Text>
          )}
        </TouchableOpacity>
      )}
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
  photoContainer: {
    position: "relative",
  },
  photo: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  changeButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  changeButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  uploadButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
