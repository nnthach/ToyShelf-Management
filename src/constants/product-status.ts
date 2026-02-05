import { ProductStatus } from "../enums/product-status.enum";

export const PRODUCT_STATUS_OPTIONS = [
  { label: "DRAFT", value: ProductStatus.DRAFT },
  { label: "PUBLISHED", value: ProductStatus.PUBLISHED },
  { label: "OUT_OF_STOCK", value: ProductStatus.OUT_OF_STOCK },
];
