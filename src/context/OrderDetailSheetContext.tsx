"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import ProductViewDetailSheet from "../components/ProductViewDetailSheet";
import OrderViewDetailSheet from "../components/OrderViewDetailSheet";

type OrderDetailSheetContextType = {
  open: (id: number) => void;
  close: () => void;
};

type OrderDetailSheetProviderProps = {
  children: ReactNode;
};

const OrderDetailSheetContext =
  createContext<OrderDetailSheetContextType | null>(null);

export const useOrderDetailSheet = () => {
  const context = useContext(OrderDetailSheetContext);

  if (!context) {
    throw new Error("lỗi order detail sheet context");
  }

  return context;
};

export function OrderDetailSheetProvider({
  children,
}: OrderDetailSheetProviderProps) {
  const [orderCode, setOrderCode] = useState<number | null>(null);

  const open = (id: number) => {
    console.log("OPEN", id);
    setOrderCode(id);
  };
  const close = () => setOrderCode(null);

  return (
    <OrderDetailSheetContext.Provider value={{ open, close }}>
      {children}

      <OrderViewDetailSheet
        orderCode={orderCode}
        isOpen={!!orderCode}
        onClose={close}
      />
    </OrderDetailSheetContext.Provider>
  );
}
