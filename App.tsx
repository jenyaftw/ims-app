import { Alert, Button, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { AuthProvider, useAuth } from './app/context/AuthContext';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './app/screens/auth/Login';
import ScannerScreen from './app/screens/Scanner';
import React from 'react';
import { InventoryProvider } from './app/context/InventoryContext';
import InventoryScreen from './app/screens/Inventory';
import AddInventoryScreen from './app/screens/AddInventory';
import AddSectionScreen from './app/screens/AddSection';
import SectionScreen from './app/screens/Section';
import ItemScreen from './app/screens/Item';
import TransferItemScreen from './app/screens/TransferItem';
import HomeScreen from './app/screens/Home';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AddItemScreen from './app/screens/AddItem';
import { TransferProvider } from './app/context/TransferContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <TransferProvider>
          <Layout></Layout>
        </TransferProvider>
      </InventoryProvider>
    </AuthProvider>
  );
}

export const Layout = () => {
  const { authState, onLogout } = useAuth();

  const logout = () => {
    if (!authState?.authenticated || !onLogout) {
      return;
    }

    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => onLogout(),
      },
    ]);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {authState?.authenticated ? (
          <React.Fragment>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                headerLeft: ({ tintColor }) => {
                  const navigation = useNavigation();
                  return (
                    <TouchableHighlight onPress={logout} style={{ padding: 10 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <MaterialIcons name="logout" size={24} color={tintColor} />
                      </View>
                    </TouchableHighlight>
                  );
                },
                headerRight: () => {
                  const navigation = useNavigation();
                  return (
                    <Button onPress={() => navigation.navigate('Add Inventory' as never)} title="Add"></Button>
                  );
                },
              }}
            />
            <Stack.Screen name="Scanner" component={ScannerScreen} />
            <Stack.Screen
              name="Inventory"
              component={InventoryScreen}
              options={{
                headerRight: () => {
                  const navigation = useNavigation();
                  return (
                    <Button onPress={() => navigation.navigate('Add Section' as never)} title="Add"></Button>
                  );
                },
              }}
            />
            <Stack.Screen
              name="Section"
              component={SectionScreen}
              options={{
                headerRight: () => {
                  const navigation = useNavigation();
                  return (
                    <Button onPress={() => navigation.navigate('Add Item' as never)} title="Add"></Button>
                  );
                },
              }}
            />
            <Stack.Screen
              name="Item"
              component={ItemScreen}
              options={{
                headerRight: ({ tintColor }) => {
                  const navigation = useNavigation();
                  return (
                    <TouchableHighlight>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="transfer" size={24} color={tintColor} />
                        <Button onPress={() => navigation.navigate('Transfer Item' as never)} title="Transfer"></Button>
                      </View>
                    </TouchableHighlight>
                  );
                },
              }}
            />
            <Stack.Screen name="Add Inventory" component={AddInventoryScreen} />
            <Stack.Screen name="Add Section" component={AddSectionScreen} />
            <Stack.Screen name="Add Item" component={AddItemScreen} />
            <Stack.Screen name="Transfer Item" component={TransferItemScreen} />
          </React.Fragment>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
