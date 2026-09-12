import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RegistroVisitaScreen from './src/screens/RegistroTela';
import ContatosScreen from './src/screens/ContatoTela';
import HistoricoScreen from './src/screens/HistoricoTela';

const Stack = createNativeStackNavigator();

//tela vai se adaptando automaticamente a diferentes tamanhos e orientações de tela.
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Registro"
        screenOptions={{
          headerStyle: { backgroundColor: '#1C1C1E' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="Registro"
          component={RegistroVisitaScreen}
          options={{ title: 'Auditoria agrícola PAM' }}
        />
        <Stack.Screen
          name="Contatos"
          component={ContatosScreen}
          options={{ title: 'Buscar Produtor' }}
        />
        <Stack.Screen
          name="Historico"
          component={HistoricoScreen}
          options={{ title: 'Histórico de Visitas' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
