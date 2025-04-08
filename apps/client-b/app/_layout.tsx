import { Stack } from "expo-router";
import { useEffect } from "react";
import { Container } from "inversify";
import { createContainer } from "../../../packages/core/infrastructure/container";

// Create a global container for dependency injection
let container: Container;

export default function RootLayout() {
  useEffect(() => {
    // Initialize the container with the client ID
    container = createContainer("client-b");
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Service Routes" }} />
      <Stack.Screen name="assignments" options={{ title: "Service Tasks" }} />
      <Stack.Screen name="task/[id]" options={{ title: "Service Details" }} />
    </Stack>
  );
}

// Export the container for use in other components
export function getContainer(): Container {
  return container;
}
