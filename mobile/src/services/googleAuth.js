import { afirmarConfiguracionFirebase, auth, googleWebClientId } from '../config/firebase';
import { GoogleAuthProvider, signInWithCredential } from '../config/sdkAuth';
import { decisionGoogle, mensajeDeErrorAuth } from '../domain/acceso.mjs';
import { googleNativoDisponible } from './googleNativo';

const MENSAJE_EXPO_GO =
  'Google Sign-In no está disponible en Expo Go. Usa correo y contraseña. En un development build, cuando el módulo nativo esté instalado, este botón iniciará sesión con Google.';

const MENSAJE_DEVELOPMENT_BUILD =
  'Google Sign-In requiere un development build con @react-native-google-signin/google-signin. No funciona dentro de Expo Go.';

export async function iniciarSesionConGoogle() {
  if (!googleNativoDisponible()) {
    throw new Error(MENSAJE_EXPO_GO);
  }

  afirmarConfiguracionFirebase();

  if (!googleWebClientId) {
    throw new Error(
      `${MENSAJE_DEVELOPMENT_BUILD} También falta EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID (Firebase Console, Authentication, proveedor Google, ID de cliente web).`,
    );
  }

  let GoogleSignin;
  let statusCodes;

  try {
    const modulo = await import('@react-native-google-signin/google-signin');
    GoogleSignin = modulo.GoogleSignin;
    statusCodes = modulo.statusCodes;
  } catch {
    throw new Error(MENSAJE_DEVELOPMENT_BUILD);
  }

  GoogleSignin.configure({
    webClientId: googleWebClientId,
    offlineAccess: false,
  });

  try {
    if (typeof GoogleSignin.hasPlayServices === 'function') {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    }

    const resultado = await GoogleSignin.signIn();
    const decision = decisionGoogle(resultado);

    if (decision.accion === 'cancelado' || decision.accion === 'error') {
      throw new Error(decision.mensaje);
    }

    const credencial = GoogleAuthProvider.credential(decision.idToken);
    const sesion = await signInWithCredential(auth, credencial);

    if (!sesion?.user?.uid) {
      throw new Error('Google no produjo un usuario de Firebase.');
    }

    return sesion.user;
  } catch (error) {
    if (
      error?.code === statusCodes?.SIGN_IN_CANCELLED ||
      error?.code === 'SIGN_IN_CANCELLED' ||
      error?.code === '-5'
    ) {
      throw new Error('Inicio con Google cancelado.');
    }

    if (error?.code && String(error.code).startsWith('auth/')) {
      throw new Error(mensajeDeErrorAuth(error.code));
    }

    if (error instanceof Error && error.message) {
      throw error;
    }

    throw new Error(MENSAJE_DEVELOPMENT_BUILD);
  }
}
