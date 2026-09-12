import { StyleSheet } from 'react-native';

const CORES = {
  fundo: '#121212',
  card: '#1E1E1E',
  cardAlternativo: '#2A2A2C',
  borda: '#3A3A3C',
  accent: '#3D8BFD',
  textoPrimario: '#F2F2F2',
  textoSecundario: '#A0A0A5',
  destaque: '#ECF0F1',
};

export const globalStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CORES.fundo, padding: 16 },
  cardVisita: {
    backgroundColor: CORES.card, borderRadius: 18, padding: 18,
    marginBottom: 18, borderLeftWidth: 3, borderLeftColor: CORES.accent,
  },
  tituloSecao: {
    fontSize: 14, fontWeight: '700', color: CORES.destaque, marginBottom: 12,
    textTransform: 'uppercase', letterSpacing: 0.8,
  },
  textoInformativo: { fontSize: 14, color: CORES.textoSecundario, marginVertical: 4 },
  imagePreview: {
    width: '100%', height: 200, borderRadius: 14, marginTop: 12,
    resizeMode: 'cover',
  },
  itemListaContato: {
    padding: 14, backgroundColor: CORES.cardAlternativo, borderRadius: 14,
    marginVertical: 5, borderWidth: 1, borderColor: CORES.borda,
  },
  nomeContatoText: { fontSize: 15, fontWeight: '600', color: CORES.textoPrimario },
  telefoneContatoText: { fontSize: 13, color: CORES.textoSecundario },

  campoBusca: {
    borderWidth: 1, borderColor: CORES.borda, borderRadius: 24,
    paddingHorizontal: 16, paddingVertical: 11, fontSize: 14,
    backgroundColor: CORES.cardAlternativo, marginBottom: 10,
    color: CORES.textoPrimario,
  },
  contadorContatos: { fontSize: 12, color: CORES.textoSecundario, marginBottom: 6 },
  rodapePaginacao: { paddingVertical: 14, alignItems: 'center' },
  indicadorGpsLinha: {
    flexDirection: 'row', alignItems: 'center', marginTop: 8,
    backgroundColor: CORES.cardAlternativo, paddingVertical: 7, paddingHorizontal: 12,
    borderRadius: 20, alignSelf: 'flex-start',
  },
  indicadorGpsBolinha: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  indicadorGpsTexto: { fontSize: 13, fontWeight: '600', color: CORES.textoPrimario },
  itemHistorico: {
    flexDirection: 'row', backgroundColor: CORES.card, borderRadius: 18,
    padding: 12, marginBottom: 12, gap: 10, borderWidth: 1, borderColor: CORES.borda,
  },
  historicoMiniatura: { width: 64, height: 64, borderRadius: 12, backgroundColor: CORES.cardAlternativo },
  historicoData: { fontSize: 12, color: CORES.textoSecundario },
});
