export const formatUserStatusText = (status: boolean) => {
  switch (status) {
    case false:
      return "Inactive";
    case true:
      return "Active";
    // case "BANNED":
    //   return "Banned";
  }
};

export const formatUserStatusColor = (status: boolean) => {
  switch (status) {
    case false:
      return "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-2xl";
    case true:
      return "bg-green-100 text-green-800 px-3 py-1 rounded-2xl";
    // case "BANNED":
    //   return "bg-red-100 text-red-800 px-3 py-1 rounded-2xl";
  }
};

export const formatStoreStatusText = (isActive: boolean) => {
  switch (isActive) {
    case false:
      return "Inactive";
    case true:
      return "Active";
  }
};

export const formatStoreStatusColor = (isActive: boolean) => {
  switch (isActive) {
    case false:
      return "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-2xl";
    case true:
      return "bg-green-100 text-green-800 px-3 py-1 rounded-2xl";
  }
};

export const formatCabinetStatusText = (isActive: boolean) => {
  switch (isActive) {
    case false:
      return "Inactive";
    case true:
      return "Active";
  }
};

export const formatCabinetStatusColor = (status: string) => {
  switch (status) {
    case "MAINTENANCE":
      return "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-2xl";
    case "AVAILABLE":
      return "bg-green-100 text-green-800 px-3 py-1 rounded-2xl";
    case "CLOSED":
      return "bg-red-100 text-red-800 px-3 py-1 rounded-2xl";
  }
};
