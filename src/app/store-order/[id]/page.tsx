"use client";

import useQueryParams from "@/src/hooks/useQueryParams";
import { getAllProductAPI } from "@/src/services/product.service";
import { Input } from "@/src/styles/components/ui/input";
import { ScrollArea } from "@/src/styles/components/ui/scroll-area";
import { QueryParams } from "@/src/types/SubType";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProductOrderCard from "./components/ProductOrderCard";
import { Product } from "@/src/types";
import SidebarFilter from "./components/SidebarFilter";
import CartDetailSheet from "./components/CartDetailSheet";
import { paymentCheckoutAPI } from "@/src/services/payment.service";
import { useAuth } from "@/src/hooks/useAuth";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/src/styles/components/ui/sheet";
import { Button } from "@/src/styles/components/ui/button";
import { Filter, Search } from "lucide-react";
import { useDebounce } from "@/src/hooks/useDebounce";
import Image from "next/image";

type CartItem = {
  productColorId: string;
  quantity: number;
};

export default function StoreOrderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    order: "",
    search: "",
    brand: "",
  });

  const [searchTerm, setSearchTerm] = useState(query.search || "");
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    updateQuery({ search: debouncedSearch });
  }, [debouncedSearch]);

  const {
    data: productList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["products", query],
    queryFn: () => getAllProductAPI(query),
    select: (res) => res.data,
  });

  const [cart, setCart] = useState<CartItem[]>([]);

  const handleAddToCart = (productColorId: string) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.productColorId === productColorId);

      if (exist) {
        return prev.map((item) =>
          item.productColorId === productColorId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...prev, { productColorId, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productColorId: string) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.productColorId === productColorId);

      if (!exist) return prev;

      if (exist.quantity === 1) {
        return prev.filter((i) => i.productColorId !== productColorId);
      }

      return prev.map((item) =>
        item.productColorId === productColorId
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      );
    });
  };

  const handleCheckout = async () => {
    const payload = {
      storeId: id,
      items: cart,
    };
    console.log("payload", payload);
    try {
      const res = await paymentCheckoutAPI(payload);
      console.log("res", res.checkoutUrl);

      const checkoutUrl = res?.checkoutUrl;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.log("checkout err", error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background flex-col md:flex-row">
      {/* MOBILE HEADER - Hiển thị filter dạng Sheet */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-card">
        <div className=" flex items-center gap-1 justify-center">
          <div className="relative w-[50px] h-[50px]">
            <Image
              src="/images/finallogo.png"
              alt="ToyShelf logo"
              fill
              className="object-contain"
            />
          </div>
          {/*#0D47A1 */}
          <p className="text-[#1E88E5] font-bold text-xl">ToyShelf</p>
        </div>

        <CartDetailSheet
          cart={cart}
          products={productList}
          onAdd={handleAddToCart}
          onRemove={handleRemoveFromCart}
          onCheckout={handleCheckout}
        />
      </div>

      {/* SIDEBAR - Ẩn trên mobile, hiện từ md trở lên */}
      <div className="hidden md:block">
        <SidebarFilter
          query={query}
          updateQuery={updateQuery}
          resetQuery={resetQuery}
        />
      </div>

      {/* NỘI DUNG CHÍNH */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* TOP BAR: Search & Cart */}
        <header className="h-16 border-b hidden md:flex items-center px-4 md:px-8 justify-between bg-background/95 backdrop-blur sticky top-0 z-10 gap-4">
          <div className=" flex items-center gap-1 justify-center">
            <div className="relative w-[50px] h-[50px]">
              <Image
                src="/images/finallogo.png"
                alt="ToyShelf logo"
                fill
                className="object-contain"
              />
            </div>
            {/*#0D47A1 */}
            <p className="text-[#1E88E5] font-bold text-xl">ToyShelf</p>
          </div>
          <div className="relative flex-1 max-w-md hidden sm:block">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              key={query.search} // Thêm dòng này
              defaultValue={query.search || ""} // Dùng defaultValue thay vì value nếu muốn đơn giản
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm sản phẩm..."
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="md:block hidden">
              <CartDetailSheet
                cart={cart}
                products={productList}
                onAdd={handleAddToCart}
                onRemove={handleRemoveFromCart}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        </header>

        <div className="flex gap-2 items-center p-4 border-b sm:hidden">
          {/* Search cho mobile (hiện ngay dưới header) */}
          <div className="relative w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              key={query.search} // Thêm dòng này
              defaultValue={query.search || ""} // Dùng defaultValue thay vì value nếu muốn đơn giản
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm sản phẩm..."
              className="pl-9"
            />
          </div>
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 h-[36px]">
                <Filter size={16} /> Lọc
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="p-0 w-full sm:max-w-xs flex flex-col"
            >
              <SidebarFilter
                query={query}
                updateQuery={updateQuery}
                resetQuery={resetQuery}
                onApply={() => setIsFilterOpen(false)} // Nhấn Apply là đóng
              />
            </SheetContent>
          </Sheet>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 md:p-8">
            {/* Grid layout thông minh: 2 cột mobile, 3-4 cột desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
              {isLoading
                ? [...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="h-64 bg-muted animate-pulse rounded-lg"
                    />
                  ))
                : productList.map((product: Product) => (
                    <ProductOrderCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
            </div>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
