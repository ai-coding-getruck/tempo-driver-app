import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return "#cccccc";
    switch (variant) {
      case "primary":
        return "#007bff";
      case "secondary":
        return "#6c757d";
      case "outline":
        return "transparent";
      default:
        return "#007bff";
    }
  };

  const getBorderColor = () => {
    if (disabled) return "#cccccc";
    switch (variant) {
      case "outline":
        return "#007bff";
      default:
        return "transparent";
    }
  };

  const getTextColor = () => {
    if (disabled) return "#666666";
    switch (variant) {
      case "outline":
        return "#007bff";
      default:
        return "#ffffff";
    }
  };

  const getPadding = () => {
    switch (size) {
      case "small":
        return { paddingVertical: 6, paddingHorizontal: 12 };
      case "medium":
        return { paddingVertical: 10, paddingHorizontal: 16 };
      case "large":
        return { paddingVertical: 14, paddingHorizontal: 20 };
      default:
        return { paddingVertical: 10, paddingHorizontal: 16 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case "small":
        return 12;
      case "medium":
        return 14;
      case "large":
        return 16;
      default:
        return 14;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          ...getPadding(),
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: getTextColor(),
              fontSize: getFontSize(),
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  text: {
    fontWeight: "600",
  },
});
