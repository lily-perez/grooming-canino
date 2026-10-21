import React, { useMemo, useState } from 'react';
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
} from 'react-native';

import PrimaryButton from '../components/PrimaryButton';
import { useTareas } from '../context/TareasContext';
import { clientesDesdeTareas } from '../utils/vistasGroomer';

export default function ClientesScreen({ navigation }) {
  const { tareas, cargando, error, recargar } = useTareas();
  const [busqueda, setBusqueda] = useState('');
  const clientes = useMemo(() => clientesDesdeTareas(tareas), [tareas]);
  const consulta = busqueda.trim().toLowerCase();

  const clientesFiltrados = clientes.filter((c) => {
    const nombre = (c.nombre || '').toLowerCase();
    const telefono = c.telefono || '';
    return nombre.includes(consulta) || telefono.includes(busqueda.trim());
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Gestión de Clientes</Text>
        <TextInput
          style={styles.buscador}
          placeholder="Buscar por nombre o teléfono..."
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
          <PrimaryButton title="Reintentar" onPress={recargar} />
        </View>
      ) : (
        <FlatList
          data={clientesFiltrados}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          refreshControl={
            <RefreshControl refreshing={cargando && tareas.length > 0} onRefresh={recargar} />
          }
          ListEmptyComponent={
            <Text style={styles.textoSecundario}>
              No hay clientes relacionados con tus tareas.
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('DetalleClientePerro', { clienteId: item.id })}
            >
              <View>
                <Text style={styles.nombreCliente}>{item.nombre}</Text>
                <Text style={styles.textoSecundario}>
                  Teléfono: {item.telefono || 'Sin teléfono'}
                </Text>
                <Text style={styles.textoSecundario}>
                  Mascotas relacionadas: {item.perros?.length ?? 0}
                </Text>
              </View>
              <Text style={styles.flecha}>›</Text>
            </TouchableOpacity>
          )}
        />
      )}
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
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
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
  },
});