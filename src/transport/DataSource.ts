import config from './config.json';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance } from 'axios';

export interface DataSourceResponse extends AxiosResponse {}

export interface DataSourceError extends AxiosError {}

export interface DataSourceOptions {
  baseUrl: string;
}

export interface DataSourceRequestConfig extends AxiosRequestConfig {
  onStart?: () => void;
  onSuccess?: (response: DataSourceResponse) => void;
  onError?: (error: DataSourceError) => void;
  onFinally?: () => void;
}

class DataSource {
  private baseUrl: string;
  private client: AxiosInstance;

  constructor(options: DataSourceOptions) {
    this.baseUrl = options.baseUrl;
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000
    });

  }

  get(config: AxiosRequestConfig, options?: DataSourceRequestConfig) {
    options && options.onStart && options.onStart();
    return this.client
      .request(config)
      .then((response: DataSourceResponse) => {
        options && options.onSuccess && options.onSuccess(response);
      })
      .catch((error: DataSourceError) => {
        options && options.onError && options.onError(error);
      })
      .then(() => {
        options && options.onFinally && options.onFinally();
      });
  }
}

// fake singleton
export default new DataSource({
  baseUrl: config.baseUrl
});