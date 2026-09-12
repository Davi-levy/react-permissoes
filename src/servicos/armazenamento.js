import AsyncStorage from '@react-native-async-storage/async-storage';

//RF01 histórico local dos relatorios
//os relatorios feitos ficam salvos no celular sem internet
const CHAVE_VISITAS = '@registro_visitas:lista';

export async function salvarVisita(visita) {
  try {
    const visitasAtuais = await listarVisitas();
    const novaLista = [
      { ...visita, id: Date.now().toString(), criadoEm: new Date().toISOString() },
      ...visitasAtuais,
    ];
    await AsyncStorage.setItem(CHAVE_VISITAS, JSON.stringify(novaLista));
    return novaLista;
  } catch (erro) {
    console.warn('Falha ao salvar visita localmente:', erro);
    throw new Error('Não foi possível salvar a visita no dispositivo.');
  }
}

export async function listarVisitas() {
  try {
    const bruto = await AsyncStorage.getItem(CHAVE_VISITAS);
    return bruto ? JSON.parse(bruto) : [];
  } catch (erro) {
    console.warn('Falha ao ler histórico local:', erro);
    return [];
  }
}
