import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import InventoriesScreen from "./Inventories";
import ScannerScreen from "./Scanner";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import TransfersScreen from "./Transfers";

export default function HomeScreen() {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName="Inventories"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Inventories"
        component={InventoriesScreen}
        options={{
          tabBarLabel: "Inventories",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="inventory" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Transfers"
        component={TransfersScreen}
        options={{
          tabBarLabel: "Transfers",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="transfer" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Scanner"
        component={ScannerScreen}
        options={{
          tabBarLabel: "Scan",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="barcode-scan" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
