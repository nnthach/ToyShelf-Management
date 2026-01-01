import { ProductStatus } from "../enums/product-status.enum";
import { UserStatus } from "../enums/user-status.enum";

export const USER_STATUS_OPTIONS = [
  { label: "VERIFIED", value: UserStatus.VERIFIED },
  { label: "PENDING_VERIFICATION", value: UserStatus.PENDING_VERIFICATION },
  { label: "INACTIVE", value: UserStatus.INACTIVE },
];
