import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { HistorialProvider } from './src/context/HistorialContext';

export default function App() {
  return (
    <HistorialProvider>
      <StatusBar style="dark" />
      <AppNavigator />
    </HistorialProvider>
  );
}