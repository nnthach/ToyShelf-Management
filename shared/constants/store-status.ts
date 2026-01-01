import { ProductStatus } from "../enums/product-status.enum";
import { StoreStatus } from "../enums/store-status.enum";
import { UserStatus } from "../enums/user-status.enum";

export const STORE_STATUS_OPTIONS = [
  { label: "ACTIVE", value: StoreStatus.ACTIVE },
  { label: "CLOSED", value: StoreStatus.CLOSED },
  { label: "INACTIVE", value: StoreStatus.INACTIVE },
];
