import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTareas } from '../context/TareasContext';
import { clientesDesdeTareas } from '../utils/vistasGroomer';
import {
  obtenerClientesConPerros,
  actualizarCliente,
  agregarPerro,
  actualizarPerro,
} from '../services/clientesFirestoreService';

export default function DetalleClientePerroScreen({ route }) {
  const { clienteId, clienteInicial } = route.params || {};
  const { tareas } = useTareas();

  const [clienteDoc, setClienteDoc] = useState(clienteInicial || null);
  const [cargando, setCargando] = useState(!clienteInicial);
  const [guardando, setGuardando] = useState(false);

  // Modal editar cliente
  const [modalCliente, setModalCliente] = useState(false);
  const [cliNombre, setCliNombre] = useState('');
  const [cliTelefono, setCliTelefono] = useState('');
  const [cliCorreo, setCliCorreo] = useState('');

  // Modal crear / editar perro
  const [modalPerro, setModalPerro] = useState(false);
  const [perroEditandoId, setPerroEditandoId] = useState(null);
  const [perroNombre, setPerroNombre] = useState('');
  const [perroRaza, setPerroRaza] = useState('');
  const [perroSexo, setPerroSexo] = useState('');
  const [perroFechaNac, setPerroFechaNac] = useState('');
  const [perroNotas, setPerroNotas] = useState('');

  const cargarDetalle = useCallback(async () => {
    if (!clienteId) {
      setCargando(false);
      return;
    }
    setCargando(true);
    try {
      const lista = await obtenerClientesConPerros();
      const encontrado = lista.find((c) => c.id === clienteId);
      if (encontrado) {
        setClienteDoc(encontrado);
      }
    } catch (err) {
      console.error('Error al cargar detalle del cliente:', err);
    } finally {
      setCargando(false);
    }
  }, [clienteId]);

  useEffect(() => {
    cargarDetalle();
  }, [cargarDetalle]);

  const clienteRespaldo = useMemo(() => {
    const derivados = clientesDesdeTareas(tareas);
    return derivados.find((c) => c.id === clienteId) || null;
  }, [tareas, clienteId]);

  const cliente = clienteDoc || clienteRespaldo;

  const abrirModalEditarCliente = () => {
    if (!cliente) return;
    setCliNombre(cliente.nombre || '');
    setCliTelefono(cliente.telefono || '');
    setCliCorreo(cliente.correo || '');
    setModalCliente(true);
  };

  const handleGuardarCliente = async () => {
    if (!cliNombre.trim()) {
      Alert.alert('Campo obligatorio', 'El nombre del cliente no puede estar vacío.');
      return;
    }
    setGuardando(true);
    try {
      await actualizarCliente(cliente.id, {
        nombre: cliNombre.trim(),
        telefono: cliTelefono.trim(),
        correo: cliCorreo.trim(),
      });
      setModalCliente(false);
      await cargarDetalle();
      Alert.alert('Éxito', 'Datos del cliente actualizados.');
    } catch (err) {
      Alert.alert('Error', err?.message || 'No se pudo actualizar el cliente.');
    } finally {
      setGuardando(false);
    }
  };

  const abrirModalNuevoPerro = () => {
    setPerroEditandoId(null);
    setPerroNombre('');
    setPerroRaza('');
    setPerroSexo('');
    setPerroFechaNac('');
    setPerroNotas('');
    setModalPerro(true);
  };

  const abrirModalEditarPerro = (perro) => {
    setPerroEditandoId(perro.id);
    setPerroNombre(perro.nombre || '');
    setPerroRaza(perro.raza || '');
    setPerroSexo(perro.sexo || '');
    setPerroFechaNac(perro.fechaNacimiento || '');
    setPerroNotas(perro.notas || perro.observaciones || '');
    setModalPerro(true);
  };

  const handleGuardarPerro = async () => {
    if (!perroNombre.trim()) {
      Alert.alert('Campo obligatorio', 'Ingresa el nombre del perro.');
      return;
    }
    if (!cliente?.id) {
      Alert.alert('Error', 'No se encontró el cliente asociado.');
      return;
    }

    setGuardando(true);
    try {
      if (perroEditandoId) {
        await actualizarPerro(perroEditandoId, {
          clienteId: cliente.id,
          nombre: perroNombre.trim(),
          raza: perroRaza.trim(),
          sexo: perroSexo.trim(),
          fechaNacimiento: perroFechaNac.trim(),
          notas: perroNotas.trim(),
        });
      } else {
        await agregarPerro({
          clienteId: cliente.id,
          nombre: perroNombre.trim(),
          raza: perroRaza.trim(),
          sexo: perroSexo.trim(),
          fechaNacimiento: perroFechaNac.trim(),
          notas: perroNotas.trim(),
        });
      }
      setModalPerro(false);
      await cargarDetalle();
      Alert.alert(
        'Éxito',
        perroEditandoId ? 'Mascota actualizada.' : 'Mascota registrada y vinculada al cliente.',
      );
    } catch (err) {
      Alert.alert('Error', err?.message || 'No se pudo guardar la mascota.');
    } finally {
      setGuardando(false);
    }
  };

  if (cargando && !cliente) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator color="#39AFA5" />
        </View>
      </SafeAreaView>
    );
  }

  if (!cliente) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.textoSecundario}>No se encontró información del cliente.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Información del Cliente */}
        <View style={styles.seccion}>
          <View style={styles.filaTitulo}>
            <Text style={styles.tituloSeccion}>Información del Cliente</Text>
            <TouchableOpacity style={styles.btnSecundario} onPress={abrirModalEditarCliente}>
              <Text style={styles.btnSecundarioTexto}>Editar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardInfo}>
            <Text style={styles.nombreCliente}>{cliente.nombre}</Text>
            <Text style={styles.label}>
              📞 Teléfono: <Text style={styles.valor}>{cliente.telefono || 'Sin teléfono'}</Text>
            </Text>
            <Text style={styles.label}>
              ✉️ Correo: <Text style={styles.valor}>{cliente.correo || 'Sin correo'}</Text>
            </Text>
          </View>
        </View>

        {/* Expediente de Mascotas */}
        <View style={styles.seccion}>
          <View style={styles.filaTitulo}>
            <Text style={styles.tituloSeccion}>Expediente de Mascotas</Text>
            <TouchableOpacity style={styles.btnPrimario} onPress={abrirModalNuevoPerro}>
              <Text style={styles.btnPrimarioTexto}>+ Perro</Text>
            </TouchableOpacity>
          </View>

          {cliente.perros && cliente.perros.length > 0 ? (
            cliente.perros.map((perro, index) => (
              <View key={perro.id || index} style={styles.cardPerro}>
                <View style={styles.headerPerro}>
                  <Text style={styles.nombrePerro}>🐶 {perro.nombre || 'Mascota'}</Text>
                  <View style={styles.accionesPerro}>
                    {perro.raza ? <Text style={styles.badgeRaza}>{perro.raza}</Text> : null}
                    {perro.id ? (
                      <TouchableOpacity
                        style={styles.btnEditarMini}
                        onPress={() => abrirModalEditarPerro(perro)}
                      >
                        <Text style={styles.btnEditarMiniTexto}>Editar</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>

                {perro.sexo ? (
                  <Text style={styles.label}>
                    Sexo: <Text style={styles.valor}>{perro.sexo}</Text>
                  </Text>
                ) : null}

                {perro.fechaNacimiento ? (
                  <Text style={styles.label}>
                    Nacimiento: <Text style={styles.valor}>{perro.fechaNacimiento}</Text>
                  </Text>
                ) : null}

                {perro.edad ? (
                  <Text style={styles.label}>
                    Edad: <Text style={styles.valor}>{perro.edad}</Text>
                  </Text>
                ) : null}

                <View style={styles.contenedorNotas}>
                  <Text style={styles.tituloNotas}>Notas / Grooming:</Text>
                  <Text style={styles.textoNotas}>
                    {perro.notas || perro.observaciones || 'Sin observaciones registradas.'}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.textoSecundario}>
              No hay mascotas registradas para este cliente. Usa "+ Perro" para agregar una.
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Modal Editar Cliente */}
      <Modal
        visible={modalCliente}
        animationType="slide"
        transparent
        onRequestClose={() => setModalCliente(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Editar Cliente</Text>

            <Text style={styles.inputLabel}>Nombre *</Text>
            <TextInput
              style={styles.input}
              value={cliNombre}
              onChangeText={setCliNombre}
            />

            <Text style={styles.inputLabel}>Teléfono</Text>
            <TextInput
              style={styles.input}
              keyboardType="phone-pad"
              value={cliTelefono}
              onChangeText={setCliTelefono}
            />

            <Text style={styles.inputLabel}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              value={cliCorreo}
              onChangeText={setCliCorreo}
            />

            <View style={styles.modalAcciones}>
              <TouchableOpacity
                style={styles.btnCancelar}
                onPress={() => setModalCliente(false)}
                disabled={guardando}
              >
                <Text style={styles.btnCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnGuardar}
                onPress={handleGuardarCliente}
                disabled={guardando}
              >
                <Text style={styles.btnGuardarTexto}>
                  {guardando ? 'Guardando...' : 'Guardar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Crear / Editar Perro */}
      <Modal
        visible={modalPerro}
        animationType="slide"
        transparent
        onRequestClose={() => setModalPerro(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>
              {perroEditandoId ? 'Editar Mascota' : 'Nueva Mascota'}
            </Text>

            <Text style={styles.inputLabel}>Nombre *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Rocky"
              value={perroNombre}
              onChangeText={setPerroNombre}
            />

            <Text style={styles.inputLabel}>Raza</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. French Poodle"
              value={perroRaza}
              onChangeText={setPerroRaza}
            />

            <Text style={styles.inputLabel}>Sexo</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Macho / Hembra"
              value={perroSexo}
              onChangeText={setPerroSexo}
            />

            <Text style={styles.inputLabel}>Fecha de nacimiento</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. 2023-05-10"
              value={perroFechaNac}
              onChangeText={setPerroFechaNac}
            />

            <Text style={styles.inputLabel}>Notas / Grooming</Text>
            <TextInput
              style={[styles.input, styles.inputMultilinea]}
              placeholder="Alergias, temperamento, preferencias de corte..."
              multiline
              value={perroNotas}
              onChangeText={setPerroNotas}
            />

            <View style={styles.modalAcciones}>
              <TouchableOpacity
                style={styles.btnCancelar}
                onPress={() => setModalPerro(false)}
                disabled={guardando}
              >
                <Text style={styles.btnCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnGuardar}
                onPress={handleGuardarPerro}
                disabled={guardando}
              >
                <Text style={styles.btnGuardarTexto}>
                  {guardando ? 'Guardando...' : 'Guardar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scroll: {
    padding: 16,
  },
  seccion: {
    marginBottom: 20,
  },
  filaTitulo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tituloSeccion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  btnPrimario: {
    backgroundColor: '#39AFA5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnPrimarioTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  btnSecundario: {
    backgroundColor: '#EBF5FB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnSecundarioTexto: {
    color: '#2980B9',
    fontWeight: '600',
    fontSize: 13,
  },
  cardInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  nombreCliente: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34495E',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 4,
  },
  valor: {
    color: '#2C3E50',
    fontWeight: '500',
  },
  cardPerro: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#39AFA5',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerPerro: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  accionesPerro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nombrePerro: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  badgeRaza: {
    backgroundColor: '#EBF5FB',
    color: '#2980B9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: '600',
  },
  btnEditarMini: {
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  btnEditarMiniTexto: {
    fontSize: 12,
    color: '#2C3E50',
    fontWeight: '600',
  },
  contenedorNotas: {
    marginTop: 10,
    backgroundColor: '#F4F6F6',
    padding: 10,
    borderRadius: 6,
  },
  tituloNotas: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7F8C8D',
    marginBottom: 2,
  },
  textoNotas: {
    fontSize: 14,
    color: '#34495E',
  },
  textoSecundario: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
  },
  modalTitulo: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D5DBDB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: '#2C3E50',
    backgroundColor: '#FAFBFD',
  },
  inputMultilinea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  modalAcciones: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 18,
  },
  btnCancelar: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#ECF0F1',
  },
  btnCancelarTexto: {
    color: '#34495E',
    fontWeight: '600',
  },
  btnGuardar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#39AFA5',
  },
  btnGuardarTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});