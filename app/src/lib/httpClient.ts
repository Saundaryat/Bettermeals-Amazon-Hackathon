import { backendUrl } from "@/config";

interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
  _isRetry?: boolean; // Internal flag to prevent infinite loops
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

class HttpClient {
  private baseUrl: string;
  private refreshCallback: (() => Promise<string | null>) | null = null;

  constructor(baseUrl: string = backendUrl) {
    this.baseUrl = baseUrl;
  }

  // Method to register the refresh callback
  setRefreshCallback(callback: () => Promise<string | null>) {
    this.refreshCallback = callback;
  }

  private async handleResponse<T>(response: Response, originalRequest?: () => Promise<ApiResponse<T>>, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const { requireAuth = false, _isRetry = false } = options;

    try {
      // Handle 401 Unauthorized with Auto-Refresh
      // Only attempt refresh if:
      // 1. It's a 401
      // 2. Auth is required
      // 3. We have a refresh callback
      // 4. We have the original request to retry
      // 5. This is NOT already a retry (prevents infinite loops)
      if (response.status === 401 && requireAuth && this.refreshCallback && originalRequest && !_isRetry) {
        try {
          const refreshResult = await this.refreshCallback();
          if (refreshResult) {
            return await originalRequest();
          } else {
            console.error('Session refresh failed.');
          }
        } catch (refreshError) {
          console.error('Error during session refresh:', refreshError);
        }
      }

      // Check if response has content to parse
      const contentType = response.headers.get('content-type');
      const hasJsonContent = contentType && contentType.includes('application/json');
      const isHtmlContent = contentType && contentType.includes('text/html');

      let data;
      if (hasJsonContent) {
        const text = await response.text();
        if (text.trim()) {
          try {
            data = JSON.parse(text);
          } catch (parseError) {
            console.error('Failed to parse JSON response:', parseError);
            return {
              success: false,
              error: 'Invalid response from server',
            };
          }
        } else {
          // Empty response body
          data = {};
        }
      } else {
        // Non-JSON response - ignore HTML content (like 404 pages)
        if (isHtmlContent) {
          // Don't extract message from HTML error pages
          data = {};
        } else {
          const text = await response.text();
          data = text ? { message: text } : {};
        }
      }

      if (!response.ok) {
        // For HTML error responses, use status code-based messages
        if (isHtmlContent) {
          let errorMessage: string;
          switch (response.status) {
            case 400:
              errorMessage = 'Please check your information and try again';
              break;
            case 401:
              errorMessage = 'Authentication failed. Please try again';
              break;
            case 403:
              errorMessage = 'You do not have permission to perform this action';
              break;
            case 404:
              errorMessage = 'The requested resource was not found. Please check your connection or try again later.';
              break;
            case 409:
              errorMessage = 'This email is already registered';
              break;
            case 422:
              errorMessage = 'Please check your information and try again';
              break;
            case 500:
              errorMessage = 'Server error. Please try again later';
              break;
            default:
              errorMessage = 'Something went wrong. Please try again';
          }
          return {
            success: false,
            error: errorMessage,
          };
        }

        // Try to get a user-friendly error message from the response
        let errorMessage = data.error || data.message || data.detail;

        // If no specific error message, provide generic ones based on status code
        if (!errorMessage) {
          switch (response.status) {
            case 400:
              errorMessage = 'Please check your information and try again';
              break;
            case 401:
              errorMessage = 'Authentication failed. Please try again';
              break;
            case 403:
              errorMessage = 'You do not have permission to perform this action';
              break;
            case 404:
              errorMessage = 'The requested resource was not found';
              break;
            case 409:
              errorMessage = 'This email is already registered';
              break;
            case 422:
              errorMessage = 'Please check your information and try again';
              break;
            case 500:
              errorMessage = 'Server error. Please try again later';
              break;
            default:
              errorMessage = 'Something went wrong. Please try again';
          }
        }

        return {
          success: false,
          error: errorMessage,
        };
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      console.error('Error handling response:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error. Please check your connection and try again',
      };
    }
  }

  async get<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { requireAuth = false, _isRetry = false, ...fetchOptions } = options;

    try {
      const fullUrl = `${this.baseUrl}${endpoint}`;
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
        credentials: 'include', // Browser automatically sends HttpOnly cookies
        ...fetchOptions,
      });

      return this.handleResponse<T>(
        response,
        () => this.get<T>(endpoint, { ...options, _isRetry: true }),
        options
      );
    } catch (error) {
      console.error('HTTP request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  async post<T = any>(
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { requireAuth = false, _isRetry = false, ...fetchOptions } = options;

    try {
      const fullUrl = `${this.baseUrl}${endpoint}`;

      // Handle headers: if data is FormData, let the browser set the Content-Type with boundary
      const headers: Record<string, string> = { ...fetchOptions.headers as Record<string, string> };
      if (!(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers,
        body: data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined),
        credentials: 'include', // Browser automatically sends HttpOnly cookies
        ...fetchOptions,
      });

      return this.handleResponse<T>(
        response,
        () => this.post<T>(endpoint, data, { ...options, _isRetry: true }),
        options
      );
    } catch (error) {
      console.error('POST request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  async put<T = any>(
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { requireAuth = false, _isRetry = false, ...fetchOptions } = options;

    try {
      const fullUrl = `${this.baseUrl}${endpoint}`;

      // Handle headers: if data is FormData, let the browser set the Content-Type with boundary
      const headers: Record<string, string> = { ...fetchOptions.headers as Record<string, string> };
      if (!(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(fullUrl, {
        method: 'PUT',
        headers,
        body: data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined),
        credentials: 'include', // Browser automatically sends HttpOnly cookies
        ...fetchOptions,
      });

      return this.handleResponse<T>(
        response,
        () => this.put<T>(endpoint, data, { ...options, _isRetry: true }),
        options
      );
    } catch (error) {
      console.error('PUT request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  async delete<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { requireAuth = false, _isRetry = false, ...fetchOptions } = options;

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
        credentials: 'include', // Browser automatically sends HttpOnly cookies
        ...fetchOptions,
      });

      return this.handleResponse<T>(
        response,
        () => this.delete<T>(endpoint, { ...options, _isRetry: true }),
        options
      );
    } catch (error) {
      console.error('DELETE request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }
}

// Create a default instance
export const httpClient = new HttpClient();

// Export the class for custom instances
export { HttpClient };

// Convenience functions that use the default instance
export const api = {
  get: <T = any>(endpoint: string, options?: RequestOptions) =>
    httpClient.get<T>(endpoint, options),

  post: <T = any>(endpoint: string, data?: any, options?: RequestOptions) =>
    httpClient.post<T>(endpoint, data, options),

  put: <T = any>(endpoint: string, data?: any, options?: RequestOptions) =>
    httpClient.put<T>(endpoint, data, options),

  delete: <T = any>(endpoint: string, options?: RequestOptions) =>
    httpClient.delete<T>(endpoint, options),
};

// Hook for using the HTTP client with automatic authentication
export const useApi = () => {
  return {
    get: <T = any>(endpoint: string, requireAuth: boolean = true) =>
      api.get<T>(endpoint, { requireAuth }),

    post: <T = any>(endpoint: string, data?: any, requireAuth: boolean = true) =>
      api.post<T>(endpoint, data, { requireAuth }),

    put: <T = any>(endpoint: string, data?: any, requireAuth: boolean = true) =>
      api.put<T>(endpoint, data, { requireAuth }),

    delete: <T = any>(endpoint: string, requireAuth: boolean = true) =>
      api.delete<T>(endpoint, { requireAuth }),
  };
};
