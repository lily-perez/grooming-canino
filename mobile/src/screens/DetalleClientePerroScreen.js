import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView 
} from 'react-native';

export default function DetalleClientePerroScreen({ route }) {
  const { cliente } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* Información del Cliente */}
        <View style={styles.seccion}>
          <Text style={styles.tituloSeccion}>Información del Cliente</Text>
          <View style={styles.cardInfo}>
            <Text style={styles.nombreCliente}>{cliente.nombre}</Text>
            <Text style={styles.label}>Teléfono: <Text style={styles.valor}>{cliente.telefono}</Text></Text>
            <Text style={styles.label}>Correo: <Text style={styles.valor}>{cliente.email}</Text></Text>
          </View>
        </View>

        {/* Expediente de las Mascotas */}
        <View style={styles.seccion}>
          <Text style={styles.tituloSeccion}>Expediente de Mascotas (Perros)</Text>
          
          {cliente.perros.map((perro) => (
            <View key={perro.id} style={styles.cardPerro}>
              <View style={styles.headerPerro}>
                <Text style={styles.nombrePerro}>🐶 {perro.nombre}</Text>
                <Text style={styles.badgeRaza}>{perro.raza}</Text>
              </View>
              
              <Text style={styles.label}>Edad: <Text style={styles.valor}>{perro.edad}</Text></Text>
              
              <View style={styles.contenedorNotas}>
                <Text style={styles.tituloNotas}>Notas médicas / Grooming:</Text>
                <Text style={styles.textoNotas}>{perro.notas}</Text>
              </View>
            </View>
          ))}
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
    borderLeftColor: '#3498DB',
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
    backgroundColor: '#F9EBEA',
    padding: 10,
    borderRadius: 6,
  },
  tituloNotas: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#C0392B',
    marginBottom: 2,
  },
  textoNotas: {
    fontSize: 14,
    color: '#922B21',
  },
});