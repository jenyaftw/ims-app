import { View, Text, StyleSheet, RefreshControl, SafeAreaView, ScrollView, Touchable, TouchableHighlight, Button, Alert } from "react-native";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { TransferRequest, useTransfers } from "../context/TransferContext";
import { Item, useInventory } from "../context/InventoryContext";

export default function TransfersScreen() {
  const { inventoryState, setCurrentItem } = useInventory();
  const { transferState, getTransfers, processTransfer } = useTransfers();
  const [refreshing, setRefreshing] = React.useState(false);
  const navigation = useNavigation();

  const onRefresh = React.useCallback(async () => {
    if (getTransfers) {
      setRefreshing(true);
      await getTransfers();
      setTimeout(() => {
        setRefreshing(false);
      }, 200);
    }
  }, []);

  const selectItem = (item: Item) => {
    if (!setCurrentItem) {
      return;
    }

    setCurrentItem(item);
    navigation.navigate('Item' as never);
  };

  const process = async (id: string) => {
    if (!processTransfer) {
      return;
    }

    await processTransfer(id);

    Alert.alert("Transfer processed", "The transfer has been processed successfully.");
  }

  const processPrompt = (transfer: TransferRequest) => {
    console.log(transfer);

    Alert.alert(
      "Are you sure you want to process this transfer?",
      "This action cannot be undone.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK", onPress: () => process(transfer.id)
        }
      ]
    );
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
            <Text>{transferState?.transfers.length} transfer(s) found</Text>
            <View style={styles.list}>
              {transferState?.transfers.map((transfer, idx) => (
                <TouchableHighlight onPress={() => selectItem(transfer.item)} underlayColor="#f0f0f0">
                  <View style={styles.listItem} key={idx}>
                    <Text style={styles.itemTitle}>{transfer.item.name}</Text>
                    <Text>{transfer.item.description}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginTop: 20 }}>
                        <Text>From: {inventoryState?.inventories.find(el => el.id === transfer.from_inventory)?.name} - {inventoryState?.inventories.find(el => el.id === transfer.from_inventory)?.sections.find(el => el.id === transfer.from_section)?.name}</Text>
                        <Text>To: {inventoryState?.inventories.find(el => el.id === transfer.to_inventory)?.name} - {inventoryState?.inventories.find(el => el.id === transfer.to_inventory)?.sections.find(el => el.id === transfer.to_section)?.name}</Text>
                      </View>

                      <Button onPress={() => processPrompt(transfer)} title="Transfer" />
                    </View>
                  </View>
                </TouchableHighlight>
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
