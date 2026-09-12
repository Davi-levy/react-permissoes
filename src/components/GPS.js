import React from 'react';
import { View, Text } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

//precisao do gps 
export function classificarPrecisao(precisaoMetros) {
  if (precisaoMetros == null || Number.isNaN(precisaoMetros)) {
    return { cor: '#9E9E9E', rotulo: 'Sem sinal de GPS' };
  }
  if (precisaoMetros < 10) {
    return { cor: '#2ECC71', rotulo: `Alta precisão (±${precisaoMetros.toFixed(1)}m)` };
  }
  if (precisaoMetros <= 30) {
    return { cor: '#F1C40F', rotulo: `Média precisão (±${precisaoMetros.toFixed(1)}m)` };
  }
  return { cor: '#E74C3C', rotulo: `Baixa precisão (±${precisaoMetros.toFixed(1)}m)` };
}

export default function IndicadorPrecisaoGPS({ precisaoMetros }) {
  const { cor, rotulo } = classificarPrecisao(precisaoMetros);
  return (
    <View style={globalStyles.indicadorGpsLinha}>
      <View style={[globalStyles.indicadorGpsBolinha, { backgroundColor: cor }]} />
      <Text style={globalStyles.indicadorGpsTexto}>{rotulo}</Text>
    </View>
  );
}
