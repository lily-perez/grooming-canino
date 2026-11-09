import { TurboModuleRegistry } from 'react-native';

// get() devuelve null si el binario no incluye el módulo.
// getEnforcing() lanzaría el error de Expo Go.
export function googleNativoDisponible() {
  try {
    if (typeof TurboModuleRegistry?.get !== 'function') {
      return false;
    }

    return TurboModuleRegistry.get('RNGoogleSignin') != null;
  } catch {
    return false;
  }
}
