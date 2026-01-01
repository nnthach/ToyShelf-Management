export const formatUserStatusText = (status: string) => {
  switch (status) {
    case "PENDING_VERIFICATION":
      return "Pending Verification";
    case "VERIFIED":
      return "Verified";
    case "BANNED":
      return "Banned";
  }
};

export const formatUserStatusColor = (status: string) => {
  switch (status) {
    case "PENDING_VERIFICATION":
      return "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-2xl";
    case "VERIFIED":
      return "bg-green-100 text-green-800 px-3 py-1 rounded-2xl";
    case "BANNED":
      return "bg-red-100 text-red-800 px-3 py-1 rounded-2xl";
  }
};

export const formatStoreStatusText = (status: string) => {
  switch (status) {
    case "INACTIVE":
      return "In Active";
    case "ACTIVE":
      return "Active";
    case "CLOSED":
      return "Closed";
  }
};

export const formatStoreStatusColor = (status: string) => {
  switch (status) {
    case "INACTIVE":
      return "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-2xl";
    case "ACTIVE":
      return "bg-green-100 text-green-800 px-3 py-1 rounded-2xl";
    case "CLOSED":
      return "bg-red-100 text-red-800 px-3 py-1 rounded-2xl";
  }
};
