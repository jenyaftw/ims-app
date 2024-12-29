import { View, Text, StyleSheet, Image, Button, TouchableHighlight, Alert } from "react-native";
import { useInventory } from "../context/InventoryContext";
import React from "react";
import Barcode from "react-native-barcode-svg";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { printAsync, Printer, selectPrinterAsync } from "expo-print";

export default function ItemScreen() {
  const { inventoryState, deleteItem, getItems } = useInventory();
  const navigation = useNavigation();
  const [selectedPrinter, setSelectedPrinter] = React.useState<Printer | null>(null);

  const transferItem = () => {
    navigation.navigate('Transfer Item' as never);
  };

  const print = async () => {
    const printer = await selectPrinterAsync();
    if (!printer) {
      return;
    }
    setSelectedPrinter(printer);

    const sku = inventoryState?.currentItem?.sku;
    if (!sku) {
      return;
    }

    const htmlString = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
        <image src="https://barcode.orcascan.com/?type=code128&data=${sku}&format=png" />
      </div>
    `;

    printAsync({
      printerUrl: printer.url,
      html: htmlString,
    });
  };

  const deleteItemAction = async () => {
    if (!deleteItem || !inventoryState?.currentItem?.id) {
      return;
    }

    try {
      await deleteItem(inventoryState?.currentItem?.id as string);
    } catch (e) {
      Alert.alert('Error', 'There was an error deleting the item');
    }
    await getItems?.(inventoryState?.currentSection?.id as string);
    navigation.goBack();
  };

  const deleteItemPrompt = () => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => deleteItemAction(),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.list}>
        <View style={styles.listItem}>
          <Text style={styles.itemTitle}>ID</Text>
          <Text>{inventoryState?.currentItem?.id}</Text>
        </View>

        <View style={styles.listItem}>
          <Text style={styles.itemTitle}>Name</Text>
          <Text>{inventoryState?.currentItem?.name}</Text>
        </View>

        <View style={styles.listItem}>
          <Text style={styles.itemTitle}>Description</Text>
          <Text>{inventoryState?.currentItem?.description}</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.itemTitle}>Quantity</Text>
          <Text>{inventoryState?.currentItem?.quantity}</Text>
        </View>
        <View style={styles.listItem}>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
            <View style={{ display: 'flex', flexDirection: 'column' }}>
              <Text style={styles.itemTitle}>SKU</Text>
              <Text>{inventoryState?.currentItem?.sku}</Text>
            </View>

            <TouchableHighlight onPress={print}>
              <Ionicons name="print" size={24} color="#007AFF" />
            </TouchableHighlight>
          </View>
          {
            inventoryState?.currentItem?.sku && (
              <View style={styles.barcodeContainer}>
                <Barcode value={inventoryState.currentItem.sku} format="CODE128" />
              </View>
            )
          }
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Button title="Delete" color="red" onPress={deleteItemPrompt} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: '100%',
  },
  barcodeContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
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
