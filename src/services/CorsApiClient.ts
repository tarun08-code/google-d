/**
 * CORS-enabled API utility for making HTTP requests
 * Handles CORS headers and provides consistent API calling interface
 */

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Cache-Control': 'no-cache',
} as const;

interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: any;
  token?: string;
  useProxy?: boolean;
}

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
  success: boolean;
}

class CorsApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  }

  /**
   * Get CORS-compatible headers
   */
  private getCorsHeaders(options?: ApiRequestOptions): HeadersInit {
    const headers: Record<string, string> = {
      ...DEFAULT_HEADERS,
      'Origin': window.location.origin,
      'X-Requested-With': 'XMLHttpRequest',
    };

    // Add authorization header if token is provided
    if (options?.token) {
      headers['Authorization'] = `Bearer ${options.token}`;
    }

    // Merge with custom headers
    if (options?.headers) {
      Object.assign(headers, options.headers);
    }

    return headers;
  }

  /**
   * Build complete URL
   */
  private buildUrl(endpoint: string, useProxy = false): string {
    if (useProxy) {
      // Use Vite proxy for development
      return `/api${endpoint}`;
    }
    
    // Direct API call
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.baseUrl}${cleanEndpoint}`;
  }

  /**
   * Handle CORS preflight and make the actual request
   */
  private async makeRequest<T>(
    url: string,
    options: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      // Make the actual request
      const response = await fetch(url, {
        ...options,
        mode: 'cors', // Explicitly enable CORS
        credentials: 'include', // Include cookies for authentication
      });

      const isJsonResponse = response.headers
        .get('content-type')
        ?.includes('application/json');

      let data: T | undefined;
      let error: string | undefined;

      if (isJsonResponse) {
        const jsonData = await response.json();
        if (response.ok) {
          data = jsonData;
        } else {
          error = jsonData.message || jsonData.error || `HTTP ${response.status}`;
        }
      } else {
        const textData = await response.text();
        if (response.ok) {
          data = textData as unknown as T;
        } else {
          error = textData || `HTTP ${response.status}`;
        }
      }

      return {
        data,
        error,
        status: response.status,
        success: response.ok,
      };
    } catch (fetchError: any) {
      console.error('CORS API Request failed:', fetchError);
      
      return {
        error: fetchError.message || 'Network error occurred',
        status: 0,
        success: false,
      };
    }
  }

  /**
   * GET request with CORS support
   */
  async get<T>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options?.useProxy);
    const headers = this.getCorsHeaders(options);

    return this.makeRequest<T>(url, {
      method: 'GET',
      headers,
      ...options,
    });
  }

  /**
   * POST request with CORS support
   */
  async post<T>(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options?.useProxy);
    const headers = this.getCorsHeaders(options);

    return this.makeRequest<T>(url, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  /**
   * PUT request with CORS support
   */
  async put<T>(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options?.useProxy);
    const headers = this.getCorsHeaders(options);

    return this.makeRequest<T>(url, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  /**
   * DELETE request with CORS support
   */
  async delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options?.useProxy);
    const headers = this.getCorsHeaders(options);

    return this.makeRequest<T>(url, {
      method: 'DELETE',
      headers,
      ...options,
    });
  }

  /**
   * PATCH request with CORS support
   */
  async patch<T>(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options?.useProxy);
    const headers = this.getCorsHeaders(options);

    return this.makeRequest<T>(url, {
      method: 'PATCH',
      headers,
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  /**
   * Upload file with CORS support
   */
  async upload<T>(endpoint: string, formData: FormData, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options?.useProxy);
    
    // Don't set Content-Type for FormData, let browser set it with boundary
    const headers = this.getCorsHeaders(options);
    delete (headers as any)['Content-Type'];

    return this.makeRequest<T>(url, {
      method: 'POST',
      headers,
      body: formData,
      ...options,
    });
  }

  /**
   * Check if API is reachable (CORS preflight check)
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get('/health');
      return response.success;
    } catch {
      // Try alternative health check endpoints
      const endpoints = ['/api/health', '/status', '/ping'];
      
      for (const endpoint of endpoints) {
        try {
          const response = await this.get(endpoint);
          if (response.success) return true;
        } catch {
          continue;
        }
      }
      
      return false;
    }
  }
}

// Export singleton instance
export const corsApiClient = new CorsApiClient();

// Export types for external usage
export type { ApiResponse, ApiRequestOptions };
export default corsApiClient;