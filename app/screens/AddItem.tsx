import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import { useInventory } from "../context/InventoryContext";
import { useNavigation } from "@react-navigation/native";

export default function AddItemScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(0);
  const { inventoryState, newItem, getItems } = useInventory();
  const navigation = useNavigation();

  const addItem = async () => {
    if (!newItem || !getItems || !inventoryState?.currentSection) {
      console.log("BYE");
      console.log(newItem);
      console.log(getItems);
      console.log(inventoryState);
      return
    }

    await newItem(name, description, quantity);
    await getItems(inventoryState.currentSection.id);
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
      <Text style={styles.label}>Quantity:</Text>
      <TextInput
        autoCapitalize="none"
        keyboardType="number-pad"
        style={styles.input}
        value={quantity.toString()}
        onChangeText={t => setQuantity(parseInt(t))}
        placeholder="Quantity"
      />

      <View>
        <Button color="#2296F3" title="Add" onPress={addItem} />
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
