export interface QueryParams {
  page?: number;
  limit?: number;
  status?: string | boolean;
  search?: string;
  order?: string;
  isActive?: boolean;
  partnerId?: string;
  storeId?: string;
  storeRole?: string;
  brand?: string;
  month?: number;
  year?: number;
  categoryId?: string;
  pageNumber?: number;
  pageSize?: number;
  searchItem?: string;
  keyword?: string;
  cityId?: string;
  ownerId?: string;
  companyid?: string;
  locationId?: string;
  phone?: string;
  searchName?: string;
  categoryType?: string;
}

export interface LoginRes {
  data: {
    accessToken: string;
    roles: string[];
  };
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface StatusSelectOption<T = string> {
  label: string;
  value: T;
}

export type OpenMapFeature = {
  type: "Feature";
  id: string;

  geometry: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  } | null;

  properties: {
    id: string;
    name: string;
    label: string;
    short_address: string;

    category: string[]; // ['building', 'street_address']

    housenumber?: string;
    street?: string;
    locality?: string; // phường
    county?: string; // quận
    region?: string; // tỉnh / thành phố
    country?: string;
    country_code?: string;
    continent?: string;
    zipcode?: string;

    distance?: number | null;
    has_child?: boolean;
    forcodes?: string;
    sid?: string;
    source?: string;

    opening_hours?: string | null;
    opening_hours_v2?: unknown | null;
    phone?: string | null;
    website?: string | null;
  };
};

export type PlaceDetail = {
  lat: number;
  lng: number;
  address: string;
};

export type ViewType = "week" | "month" | "year";
