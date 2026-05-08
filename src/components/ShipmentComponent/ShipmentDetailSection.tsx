import {
  RefillRequestProductColor,
  RefillShelfRequestItem,
  Shipment,
} from "@/src/types";
import {
  Truck,
  Package,
  ArrowRight,
  Calendar,
  MapPin,
  Layers,
} from "lucide-react";
import ShipInfoItem from "./ShipInfoItem";
import ShipTimeNode from "./ShipTimeNode";
import EmptySection from "./EmptySection";
import { memo } from "react";
import { formatShipmentStatusText } from "@/src/utils/formatStatus";
import { formatColorNameToVN } from "@/src/utils/format";
import Image from "next/image";
import { ImageView } from "../ImageView";
import { ShipmentUrls } from "./ShipmentUrls";

interface ShipmentDetailSectionProps {
  shipmentDetail: Shipment[] | undefined;
  isLoading?: boolean;
}

function ShipmentDetailSection({
  shipmentDetail,
  isLoading,
}: ShipmentDetailSectionProps) {
  // Kiểm tra nếu có dữ liệu trong mảng
  const hasShipments = shipmentDetail && shipmentDetail.length > 0;

  return (
    <section className="space-y-4">
      {/* Tiêu đề Section */}
      <div className="flex items-center gap-2 font-bold uppercase text-xs tracking-wider">
        <Truck className="h-4 w-4" /> 3. Vận chuyển & Giao hàng
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-slate-400 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
          Đang tải dữ liệu...
        </div>
      ) : hasShipments ? (
        <div className="space-y-6">
          {shipmentDetail.map((shipment, index) => (
            <div
              key={shipment.id || index}
              className="bg-white rounded-xl border border-emerald-100 overflow-hidden shadow-sm"
            >
              {/* Header của từng chuyến giao hàng */}
              <div className="bg-emerald-50/50 px-4 py-2 border-b border-emerald-100 flex justify-between items-center">
                <span className="text-[11px] font-bold text-emerald-700 uppercase flex items-center gap-1">
                  <Package className="h-3 w-3" /> Phiếu giao hàng #{index + 1}
                </span>
                <span className="text-[10px] text-emerald-600/60 font-mono font-bold">
                  {shipment.code}
                </span>
              </div>

              <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800/50 bg-green-50/30 dark:bg-green-900/10">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-2 block">
                  Đơn hàng giao (
                  {
                    [
                      ...(shipment?.storeOrders || []),
                      ...(shipment?.shelfOrders || []),
                    ].length
                  }
                  )
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    ...(shipment?.storeOrders || []),
                    ...(shipment?.shelfOrders || []),
                  ].length > 0 ? (
                    [
                      ...(shipment?.storeOrders || []),
                      ...(shipment?.shelfOrders || []),
                    ].map((order) => (
                      <span
                        key={order.id}
                        className="inline-flex items-center px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-green-600 dark:text-green-400 text-[11px] font-bold border border-green-100 dark:border-green-900 shadow-sm"
                      >
                        {order.code}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">
                      Chưa có mã đơn
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Thông tin người giao và mã vận đơn */}
                <div className="grid grid-cols-2 gap-4">
                  <ShipInfoItem
                    label="Đơn vị/Người giao"
                    value={shipment.shipperName || "Chưa xác định"}
                    icon={<Truck className="h-3.5 w-3.5" />}
                  />
                  <ShipInfoItem
                    label="Trạng thái"
                    value={formatShipmentStatusText(shipment.status)} // Bạn có thể bọc thêm hàm formatStatus ở đây
                    isStatus
                  />
                </div>

                {/* Lộ trình di chuyển */}
                <div className="flex items-center gap-3 p-3 bg-emerald-50/30 rounded-lg border border-emerald-50 text-[12px]">
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">
                      Từ
                    </span>
                    <span className="text-slate-600 truncate font-medium">
                      {shipment.fromLocationName}
                    </span>
                  </div>

                  <div className="flex flex-col items-center px-2">
                    <ArrowRight className="h-4 w-4 text-emerald-500" />
                  </div>

                  <div className="flex flex-col flex-1 text-right min-w-0">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">
                      Đến
                    </span>
                    <span className="text-emerald-700 truncate font-bold">
                      {shipment.toLocationName}
                    </span>
                  </div>
                </div>

                {/* Timeline các mốc thời gian */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <ShipTimeNode label="Lấy hàng" time={shipment.pickedUpAt} />
                  <ShipTimeNode label="Giao hàng" time={shipment.deliveredAt} />
                  <ShipTimeNode
                    label="Hoàn tất"
                    time={shipment.storeReceivedAt}
                  />
                </div>

                <div className="mt-1">
                  <ShipmentUrls mediaUrls={shipment.medias || []} />
                </div>

                {/* Danh sách sản phẩm trong shipment */}
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <Package className="h-3 w-3" /> Chi tiết hàng hóa
                  </p>
                  <div className="bg-slate-50/50 rounded-lg border border-slate-100 divide-y divide-slate-100">
                    {shipment?.productItems?.length > 0 &&
                      shipment.productItems?.map((product, pIdx) => (
                        <ProductItem product={product} key={pIdx} />
                      ))}

                    {shipment?.shelfItems?.length > 0 &&
                      shipment.shelfItems?.map((shelf, pIdx) => (
                        <ShelfItem shelf={shelf} key={pIdx} />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptySection message="Chưa có thông tin vận chuyển" />
      )}
    </section>
  );
}

const ProductItem = ({ product }: { product: RefillRequestProductColor }) => {
  return (
    <div
      key={product.productColorId}
      className="p-2 flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="h-8 w-8 rounded border bg-white shrink-0 overflow-hidden relative">
          <Image
            src={product.imageUrl || ""}
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-slate-800 truncate mb-0.5">
            {product.productName}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 font-mono rounded border border-slate-200/50">
              {product.sku}
            </span>
            <span className="text-slate-300 text-[10px]">|</span>
            <p className="text-[11px] text-slate-500 font-medium">
              {formatColorNameToVN(product?.color || "")}
            </p>
          </div>
        </div>
      </div>

      {/* Đối soát số lượng */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="text-center min-w-[30px]">
          <p className="text-[8px] text-slate-400 uppercase font-bold">Giao</p>
          <p className="text-xs font-bold text-slate-600">
            {product.expectedQuantity}
          </p>
        </div>
        <div className="h-4 w-px bg-slate-200" />
        <div className="text-center min-w-[30px]">
          <p className="text-[8px] text-emerald-600 uppercase font-bold">
            Nhận
          </p>
          <p className="text-xs font-black text-emerald-600">
            {product.receivedQuantity}
          </p>
        </div>
      </div>
    </div>
  );
};

const ShelfItem = ({ shelf }: { shelf: RefillShelfRequestItem }) => {
  return (
    <div
      key={shelf.shelfTypeId}
      className="p-2 flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="h-8 w-8 rounded border bg-white shrink-0 overflow-hidden relative">
          <Image
            src={shelf.imageUrl || ""}
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-slate-800 truncate mb-0.5">
            {shelf.shelfTypeName}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex items-center text-[12px] text-slate-500 whitespace-nowrap">
              <span className="font-medium">
                {shelf.width}×{shelf.height}×{shelf.depth}
              </span>
            </div>

            <span className="w-1 h-1 rounded-full bg-slate-300"></span>

            <div className="flex items-center gap-1 text-[12px]">
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              <span className="font-semibold text-slate-700">
                {shelf.totalLevels} tầng
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Đối soát số lượng */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="text-center min-w-[30px]">
          <p className="text-[8px] text-slate-400 uppercase font-bold">Giao</p>
          <p className="text-xs font-bold text-slate-600">
            {shelf.expectedQuantity}
          </p>
        </div>
        <div className="h-4 w-px bg-slate-200" />
        <div className="text-center min-w-[30px]">
          <p className="text-[8px] text-emerald-600 uppercase font-bold">
            Nhận
          </p>
          <p className="text-xs font-black text-emerald-600">
            {shelf.receivedQuantity}
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(ShipmentDetailSection);
