import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export class StrApiHelper {
  private readonly baseUrl?: string;
  //private readonly axiosRequestConfig?: AxiosRequestConfig;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axios.get<T>(`${this.baseUrl}/${url}`, config).catch((error) => error.response);

    if (response.status == 200) {
      return response.data;
    }
    throw new Error((response.data.error.message as string));
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await axios.post<T>(`${this.baseUrl}/${url}`, { data: data }, config).catch((error) => error.response);
    
    if (response.status == 200) {
      return response.data;
    }
    throw new Error(response.data.error.message as string);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await axios.put<T>(`${this.baseUrl}/${url}`, data, config).catch((error) => error.response);
    if (response.status == 200) {
      return response.data;
    }
    throw new Error((response.data.error.message as string));
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axios.delete<T>(`${this.baseUrl}/${url}`, config).catch((error) => error.response);
    if (response.status == 200) {
      return response.data;
    }
    throw new Error((response.data.error.message as string));
  }
}
