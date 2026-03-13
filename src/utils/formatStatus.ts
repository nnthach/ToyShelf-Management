export const formatBooleanIsActiveStatusText = (isActive: boolean) => {
  switch (isActive) {
    case false:
      return "Chưa kích hoạt";
    case true:
      return "Đã kích hoạt";
  }
};

export const formatBooleanIsActiveStatusColor = (isActive: boolean) => {
  switch (isActive) {
    case false:
      return "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-2xl";
    case true:
      return "bg-green-100 text-green-800 px-3 py-1 rounded-2xl";
  }
};


export const formatUserStatusText = (status: boolean) => {
  switch (status) {
    case false:
      return "Chưa kích hoạt";
    case true:
      return "Đã kích hoạt";
  }
};

export const formatUserStatusColor = (status: boolean) => {
  switch (status) {
    case false:
      return "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-2xl";
    case true:
      return "bg-green-100 text-green-800 px-3 py-1 rounded-2xl";
  }
};

export const formatStoreStatusText = (isActive: boolean) => {
  switch (isActive) {
    case false:
      return "Chưa kích hoạt";
    case true:
      return "Đã kích hoạt";
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

export const formatStoreInviteStatusText = (status: string) => {
  switch (status) {
    case "Pending":
      return "Đang chờ";
    case "Accepted":
      return "Đã chấp nhận";
    case "Rejected":
      return "Đã từ chối";
  }
};

export const formatStoreInviteStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-2xl";
    case "Accepted":
      return "bg-green-100 text-green-800 px-3 py-1 rounded-2xl";
    case "Rejected":
      return "bg-red-100 text-red-800 px-3 py-1 rounded-2xl";
  }
};

export const formatStoreCreateRequestStatusText = (status: string) => {
  switch (status) {
    case "Pending":
      return "Đang chờ";
    case "Approved":
      return "Đã chấp nhận";
    case "Rejected":
      return "Đã từ chối";
  }
};

export const formatStoreCreateRequestStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-2xl";
    case "Approved":
      return "bg-green-100 text-green-800 px-3 py-1 rounded-2xl";
    case "Rejected":
      return "bg-red-100 text-red-800 px-3 py-1 rounded-2xl";
  }
};
