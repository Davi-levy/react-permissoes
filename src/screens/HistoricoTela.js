import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { globalStyles } from '../styles/globalStyles';
import IndicadorPrecisaoGPS from '../components/GPS';
import { listarVisitas } from '../servicos/armazenamento';

// rf01
//Lê o AsyncStorage então funciona mesmo sem internet.
export default function HistoricoScreen() {
  const [visitas, setVisitas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setCarregando(true);
        setVisitas(await listarVisitas());
        setCarregando(false);
      })();
    }, [])
  );

  return (
    <View style={globalStyles.container}>
      <FlatList
        data={visitas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={globalStyles.itemHistorico}>
            <Image source={{ uri: item.fotoUri }} style={globalStyles.historicoMiniatura} />
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.historicoData}>
                {new Date(item.criadoEm).toLocaleString('pt-BR')}
              </Text>
              <Text style={globalStyles.nomeContatoText}>{item.produtor}</Text>
              <Text style={globalStyles.textoInformativo}>
                {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
              </Text>
              <IndicadorPrecisaoGPS precisaoMetros={item.precisaoMetros} />
            </View>
          </View>
        )}
        ListEmptyComponent={
          !carregando && (
            <Text style={[globalStyles.textoInformativo, { textAlign: 'center', marginTop: 30 }]}>
              Nenhuma visita registrada ainda. Os registros ficam salvos no dispositivo e
              aparecem aqui mesmo sem internet.
            </Text>
          )
        }
      />
    </View>
  );
}
