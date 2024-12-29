import { View, Text, StyleSheet, Image, Button, Alert } from "react-native";
import { useInventory } from "../context/InventoryContext";
import React from "react";
import { Picker } from '@react-native-picker/picker';
import { useTransfers } from "../context/TransferContext";
import { useNavigation } from "@react-navigation/native";

export default function TransferItemScreen() {
  const { inventoryState } = useInventory();
  const { createTransfer } = useTransfers();
  const [inventory, setInventory] = React.useState<number | null>(null);
  const [section, setSection] = React.useState<number | null>(null);
  const [quantity, setQuantity] = React.useState<number | null>(null);
  const navigation = useNavigation();

  const transfer = async () => {
    if (!createTransfer || !inventoryState?.currentItem || !inventory || !section) {
      return;
    }

    await createTransfer(inventoryState?.currentItem?.id, inventoryState?.inventories[inventory]?.sections[section]?.id, quantity || 0);
    Alert.alert("Transfer successful", "The item has been transferred successfully.");
    navigation.goBack();
  };

  const transferPrompt = async () => {
    Alert.alert(
      "Are you sure you want to transfer this item?",
      "This action cannot be undone.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: transfer }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text>Transferring {inventoryState?.currentItem?.name}</Text>
      <Picker
        selectedValue={inventory}
        onValueChange={(value) => setInventory(value)}
      >
        <Picker.Item key={-1} label={"Select an inventory"} />
        {
          inventoryState?.inventories.map((inventory, idx) => (
            <Picker.Item key={idx} label={inventory.name} value={idx} />
          ))
        }
      </Picker>
      {
        inventory && (
          <Picker
            selectedValue={section}
            onValueChange={(value) => setSection(value)}
          >
            <Picker.Item key={-1} label={"Select a section"} />
            {
              inventoryState?.inventories[inventory] && inventoryState?.inventories[inventory].sections.map((section, idx) => (
                <Picker.Item key={idx} label={section.name} value={idx} />
              ))
            }
          </Picker>
        )
      }

      {
        inventory && section && (
          <Picker
            selectedValue={quantity}
            onValueChange={(value) => setQuantity(value)}
          >
            <Picker.Item key={-1} label={"Select quantity to transfer"} />
            {
              Array.from(Array(inventoryState?.currentItem?.quantity || 0).keys()).map((_, idx) => (
                <Picker.Item key={idx} label={(idx + 1).toString()} value={idx + 1} />
              ))
            }
          </Picker>
        )
      }

      {
        inventory && section && quantity && (
          <Button title="Transfer" onPress={transferPrompt} />
        )
      }
    </View >
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
