import { View, Text, StyleSheet } from "react-native";
import { Item, useInventory } from "../context/InventoryContext";
import React from "react";
import { useNavigation } from "@react-navigation/native";

export default function SectionScreen() {
  const { inventoryState, setCurrentItem } = useInventory();
  const navigation = useNavigation();

  const selectItem = (item: Item) => {
    if (!setCurrentItem) {
      return;
    }

    setCurrentItem(item);
    navigation.navigate('Item' as never);
  };

  return (
    <View style={styles.container}>
      <Text>{inventoryState?.items.length} item(s) found</Text>
      <View style={styles.list}>
        {inventoryState?.items.map((item, idx) => (
          <View style={styles.listItem} key={idx} onTouchEnd={() => selectItem(item)}>
            <Text style={styles.itemTitle}>{item.name} - SKU: {item.sku}</Text>
            <Text>{item.description} - Quantity: {item.quantity}</Text>
          </View>
        ))}
      </View>
    </View>
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
