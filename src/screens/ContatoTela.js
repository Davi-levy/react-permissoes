import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import * as Contacts from 'expo-contacts/legacy';

import { globalStyles } from '../styles/globalStyles';
import ItemContatoCard, { ALTURA_ITEM_CONTATO } from '../components/ItemContatoCard';

const TAMANHO_PAGINA = 40; //pageSize
const ATRASO_BUSCA_MS = 350; // ebounce

export default function ContatosScreen({ route, navigation }) {
  const aoSelecionar = route?.params?.aoSelecionar;
  const contatoAtual = route?.params?.contatoAtual;

  const [termoBusca, setTermoBusca] = useState('');
  const [contatos, setContatos] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [total, setTotal] = useState(0);
  const [carregandoInicial, setCarregandoInicial] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [permissaoNegada, setPermissaoNegada] = useState(false);
  const [erro, setErro] = useState(null);

  const timeoutBusca = useRef(null);
  const requisicaoEmAndamento = useRef(false);

  const buscarPagina = useCallback(async (offset, termo, substituir) => {
    if (requisicaoEmAndamento.current) return;
    requisicaoEmAndamento.current = true;
    try {
      const resultado = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        sort: Contacts.SortTypes.FirstName,
        pageSize: TAMANHO_PAGINA,
        pageOffset: offset,
        name: termo || undefined,
      });
      setTotal(resultado.total ?? 0);
      setContatos((atual) => (substituir ? resultado.data : [...atual, ...resultado.data]));
      setErro(null);
    } catch (e) {
      // RNF01
      setErro('Não foi possível carregar os contatos agora.');
    } finally {
      requisicaoEmAndamento.current = false;
    }
  }, []);

  const carregarDoInicio = useCallback(async (termo) => {
    setCarregandoInicial(true);
    setPagina(0);
    await buscarPagina(0, termo, true);
    setCarregandoInicial(false);
  }, [buscarPagina]);

  useEffect(() => {
    (async () => {
      const { status, canAskAgain } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        setPermissaoNegada(true);
        setCarregandoInicial(false);
        setErro(
          canAskAgain === false
            ? 'Permissão de contatos negada permanentemente. Habilite em Configurações do sistema.'
            : 'Permissão de contatos negada.'
        );
        return;
      }
      carregarDoInicio('');
    })();
    //
  }, []);

  const aoDigitar = (texto) => {
    setTermoBusca(texto);
    if (timeoutBusca.current) clearTimeout(timeoutBusca.current);
    timeoutBusca.current = setTimeout(() => carregarDoInicio(texto), ATRASO_BUSCA_MS);
  };

  const carregarProximaPagina = async () => {
    if (carregandoMais || carregandoInicial) return;
    if (contatos.length >= total) return;
    setCarregandoMais(true);
    const proxima = pagina + 1;
    await buscarPagina(proxima * TAMANHO_PAGINA, termoBusca, false);
    setPagina(proxima);
    setCarregandoMais(false);
  };

  const selecionarESair = (contato) => {
    if (aoSelecionar) aoSelecionar(contato);
    navigation.goBack();
  };

  return (
    <View style={globalStyles.container}>
      <TextInput
        style={globalStyles.campoBusca}
        placeholder="Buscar produtor por nome..."
        placeholderTextColor="#7A7A80"
        value={termoBusca}
        onChangeText={aoDigitar}
        editable={!permissaoNegada}
      />
      {total > 0 && (
        <Text style={globalStyles.contadorContatos}>{contatos.length} de {total} contatos</Text>
      )}
      {erro && <Text style={estilos.erro}>{erro}</Text>}

      {carregandoInicial ? (
        <ActivityIndicator color="#2980B9" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={contatos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ItemContatoCard
              item={item}
              selecionado={contatoAtual?.id === item.id}
              onSelecionar={selecionarESair}
            />
          )}
          // listas de contatos otimização
          initialNumToRender={16}
          maxToRenderPerBatch={16}
          windowSize={7}
          removeClippedSubviews
          getItemLayout={(_, index) => ({
            length: ALTURA_ITEM_CONTATO,
            offset: ALTURA_ITEM_CONTATO * index,
            index,
          })}
          onEndReached={carregarProximaPagina}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            carregandoMais ? (
              <View style={globalStyles.rodapePaginacao}>
                <ActivityIndicator color="#2980B9" />
              </View>
            ) : null
          }
          ListEmptyComponent={
            !permissaoNegada && <Text style={estilos.vazio}>Nenhum contato encontrado.</Text>
          }
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  erro: { color: '#E74C3C', textAlign: 'center', marginBottom: 8 },
  vazio: { textAlign: 'center', color: '#8E8E93', marginTop: 30 },
});
