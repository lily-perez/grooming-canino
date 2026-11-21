import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Alert,
} from 'react-native';

import PrimaryButton from '../components/PrimaryButton';
import { useTareas } from '../context/TareasContext';
import { clientesDesdeTareas } from '../utils/vistasGroomer';
import {
  obtenerClientesConPerros,
  agregarCliente,
} from '../services/clientesFirestoreService';

export default function ClientesScreen({ navigation }) {
  const { tareas, cargando: cargandoTareas, error: errorTareas, recargar: recargarTareas } = useTareas();
  const [busqueda, setBusqueda] = useState('');
  const [clientesFirestore, setClientesFirestore] = useState([]);
  const [cargandoClientes, setCargandoClientes] = useState(true);
  const [errorFirestore, setErrorFirestore] = useState('');

  // Estado del modal para crear cliente
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [guardando, setGuardando] = useState(false);

  const cargarClientes = useCallback(async () => {
    setCargandoClientes(true);
    setErrorFirestore('');
    try {
      const lista = await obtenerClientesConPerros();
      setClientesFirestore(lista);
    } catch (err) {
      setErrorFirestore(err?.message || 'No se pudieron cargar los clientes desde Firestore.');
    } finally {
      setCargandoClientes(false);
    }
  }, []);

  useEffect(() => {
    cargarClientes();
  }, [cargarClientes]);

  // Refrescar al volver a la pantalla (por si se editó un cliente o se agregó un perro)
  useEffect(() => {
    const unsubscribe = navigation?.addListener?.('focus', () => {
      cargarClientes();
    });
    return unsubscribe;
  }, [navigation, cargarClientes]);

  const clientesRespaldo = useMemo(() => clientesDesdeTareas(tareas), [tareas]);

  // Prioriza los datos de Firestore; si aún no hay documentos en 'clientes', muestra los derivados de tareas
  const clientes = clientesFirestore.length > 0 ? clientesFirestore : clientesRespaldo;
  const cargando = cargandoClientes || (clientes.length === 0 && cargandoTareas);
  const error = clientes.length === 0 ? (errorFirestore || errorTareas) : '';

  const consulta = busqueda.trim().toLowerCase();

  const clientesFiltrados = clientes.filter((c) => {
    const nombreCliente = (c.nombre || '').toLowerCase();
    const telefonoCliente = c.telefono || '';
    const correoCliente = (c.correo || '').toLowerCase();
    return (
      nombreCliente.includes(consulta) ||
      telefonoCliente.includes(busqueda.trim()) ||
      correoCliente.includes(consulta)
    );
  });

  const handleRecargar = async () => {
    await Promise.all([cargarClientes(), recargarTareas?.()]);
  };

  const handleGuardarCliente = async () => {
    if (!nombre.trim()) {
      Alert.alert('Campo obligatorio', 'Ingresa el nombre del cliente.');
      return;
    }

    setGuardando(true);
    try {
      await agregarCliente({
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        correo: correo.trim(),
      });
      setNombre('');
      setTelefono('');
      setCorreo('');
      setModalVisible(false);
      await cargarClientes();
      Alert.alert('Éxito', 'Cliente creado correctamente.');
    } catch (err) {
      Alert.alert('Error', err?.message || 'No se pudo crear el cliente.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.titulo}>Gestión de Clientes</Text>
          <TouchableOpacity
            style={styles.btnNuevo}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.btnNuevoTexto}>+ Nuevo</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.buscador}
          placeholder="Buscar por nombre, teléfono o correo..."
          placeholderTextColor="#888"
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      {cargando && clientes.length === 0 ? (
        <ActivityIndicator color="#39AFA5" style={styles.estado} />
      ) : error ? (
        <View style={styles.estado}>
          <Text style={styles.textoSecundario}>{error}</Text>
          <PrimaryButton title="Reintentar" onPress={handleRecargar} />
        </View>
      ) : (
        <FlatList
          data={clientesFiltrados}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          refreshControl={
            <RefreshControl refreshing={cargando && clientes.length > 0} onRefresh={handleRecargar} />
          }
          ListEmptyComponent={
            <Text style={styles.textoSecundario}>
              No hay clientes registrados aún. Usa "+ Nuevo" para crear el primero.
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate('DetalleClientePerro', {
                  clienteId: item.id,
                  clienteInicial: item,
                })
              }
            >
              <View style={styles.cardInfo}>
                <Text style={styles.nombreCliente}>{item.nombre}</Text>
                <Text style={styles.textoSecundario}>
                  📞 Teléfono: {item.telefono || 'Sin teléfono'}
                </Text>
                {item.correo ? (
                  <Text style={styles.textoSecundario}>✉️ {item.correo}</Text>
                ) : null}
                <Text style={styles.textoSecundario}>
                  🐶 Mascotas relacionadas: {item.perros?.length ?? 0}
                </Text>
              </View>
              <Text style={styles.flecha}>›</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Modal Crear Cliente */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Nuevo Cliente</Text>

            <Text style={styles.inputLabel}>Nombre *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Ana María López"
              value={nombre}
              onChangeText={setNombre}
            />

            <Text style={styles.inputLabel}>Teléfono</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. 7000-0000"
              keyboardType="phone-pad"
              value={telefono}
              onChangeText={setTelefono}
            />

            <Text style={styles.inputLabel}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. ana@correo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={correo}
              onChangeText={setCorreo}
            />

            <View style={styles.modalAcciones}>
              <TouchableOpacity
                style={styles.btnCancelar}
                onPress={() => setModalVisible(false)}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  btnNuevo: {
    backgroundColor: '#39AFA5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnNuevoTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buscador: {
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  lista: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : Platform.OS === 'android' ? 0.2 : 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardInfo: {
    flex: 1,
    paddingRight: 8,
  },
  nombreCliente: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  textoSecundario: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 2,
  },
  flecha: {
    fontSize: 24,
    color: '#BDC3C7',
    fontWeight: 'bold',
  },
  estado: {
    padding: 16,
    alignItems: 'center',
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
    marginBottom: 14,
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
    paddingVertical: 9,
    fontSize: 15,
    color: '#2C3E50',
    backgroundColor: '#FAFBFD',
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