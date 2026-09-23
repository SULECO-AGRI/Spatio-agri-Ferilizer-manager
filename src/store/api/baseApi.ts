import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) || "http://localhost:5000";

const AUTH_TOKEN_KEY = "spatioagri_auth_token";

/**
 * Base RTK Query API slice with automatic JWT preparation and tag declarations
 */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      if (!headers.has("Accept")) {
        headers.set("Accept", "application/json");
      }

      if (typeof window !== "undefined") {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (token && !headers.has("Authorization")) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }

      return headers;
    },
  }),
  tagTypes: ["Pilots", "Farmers", "Fields", "Requests", "Payments", "Analytics", "Profile"],
  endpoints: () => ({}),
});
