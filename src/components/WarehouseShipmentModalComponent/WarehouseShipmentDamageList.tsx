import { Shipment, ShipmentAssign } from "@/src/types";
import { Box, LayoutGrid, Package, Package2 } from "lucide-react";
import Image from "next/image";

interface WarehouseShipmentDamageListProps {
  shipmentDetail: Shipment | undefined;
  shipmentAssignDetail: ShipmentAssign;
}

function WarehouseShipmentDamageList({
  shipmentDetail,
  shipmentAssignDetail,
}: WarehouseShipmentDamageListProps) {
  const damageItemList = shipmentAssignDetail.damageReturnItems;
  // const totalQuantity = damageItemList.reduce(
  //   (sum, item) => sum + item.quantity,
  //   0,
  // );

  return (
    <>
      {/* Header */}
      <div className="p-4 border-b bg-white flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          <h4 className="font-bold text-sm uppercase">Hàng nhận</h4>
        </div>
        {/* <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
          {totalQuantity}
        </span> */}
      </div>

      {/* Danh sách sản phẩm */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {damageItemList.map((item, index) => {
          return (
            <div
              key={index}
              className="bg-white border rounded-xl p-3 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
            >
              {/* BÊN TRÁI: THÔNG TIN SẢN PHẨM (Chiếm phần lớn diện tích) */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="h-12 w-12 rounded-lg border bg-slate-50 flex-shrink-0 overflow-hidden relative shadow-sm">
                  {item?.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-slate-100">
                      <Package className="h-5 w-5 text-slate-300" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h5 className="font-bold text-[14px] text-slate-900 leading-tight truncate">
                    {item?.targetName || "N/A"}
                  </h5>

                  <div className="flex items-center gap-1 text-[12px] mt-1">
                    {item.damageType === "Product" ? (
                      <Package2 className="w-3.5 h-3.5 text-blue-500" />
                    ) : item.damageType === "Shelf" ? (
                      <LayoutGrid className="w-3.5 h-3.5 text-indigo-500" />
                    ) : (
                      <Box className="w-3.5 h-3.5 text-slate-500" />
                    )}

                    <span className="font-semibold text-slate-700">
                      {item.damageType === "Product"
                        ? "Sản phẩm"
                        : item.damageType === "Shelf"
                          ? "Kệ"
                          : "Hỗn hợp"}
                    </span>
                  </div>
                </div>
              </div>

              {/* BÊN PHẢI: 3 NHÓM SỐ LIỆU (Gom cụm đối soát) */}
              <div className="flex flex-col items-center min-w-[45px]">
                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-tight">
                  Số lượng
                </span>
                <span className="text-xl font-bold  drop-shadow-sm">
                  {item?.quantity}
                </span>
              </div>
            </div>
          );
        })}

        {damageItemList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-300">
            <Package className="h-12 w-12 mb-2 opacity-20" />
            <p className="text-sm italic">Không có dữ liệu sản phẩm</p>
          </div>
        )}
      </div>
    </>
  );
}

export default WarehouseShipmentDamageList;
