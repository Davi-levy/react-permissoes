import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, Image } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

import { globalStyles } from '../styles/globalStyles';
import BotaoCustomizado from '../components/BotaoCustomizado';
import IndicadorPrecisaoGPS from '../components/GPS';
import { salvarVisita } from '../servicos/armazenamento';

export default function RegistroVisitaScreen({ navigation }) {
  const [localizacao, setLocalizacao] = useState(null);
  const [buscandoLocalizacao, setBuscandoLocalizacao] = useState(false);
  const [imagemEvidencia, setImagemEvidencia] = useState(null);
  const [contatoSelecionado, setContatoSelecionado] = useState(null);
  const [salvando, setSalvando] = useState(false);

  //captura da localização 
  const capturarCoordenadasGPS = async () => {
    setBuscandoLocalizacao(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erro de Permissão', 'O acesso ao GPS é vital para a validação legal da auditoria.');
        return;
      }

      //degradação lenta se o GPS estiver desligado
      const servicoAtivo = await Location.hasServicesEnabledAsync();
      if (!servicoAtivo) {
        Alert.alert('GPS desligado', 'Ative o serviço de localização do dispositivo para continuar.');
        return;
      }

      const posicao = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });
      setLocalizacao(posicao.coords);
    } catch (erro) {
      //o app não pode quebrar se o sensor de GPS falhar
      Alert.alert('Erro de GPS', 'Não foi possível obter a localização agora.');
    } finally {
      setBuscandoLocalizacao(false);
    }
  };

  //Captura de imagem com tratamento avançado de permissão negada
  const capturarFotoEvidencia = async () => {
    try {
      const resultadoPermissao = await ImagePicker.requestCameraPermissionsAsync();
      if (resultadoPermissao.status !== 'granted') {
        if (resultadoPermissao.canAskAgain === false) {
          // usuário marcou "Não perguntar novamente" vai orientar a abrir as configurações manualmente
          Alert.alert(
            'Permissão de câmera bloqueada',
            'Você negou o acesso à câmera permanentemente. Abra as Configurações do sistema > Apps > (nome do app) > Permissões e habilite a Câmera manualmente.'
          );
        } else {
          Alert.alert('Erro de Permissão', 'Acesso à câmera é obrigatório para registro fotodocumental.');
        }
        return;
      }

      const resultado = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        allowsEditing: false,
      });
      if (!resultado.canceled) {
        setImagemEvidencia(resultado.assets[0].uri);
      }
    } catch (erro) {
      Alert.alert('Câmera indisponível', 'Não foi possível acessar a câmera neste dispositivo.');
    }
  };

  // Abre a tela dedicada de contatos
  const abrirBuscaDeProdutores = () => {
    navigation.navigate('Contatos', {
      contatoAtual: contatoSelecionado,
      aoSelecionar: (contato) => setContatoSelecionado(contato),
    });
  };

  //RF01
  const finalizarRelatorioAuditoria = async () => {
    if (!localizacao || !imagemEvidencia || !contatoSelecionado) {
      Alert.alert(
        'Inconformidade de Dados',
        'Todos os critérios de auditoria (GPS, Evidência Visual e Produtor Vinculado) devem ser preenchidos.'
      );
      return;
    }
    setSalvando(true);
    try {
      await salvarVisita({
        latitude: localizacao.latitude,
        longitude: localizacao.longitude,
        precisaoMetros: localizacao.accuracy,
        fotoUri: imagemEvidencia,
        produtor: contatoSelecionado.name,
      });
      Alert.alert('Auditoria Concluída', 'Relatório de Visita Técnica salvo no dispositivo com sucesso.');
    } catch (erro) {
      Alert.alert('Erro ao salvar', erro.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <ScrollView style={globalStyles.container} nestedScrollEnabled>
      {/* 1. Georreferenciamento */}
      <View style={globalStyles.cardVisita}>
        <Text style={globalStyles.tituloSecao}>1. Localização do Lote</Text>
        <BotaoCustomizado
          titulo={buscandoLocalizacao ? 'Obtendo coordenadas...' : 'Marcar Localização Atual'}
          onPress={capturarCoordenadasGPS}
          tipo="primary"
          desabilitado={buscandoLocalizacao}
        />
        {localizacao && (
          <View style={{ marginTop: 8 }}>
            <Text style={globalStyles.textoInformativo}>Lat: {localizacao.latitude.toFixed(6)}</Text>
            <Text style={globalStyles.textoInformativo}>Long: {localizacao.longitude.toFixed(6)}</Text>
            {/* indicador visual de precisão de GPS */}
            <IndicadorPrecisaoGPS precisaoMetros={localizacao.accuracy} />
          </View>
        )}
      </View>

      {/* foto */}
      <View style={globalStyles.cardVisita}>
        <Text style={globalStyles.tituloSecao}>2. FOTO Da Qualidade de Grãos</Text>
        <BotaoCustomizado titulo="Acionar Câmera de Campo" onPress={capturarFotoEvidencia} tipo="warning" />
        {imagemEvidencia && <Image source={{ uri: imagemEvidencia }} style={globalStyles.imagePreview} />}
      </View>

      {/* 3. Produtor / contatos */}
      <View style={globalStyles.cardVisita}>
        <Text style={globalStyles.tituloSecao}>3. Produtor</Text>
        <BotaoCustomizado
          titulo={contatoSelecionado ? 'Trocar Produtor' : 'Buscar Produtores na Agenda'}
          onPress={abrirBuscaDeProdutores}
          tipo="primary"
        />

        {contatoSelecionado && (
          <Text style={[globalStyles.textoInformativo, { color: '#27AE60', fontWeight: 'bold', marginVertical: 6 }]}>
            Vinculado a: {contatoSelecionado.name}
          </Text>
        )}
      </View>

      <BotaoCustomizado
        titulo={salvando ? 'Salvando...' : 'Finalizar relátorio'}
        onPress={finalizarRelatorioAuditoria}
        tipo="success"
        desabilitado={salvando}
      />

      {navigation && (
        <BotaoCustomizado
          titulo="Ver Histórico de Visitas"
          onPress={() => navigation.navigate('Historico')}
          tipo="primary"
        />
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}
