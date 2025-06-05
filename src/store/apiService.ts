import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { type BaseQueryFn, type FetchArgs, type FetchBaseQueryError, type FetchBaseQueryMeta } from '@reduxjs/toolkit/query';

const API_BASE_URL = 'https://api.example.com';

const globalHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer your-token-here',
};

const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, object, FetchBaseQueryMeta> = async (
  args,
  api,
  extraOptions
) => {
  const result = await fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      Object.entries(globalHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });
      return headers;
    },
  })(args, api, extraOptions);

  // Xử lý lỗi 401 (Unauthorized)
  if (result.error && result.error.status === 401) {
    console.log('Unauthorized - 401 error. Implement refresh token logic here.');
    // Ví dụ: Gọi API refresh token hoặc logout user
  }

  return result;
};

export const apiService = createApi({
  baseQuery,
  endpoints: () => ({}),
  reducerPath: 'apiService',
});

export default apiService;