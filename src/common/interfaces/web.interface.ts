export interface IWebResponse<T> {
  status: string;
  message?: string | string[];
  data: T;
}
