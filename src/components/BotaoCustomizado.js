import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function BotaoCustomizado({ titulo, onPress, tipo = 'primary', desabilitado = false }) {
  const obterCorFundo = () => {
    if (desabilitado) return '#BDC3C7';
    switch (tipo) {
      case 'success': return '#2ECC71';
      case 'warning': return '#E67E22';
      case 'danger': return '#E74C3C';
      default: return '#2980B9';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.botao, { backgroundColor: obterCorFundo() }]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={desabilitado}
    >
      <Text style={styles.textoBotao}>{titulo}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    paddingVertical: 13, paddingHorizontal: 16, borderRadius: 26,
    alignItems: 'center', marginVertical: 6, width: '100%',
  },
  textoBotao: { color: '#FFFFFF', fontSize: 15, fontWeight: '600', letterSpacing: 0.3 },
});
