export interface QueryParams {
  page?: number;
  limit?: number;
  status?: string | boolean;
  search?: string;
  order?: string;
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface StatusSelectOption<T = string> {
  label: string;
  value: T;
}
