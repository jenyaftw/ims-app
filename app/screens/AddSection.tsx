import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import { useInventory } from "../context/InventoryContext";
import { useNavigation } from "@react-navigation/native";

export default function AddSectionScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { inventoryState, getInventories, newSection, setCurrentInventory } = useInventory();
  const navigation = useNavigation();

  const addInventory = async () => {
    if (!getInventories || !newSection || !setCurrentInventory || !inventoryState || !inventoryState.currentInventory) {
      return;
    }
    await newSection(name, description);
    const inventories = await getInventories();
    setCurrentInventory(inventories.find((inventory: any) => inventory.id === inventoryState.currentInventory!.id) || null);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        autoCapitalize="none"
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
      />
      <Text style={styles.label}>Description:</Text>
      <TextInput
        autoCapitalize="none"
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
      />

      <View>
        <Button color="#2296F3" title="Add" onPress={addInventory} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    borderColor: 'black',
    backgroundColor: 'white',
  },
  label: {
    width: '80%',
  },
  button: {
    backgroundColor: 'blue',
  }
});
