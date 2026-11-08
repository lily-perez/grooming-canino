import { afirmarConfiguracionFirebase, auth } from '../config/firebase';
import { signInWithEmailAndPassword, signOut } from '../config/sdkAuth';
import { ejecutarInicioCorreo } from '../domain/acceso.mjs';

export async function iniciarSesionCorreo(correo, contrasena) {
  return ejecutarInicioCorreo({
    correo,
    contrasena,
    motivoConfig: null,
    signIn: (correoNormalizado, clave) => {
      afirmarConfiguracionFirebase();
      return signInWithEmailAndPassword(auth, correoNormalizado, clave).then(
        (credencial) => credencial.user,
      );
    },
  });
}

export async function cerrarSesionFirebase() {
  await signOut(auth);

  try {
    const modulo = await import('@react-native-google-signin/google-signin');

    if (typeof modulo.GoogleSignin?.signOut === 'function') {
      await modulo.GoogleSignin.signOut();
    }
  } catch {
    // Expo Go no incluye el módulo nativo. La sesión de Firebase ya se cerró.
  }
}
