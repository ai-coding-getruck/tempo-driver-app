import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { injectable } from "inversify";

@injectable()
export class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      timeout: 30000, // Default timeout of 30 seconds
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Configure the API client with base URL and other options
   * @param config Configuration options for the API client
   */
  configure(config: AxiosRequestConfig): void {
    this.client = axios.create({
      ...config,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
    });
  }

  /**
   * Add request interceptor with callback function
   * @param callback Function to be called before each request
   */
  addRequestInterceptor(
    callback: (
      config: InternalAxiosRequestConfig,
    ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>,
  ): number {
    return this.client.interceptors.request.use(callback);
  }

  /**
   * Add response interceptor with callback functions
   * @param onFulfilled Function to be called when response is successful
   * @param onRejected Function to be called when response fails
   */
  addResponseInterceptor(
    onFulfilled?: (
      response: AxiosResponse,
    ) => AxiosResponse | Promise<AxiosResponse>,
    onRejected?: (error: any) => any,
  ): number {
    return this.client.interceptors.response.use(onFulfilled, onRejected);
  }

  /**
   * Remove a previously added interceptor
   * @param id The ID of the interceptor to remove
   * @param type The type of interceptor ('request' or 'response')
   */
  removeInterceptor(id: number, type: "request" | "response"): void {
    if (type === "request") {
      this.client.interceptors.request.eject(id);
    } else {
      this.client.interceptors.response.eject(id);
    }
  }

  /**
   * Perform a GET request
   * @param url The URL to request
   * @param config Optional request configuration
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  /**
   * Perform a POST request
   * @param url The URL to request
   * @param data The data to send
   * @param config Optional request configuration
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  /**
   * Perform a PUT request
   * @param url The URL to request
   * @param data The data to send
   * @param config Optional request configuration
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  /**
   * Perform a PATCH request
   * @param url The URL to request
   * @param data The data to send
   * @param config Optional request configuration
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * Perform a DELETE request
   * @param url The URL to request
   * @param config Optional request configuration
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}
