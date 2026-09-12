import React from 'react';
import { Text } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

export const ALTURA_ITEM_CONTATO = 56;

function ItemContatoBase({ item, selecionado, onSelecionar }) {
  const telefone = item.phoneNumbers?.[0]?.number ?? 'Sem telefone';
  return (
    <Text
      style={[
        globalStyles.itemListaContato,
        selecionado && { borderColor: '#27AE60', borderWidth: 2 },
      ]}
      onPress={() => onSelecionar(item)}
    >
      <Text style={globalStyles.nomeContatoText}>{item.name || 'Sem nome'}</Text>
      {'\n'}
      <Text style={globalStyles.telefoneContatoText}>{telefone}</Text>
    </Text>
  );
}

//react.memo 
export default React.memo(
  ItemContatoBase,
  (prev, next) => prev.item.id === next.item.id && prev.selecionado === next.selecionado
);
