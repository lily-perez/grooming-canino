import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView,
  Platform 
} from 'react-native';

// Datos de prueba (puedes conectarlos luego a tu API o backend)
const CLIENTES_INICIALES = [
  {
    id: '1',
    nombre: 'Ana Martínez',
    telefono: '7890-1234',
    email: 'ana.martinez@email.com',
    perros: [
      { id: 'p1', nombre: 'Max', raza: 'Golden Retriever', edad: '3 años', notas: 'Alérgico al champú con aroma a lavanda. Muy amigable.' },
      { id: 'p2', nombre: 'Luna', raza: 'Poodle', edad: '2 años', notas: 'Se pone nerviosa con el secador.' }
    ]
  },
  {
    id: '2',
    nombre: 'Carlos Ramírez',
    telefono: '7234-5678',
    email: 'carlos.r@email.com',
    perros: [
      { id: 'p3', nombre: 'Rocky', raza: 'Bulldog Inglés', edad: '4 años', notas: 'Cuidado con las arrugas al secar. Piel sensible.' }
    ]
  }
];

export default function ClientesScreen({ navigation }) {
  const [busqueda, setBusqueda] = useState('');
  const [clientes, setClientes] = useState(CLIENTES_INICIALES);

  const clientesFiltrados = clientes.filter(c => 
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.telefono.includes(busqueda)
  );

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

      <FlatList
        data={clientesFiltrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('DetalleClientePerro', { cliente: item })}
          >
            <View>
              <Text style={styles.nombreCliente}>{item.nombre}</Text>
              <Text style={styles.textoSecundario}>📞 {item.telefono}</Text>
              <Text style={styles.textoSecundario}>🐶 Mascotas registradas: {item.perros.length}</Text>
            </View>
            <Text style={styles.flecha}>›</Text>
          </TouchableOpacity>
        )}
      />
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
  }
});