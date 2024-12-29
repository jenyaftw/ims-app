import { View, Text, StyleSheet, RefreshControl, SafeAreaView, ScrollView } from "react-native";
import { Section, useInventory } from "../context/InventoryContext";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function InventoryScreen() {
  const [refreshing, setRefreshing] = React.useState(false);
  const { inventoryState, getInventories, getItems, setCurrentSection } = useInventory();
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

  const openSection = async (section: Section) => {
    if (!getItems || !setCurrentSection) {
      return;
    }

    const items = await getItems(section.id);
    setCurrentSection(section);

    navigation.navigate('Section' as never);
  };

  useEffect(() => {
    navigation.setOptions({ title: inventoryState?.currentInventory?.name });
  }, [inventoryState?.currentInventory]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={styles.container}>
            <Text>{inventoryState?.currentInventory?.sections.length} section(s) found</Text>
            <View style={styles.list}>
              {inventoryState?.currentInventory?.sections.map((section, idx) => (
                <View style={styles.listItem} key={idx} onTouchEnd={() => { openSection(section) }}>
                  <Text style={styles.itemTitle}>{section.name}</Text>
                  <Text>{section.description}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider >
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
