import fetch, { Response } from 'node-fetch';
import { ApiError } from './types';
import { TindurResources } from './resources';

export * from './types';

export interface ClientOptions {
  baseUrl?: string;
  timeout?: number;
}

export class TindurClient {
  protected apiKey: string;
  protected baseUrl: string;
  protected timeout: number;

  constructor(apiKey: string, options: ClientOptions = {}) {
    this.apiKey = apiKey;
    this.baseUrl = options.baseUrl || 'https://api.tindur.com/v1';
    this.timeout = options.timeout || 10000;
  }

  public setApiKey(key: string): void {
    this.apiKey = key;
  }

  protected async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    body?: unknown,
    retries: number = 3
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || `Request failed with status ${response.status}`,
          status: response.status,
          code: errorData.code,
        } as ApiError;
      }

      if (response.status === 204) return {} as T;
      return await response.json() as T;

    } catch (error: any) {
      clearTimeout(timer);

      if (retries > 0 && (error.status >= 500 || error.name === 'AbortError')) {
        const delay = Math.pow(2, 3 - retries) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.request(method, path, body, retries - 1);
      }

      throw error;
    }
  }

  // Helper methods for resources
  protected get<T>(path: string): Promise<T> { return this.request<T>('GET', path); }
  protected post<T>(path: string, body: unknown): Promise<T> { return this.request<T>('POST', path, body); }
  protected put<T>(path: string, body: unknown): Promise<T> { return this.request<T>('PUT', path, body); }
  protected del<T>(path: string): Promise<T> { return this.request<T>('DELETE', path); }
}

export class TindurResources extends TindurClient {
  public organizations = {
    get: () => this.get<Organization>('/organizations'),
    update: (id: string, data: Partial<Organization>) => this.put<Organization>(`/organizations/${id}`, data),
  };

  public experiences = {
    list: (params?: Record<string, any>) => this.get<Experience[]>(`/experiences${params? '?' + new URLSearchParams(params).toString() : ''}`),
    create: (data: Partial<Experience>) => this.post<Experience>('/experiences', data),
    get: (id: string) => this.get<Experience>(`/experiences/${id}`),
    update: (id: string, data: Partial<Experience>) => this.put<Experience>(`/experiences/${id}`, data),
    delete: (id: string) => this.del<void>(`/experiences/${id}`),
  };

  public schedules = {
    list: (params?: Record<string, any>) => this.get<Schedule[]>(`/schedules${params? '?' + new URLSearchParams(params).toString() : ''}`),
    update: (id: string, data: Partial<Schedule>) => this.put<Schedule>(`/schedules/${id}`, data),
  };

  public bookings = {
    list: (params?: Record<string, any>) => this.get<Booking[]>(`/bookings${params? '?' + new URLSearchParams(params).toString() : ''}`),
    get: (id: string) => this.get<Booking>(`/bookings/${id}`),
    cancel: (id: string) => this.post<Booking>(`/bookings/${id}/cancel`),
  };

  public payments = {
    list: (params?: Record<string, any>) => this.get<Payment[]>(`/payments${params? '?' + new URLSearchParams(params).toString() : ''}`),
  };

  public payouts = {
    list: () => this.get<Payout[]>(`/payouts'),
  };

  public apiKeys = {
    list: () => this.get<ApiKey[]>('/api-keys'),
    create: (data: { name: string }) => this.post<ApiKey>('/api-keys', data),
    revoke: (id: string) => this.del<void>(`/api-keys/${id}`),
  };
}

export const tindur = new TindurResources('');