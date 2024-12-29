import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";
import { Item } from "./InventoryContext";

export interface TransferRequest {
  id: string;
  from_inventory: string;
  to_inventory: string;
  from_section: string;
  to_section: string;
  item: Item;
  status: string;
  quantity: number;
}

export interface TransferProps {
  transferState?: { transfers: TransferRequest[] };
  getTransfers?: () => Promise<TransferRequest[] | null>;
  createTransfer?: (item_id: string, to_section_id: string, quantity: number) => Promise<any>;
  processTransfer?: (transfer_id: string) => Promise<any>;
}

const TransferContext = createContext<TransferProps>({});

export const useTransfers = () => {
  return useContext(TransferContext);
};

export const TransferProvider = ({ children }: any) => {
  const [transfers, setTransfers] = useState<TransferRequest[]>([]);
  const { authState } = useAuth();

  const getTransfers = async () => {
    try {
      const res = await axios.get(process.env.EXPO_PUBLIC_API_URL + '/transfers');

      const transfers = res.data.filter((transfer: TransferRequest) => transfer.status === 'pending');

      setTransfers(transfers);
      return transfers
    } catch (e) { }
  };

  const createTransfer = async (item_id: string, to_section_id: string, quantity: number) => {
    try {
      console.log(JSON.stringify({ item_id, to_section_id, quantity: parseInt(quantity.toString()) }));

      const res = await axios.post(process.env.EXPO_PUBLIC_API_URL + '/transfers', {
        item_id,
        to_section_id,
        quantity: parseInt(quantity.toString()),
      });

      await getTransfers();

      return res.data;
    } catch (e) { }
  };

  const processTransfer = async (transfer_id: string) => {
    try {
      const res = await axios.post(process.env.EXPO_PUBLIC_API_URL + '/transfers/' + transfer_id);

      await getTransfers();

      return res.data;
    } catch (e) { }
  };

  useEffect(() => {
    if (authState?.authenticated) {
      getTransfers();
    }
  }, [authState, authState?.authenticated]);

  return (
    <TransferContext.Provider value={{ transferState: { transfers }, getTransfers, createTransfer, processTransfer }}>
      {children}
    </TransferContext.Provider>
  );
};
