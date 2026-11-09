import React, { useMemo } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView 
} from 'react-native';
import { useTareas } from '../context/TareasContext';
import { clientesDesdeTareas } from '../utils/vistasGroomer';

export default function DetalleClientePerroScreen({ route }) {
  const { clienteId } = route.params || {};
  const { tareas } = useTareas();

  const clientes = useMemo(() => clientesDesdeTareas(tareas), [tareas]);
  const cliente = clientes.find((c) => c.id === clienteId);

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
          <Text style={styles.tituloSeccion}>Información del Cliente</Text>
          <View style={styles.cardInfo}>
            <Text style={styles.nombreCliente}>{cliente.nombre}</Text>
            <Text style={styles.label}>
              📞 Teléfono: <Text style={styles.valor}>{cliente.telefono || 'Sin teléfono'}</Text>
            </Text>
          </View>
        </View>

        {/* Expediente de Mascotas */}
        <View style={styles.seccion}>
          <Text style={styles.tituloSeccion}>Expediente de Mascotas</Text>
          
          {cliente.perros && cliente.perros.length > 0 ? (
            cliente.perros.map((perro, index) => (
              <View key={perro.id || index} style={styles.cardPerro}>
                <View style={styles.headerPerro}>
                  <Text style={styles.nombrePerro}>🐶 {perro.nombre || 'Mascota'}</Text>
                  {perro.raza ? <Text style={styles.badgeRaza}>{perro.raza}</Text> : null}
                </View>
                
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
            <Text style={styles.textoSecundario}>No hay mascotas registradas para este cliente.</Text>
          )}
        </View>

      </ScrollView>
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
  tituloSeccion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
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
});