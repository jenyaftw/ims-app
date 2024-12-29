import { View, Text, StyleSheet, RefreshControl, SafeAreaView, ScrollView } from "react-native";
import { Inventory, useInventory } from "../context/InventoryContext";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function InventoriesScreen() {
  const { inventoryState, getInventories, setCurrentInventory } = useInventory();
  const [refreshing, setRefreshing] = React.useState(false);
  const navigation = useNavigation();

  const onRefresh = React.useCallback(async () => {
    if (getInventories) {
      setRefreshing(true);
      await getInventories();
      setTimeout(() => {
        setRefreshing(false);
      }, 200);
    }
  }, []);

  const openInventory = (inventory: Inventory) => {
    if (setCurrentInventory) {
      setCurrentInventory(inventory);
      navigation.navigate('Inventory' as never);
      console.log('open inventory', inventory);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={styles.container}>
            <Text>{inventoryState?.inventories.length} inventories found</Text>
            <View style={styles.list}>
              {inventoryState?.inventories.map((inventory, idx) => (
                <View style={styles.listItem} key={idx} onTouchEnd={() => openInventory(inventory)}>
                  <Text style={styles.itemTitle}>{inventory.name}</Text>
                  <Text>{inventory.description}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: '100%',
  },
  scrollView: {
    flex: 1,
    height: '100%',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
  },
  listItem: {
    padding: 10,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  itemTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  }
});
