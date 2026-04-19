import {
  RefillRequestProductColor,
  RefillShelfRequestItem,
  ShipmentAssign,
} from "@/src/types";
import {
  Calendar,
  ClipboardList,
  Layers,
  Package,
  UserCheck,
  Warehouse,
} from "lucide-react";
import ShipInfoItem from "./ShipInfoItem";
import { formatShipmentAssignStatusText } from "@/src/utils/formatStatus";
import { formatColorNameToVN, formatDateTime } from "@/src/utils/format";
import EmptySection from "./EmptySection";
import { memo } from "react";
import Image from "next/image";

interface ShipmentAssignDetailSectionProps {
  shipmentAssignments: ShipmentAssign[] | [];
}

function ShipmentAssignDetailSection({
  shipmentAssignments,
}: ShipmentAssignDetailSectionProps) {
  const hasData = shipmentAssignments && shipmentAssignments.length > 0;
  return (
    <section>
      <div className="flex items-center gap-2 mb-4 text-primary font-bold uppercase text-xs tracking-wider">
        <Warehouse className="h-4 w-4" /> 2. Điều phối & Kho hàng
      </div>
      {hasData ? (
        <div className="space-y-4">
          {shipmentAssignments.map((assignment, index) => (
            <div
              key={assignment.id || index}
              className="bg-white rounded-xl border border-blue-100 overflow-hidden shadow-sm"
            >
              {/* Header nhỏ để phân biệt các phiếu nếu có nhiều kho */}
              <div className="bg-blue-50/50 px-4 py-2 border-b border-blue-100 flex justify-between items-center">
                <span className="text-[11px] font-bold text-blue-600 uppercase flex items-center gap-1">
                  <ClipboardList className="h-3 w-3" /> Phiếu điều phối #
                  {index + 1}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  ID: {assignment.id?.slice(-8).toUpperCase()}
                </span>
              </div>

              {/*Thông tin kho */}
              <div className="grid grid-cols-2 gap-4 p-4">
                <ShipInfoItem
                  label="Quản trị viên duyệt đơn"
                  value={assignment.createdByName}
                  icon={<UserCheck className="h-3 w-3" />}
                />
                <ShipInfoItem
                  label="Kho xuất hàng"
                  value={assignment.warehouseLocationName}
                  icon={<Warehouse className="h-3 w-3" />}
                />
                <ShipInfoItem
                  label="Quản lý kho điều phối"
                  value={assignment.assignedByName}
                  icon={<UserCheck className="h-3 w-3" />}
                />
                <ShipInfoItem
                  label="Nhân viên giao hàng"
                  value={assignment.shipperName}
                  icon={<UserCheck className="h-3 w-3" />}
                />
                <ShipInfoItem
                  label="Trạng thái từ kho"
                  value={formatShipmentAssignStatusText(assignment.status)}
                  isStatus
                />
                <ShipInfoItem
                  label="Ngày phản hồi"
                  value={
                    assignment.respondedAt
                      ? formatDateTime(assignment.respondedAt).full
                      : "---"
                  }
                  icon={<Calendar className="h-3 w-3" />}
                />
              </div>
              {/*Sản phẩm điều phối */}
              <div className="px-4 pb-4">
                <div className="bg-slate-50 rounded-lg border border-slate-100 overflow-hidden">
                  <table className="w-full text-[11px]">
                    <thead className="bg-slate-100/50 text-slate-500 font-bold uppercase">
                      <tr>
                        <th className="px-3 py-2 text-left">Sản phẩm</th>
                        <th className="px-3 py-2 text-right">Số lượng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {assignment?.productItems?.length > 0 &&
                        assignment?.productItems?.map((product, index) => (
                          <ProductItem product={product} key={index} />
                        ))}
                      {assignment?.shelfItems?.length > 0 &&
                        assignment?.shelfItems?.map((shelf, index) => (
                          <ShelfItem shelf={shelf} key={index} />
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptySection message="Chưa được điều phối kho hàng" />
      )}
    </section>
  );
}

const ProductItem = ({ product }: { product: RefillRequestProductColor }) => {
  return (
    <tr
      key={product.productColorId}
      className="hover:bg-slate-100/30 transition-colors border-b border-slate-50 last:border-0"
    >
      <td className="px-3 py-2 flex items-center gap-3">
        {/* Thumbnail sản phẩm */}
        <div className="h-10 w-10 rounded-md border bg-white flex-shrink-0 overflow-hidden relative shadow-sm">
          {product?.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.productName || ""}
              fill
              className="object-cover"
              sizes="40px"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-slate-50">
              <Package className="h-4 w-4 text-slate-300" />
            </div>
          )}
        </div>
        {/* Thông tin Text */}
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-slate-700 text-[11px] line-clamp-2 leading-tight">
            {product.productName}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-1 rounded">
              {product.sku}
            </span>
            <span className="text-[11px] text-slate-600">
              {formatColorNameToVN(product?.color || "")}
            </span>
          </div>
        </div>
      </td>

      <td className="px-3 py-2 text-right w-[100px]">
        <span className="inline-flex items-center justify-center bg-violet-100 text-violet-700 font-bold px-2 py-0.5 rounded text-[11px] min-w-[28px]">
          {product.quantity}
        </span>
      </td>
    </tr>
  );
};

const ShelfItem = ({ shelf }: { shelf: RefillShelfRequestItem }) => {
  return (
    <tr
      key={shelf.shelfTypeId}
      className="hover:bg-slate-100/30 transition-colors border-b border-slate-50 last:border-0"
    >
      <td className="px-3 py-2 flex items-center gap-3">
        {/* Thumbnail sản phẩm */}
        <div className="h-10 w-10 rounded-md border bg-white flex-shrink-0 overflow-hidden relative shadow-sm">
          {shelf?.imageUrl ? (
            <Image
              src={shelf?.imageUrl || ""}
              alt={shelf?.shelfTypeName || ""}
              fill
              className="object-cover"
              sizes="40px"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-slate-50">
              <Package className="h-4 w-4 text-slate-300" />
            </div>
          )}
        </div>
        {/* Thông tin Text */}
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-slate-700 text-[11px] line-clamp-2 leading-tight">
            {shelf?.shelfTypeName || "N/A"}
          </span>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex items-center text-[12px] text-slate-500 whitespace-nowrap">
              <span className="font-medium">
                {shelf?.width || 0}×{shelf?.height || 0}×{shelf?.depth || 0}
              </span>
            </div>

            <span className="w-1 h-1 rounded-full bg-slate-300"></span>

            <div className="flex items-center gap-1 text-[12px]">
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              <span className="font-semibold text-slate-700">
                {shelf?.totalLevels || 0} tầng
              </span>
            </div>
          </div>
        </div>
      </td>

      <td className="px-3 py-2 text-right w-[100px]">
        <span className="inline-flex items-center justify-center bg-violet-100 text-violet-700 font-bold px-2 py-0.5 rounded text-[11px] min-w-[28px]">
          {shelf?.quantity || 0}
        </span>
      </td>
    </tr>
  );
};

export default memo(ShipmentAssignDetailSection);
