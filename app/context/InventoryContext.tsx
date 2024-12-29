import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

export interface Item {
  id: string;
  name: string;
  description: string;
  quantity: number;
  sku: string;
}

export interface Section {
  id: string;
  name: string;
  description: string;
}

export interface Inventory {
  id: string;
  name: string;
  description: string;
  sections: Section[];
}

export interface InventoryProps {
  inventoryState?: { inventories: Inventory[], currentInventory: Inventory | null, currentSection: Section | null, currentItem: Item | null, items: Item[] };
  getInventories?: () => Promise<any>;
  setCurrentInventory?: (inventory: Inventory) => void;
  setCurrentSection?: (section: Section) => void;
  setCurrentItem?: (item: Item) => void;
  newInventory?: (name: string, description: string) => Promise<any>;
  newSection?: (name: string, description: string) => Promise<any>;
  getItems?: (sectionId: string) => Promise<Item[]>;
  scanCode?: (sku: string) => Promise<Item>;
  deleteItem?: (itemId: string) => Promise<any>;
  newItem?: (name: string, description: string, quantity: number) => Promise<any>;
}

const InventoryContext = createContext<InventoryProps>({});

export const useInventory = () => {
  return useContext(InventoryContext);
};

export const InventoryProvider = ({ children }: any) => {
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [currentInventory, setCurrentInventory] = useState<Inventory | null>(null);
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const { authState } = useAuth();

  const getInventories = async () => {
    try {
      const res = await axios.get(process.env.EXPO_PUBLIC_API_URL + '/inventories');

      setInventories(res.data);

      return res.data;
    } catch (e) { }
  };

  const newInventory = async (name: string, description: string) => {
    try {
      const res = await axios.post(process.env.EXPO_PUBLIC_API_URL + '/inventories', {
        name,
        description
      });

      setInventories([...inventories, res.data]);
    } catch (e) { }
  };

  const newSection = async (name: string, description: string) => {
    try {
      const res = await axios.post(process.env.EXPO_PUBLIC_API_URL + '/inventories/' + currentInventory?.id + '/sections', {
        name,
        description
      });

      setInventories([...inventories, res.data]);
    } catch (e) {
      console.log(e);
    }
  };

  const getItems = async (sectionId: string) => {
    try {
      const res = await axios.get(process.env.EXPO_PUBLIC_API_URL + '/inventories/' + currentInventory?.id + '/items', {
        params: {
          'section_id': sectionId
        }
      });

      setItems(res.data);

      return res.data;
    } catch (e) {
      console.log(e);
    }
  };

  const scanCode = async (sku: string) => {
    try {
      const res = await axios.get(process.env.EXPO_PUBLIC_API_URL + '/inventories/scan', {
        params: {
          'sku': sku
        }
      });

      setCurrentItem(res.data);
      if (inventories) {
        const inventory = inventories.find(inventory => inventory.id === res.data.inventory_id);
        if (inventory) {
          setCurrentInventory(inventory);
          const section = inventory.sections.find(section => section.id === res.data.section_id);
          if (section) {
            setCurrentSection(section);
          }
        }
      }

      return res.data;
    } catch (e) {
      console.log(e);
    }
  };

  const deleteItem = async (itemId: string) => {
    const res = await axios.delete(process.env.EXPO_PUBLIC_API_URL + '/inventories/' + currentInventory?.id + '/items/' + itemId);
    if (res.data == 'ok') {
      return;
    }
  };

  const newItem = async (name: string, description: string, quantity: number) => {
    try {
      const res = await axios.post(process.env.EXPO_PUBLIC_API_URL + '/inventories/' + currentInventory?.id + '/items', {
        name,
        description,
        quantity,
        section_id: currentSection?.id
      });

      setItems([...items, res.data]);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (authState?.authenticated) {
      getInventories();
    }
  }, [authState, authState?.authenticated]);

  return (
    <InventoryContext.Provider value={{ inventoryState: { inventories, currentInventory, currentSection, currentItem, items }, getInventories, setCurrentInventory, newInventory, newSection, getItems, setCurrentSection, setCurrentItem, scanCode, deleteItem, newItem }}>
      {children}
    </InventoryContext.Provider>
  );
};
