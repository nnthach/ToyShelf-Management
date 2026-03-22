import { RefillRequest } from "@/src/types";
import { MapPin, Store, User } from "lucide-react";
import ShipInfoItem from "./ShipInfoItem";
import { memo } from "react";

interface StoreOrderDetailSectionProps {
  storeOrderDetail: RefillRequest | undefined;
}

function StoreOrderDetailSection({
  storeOrderDetail,
}: StoreOrderDetailSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4 text-primary font-bold uppercase text-xs tracking-wider">
        <Store className="h-4 w-4" /> 1. Thông tin yêu cầu từ cửa hàng
      </div>
      <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl border border-dashed">
        <ShipInfoItem
          label="Cửa hàng"
          value={storeOrderDetail?.storeName}
          icon={<Store className="h-3 w-3" />}
        />
        <ShipInfoItem
          label="Người yêu cầu"
          value={storeOrderDetail?.requestName}
          icon={<User className="h-3 w-3" />}
        />
        <div className="col-span-2">
          <ShipInfoItem
            label="Địa chỉ nhận hàng"
            value={storeOrderDetail?.storeAddress}
            icon={<MapPin className="h-3 w-3" />}
          />
        </div>
      </div>
    </section>
  );
}

export default memo(StoreOrderDetailSection);
