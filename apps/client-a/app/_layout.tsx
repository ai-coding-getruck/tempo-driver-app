import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Container } from 'inversify';
import { createContainer } from '@core/infrastructure';

// Create a global container for dependency injection
let container: Container;

export default function RootLayout() {
  useEffect(() => {
    // Initialize the container with the client ID
    container = createContainer('client-a');
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Route Overview' }} />
      <Stack.Screen name="assignments" options={{ title: 'Assignments' }} />
      <Stack.Screen name="task/[id]" options={{ title: 'Task Details' }} />
    </Stack>
  );
}

// Export the container for use in other components
export function getContainer(): Container {
  return container;
}
