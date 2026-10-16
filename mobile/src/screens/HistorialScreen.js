import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Alert, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function HistorialScreen({ route, navigation }) {
  const { perro } = route.params || { perro: 'Mascota' };

  const [pelaje, setPelaje] = useState('');
  const [comportamiento, setComportamiento] = useState('');
  const [ojos, setOjos] = useState('');
  const [oidos, setOidos] = useState('');
  const [dientes, setDientes] = useState('');
  const [unas, setUnas] = useState('');
  const [notas, setNotas] = useState('');
  
  // estado para guardar la URI de la imagen seleccionada
  const [imagenUri, setImagenUri] = useState(null);

  // Función para abrir la galería
  const seleccionarImagen = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImagenUri(result.assets[0].uri);
    }
  };

  const handleGuardar = () => {
    Alert.alert(
      "Registro Exitoso", 
      `Se ha guardado el historial de ${perro} con su fotografía.`,
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Registro de Atención</Text>
      <Text style={styles.subtitle}>Evaluación para {perro}</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Pelaje</Text>
        <TextInput style={styles.input} value={pelaje} onChangeText={setPelaje} placeholder="Ej. Desenredado, brillante..." />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Comportamiento</Text>
        <TextInput style={styles.input} value={comportamiento} onChangeText={setComportamiento} placeholder="Ej. Tranquilo, nervioso..." />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Revisión Física</Text>
        <TextInput style={styles.input} value={ojos} onChangeText={setOjos} placeholder="Estado de los ojos..." />
        <TextInput style={styles.input} value={oidos} onChangeText={setOidos} placeholder="Estado de los oídos..." />
        <TextInput style={styles.input} value={dientes} onChangeText={setDientes} placeholder="Estado de los dientes..." />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Uñas</Text>
        <TextInput style={styles.input} value={unas} onChangeText={setUnas} placeholder="Ej. Cortas, limadas..." />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Notas adicionales</Text>
        <TextInput style={[styles.input, styles.textArea]} value={notas} onChangeText={setNotas} placeholder="Observaciones generales..." multiline={true} numberOfLines={4} />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Fotografía del Servicio</Text>
        <TouchableOpacity style={styles.imageButton} onPress={seleccionarImagen}>
          <Text style={styles.imageButtonText}>
            {imagenUri ? 'Cambiar Fotografía' : 'Seleccionar Fotografía'}
          </Text>
        </TouchableOpacity>
        
        {imagenUri && (
          <Image source={{ uri: imagenUri }} style={styles.imagePreview} />
        )}
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton title="Guardar Registro" onPress={handleGuardar} />
      </View>
      <View style={{height: 40}} /> 
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  title: { fontSize: 24, fontWeight: '700', color: colors.primary, marginBottom: spacing.xs },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: spacing.xl },
  formGroup: { marginBottom: spacing.md },
  label: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.xs },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, padding: spacing.md, fontSize: 15, marginBottom: spacing.sm, color: colors.textPrimary },
  textArea: { height: 100, textAlignVertical: 'top' },
  buttonContainer: { marginTop: spacing.md, marginBottom: spacing.xl },
  
  imageButton: {
    backgroundColor: '#E0F2F1', 
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    marginBottom: spacing.sm,
  },
  imageButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 15,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: spacing.sm,
    resizeMode: 'cover',
  }
});