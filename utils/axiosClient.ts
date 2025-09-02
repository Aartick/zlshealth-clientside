import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  KEY_ACCESS_TOKEN,
  getItem,
  removeItem,
  setItem,
} from "./localStorageManager";
import { TOAST_FAILURE } from "@/components/global/ToastHandler";
import { showToast } from "@/lib/features/appConfigSlice";
import { store } from "@/lib/store";

/**
 * @constant axiosClient
 * @description Axios instance configured with interceptors for
 *              handling authentication and error reponses.
 */
export const axiosClient = axios.create({
  withCredentials: true, // Ensures cookies are sent with requests
});

/**
 *  REQUEST INTERCEPTORS
 * @description - Attaches Authorization header with Bearer access token for every request
 *  */
axiosClient.interceptors.request.use((request) => {
  const accessToken = getItem(KEY_ACCESS_TOKEN);
  request.headers["Authorization"] = `Bearer ${accessToken}`;
  return request;
});

/**
 *  RESPONSE INTERCEPTORS
 * - Handles API responses
 * - Shows toast notifications on errors
 * - Refreshes expired access tokens automatically
 * */
axiosClient.interceptors.response.use(
  async (response: AxiosResponse) => {
    const data = response.data;

    // If status is "ok", return response as-is
    if (data.status === "ok") {
      return response;
    }

    // Extract error info
    const originalRequest = response.config as AxiosRequestConfig & {
      _retry?: boolean;
    };
    const statusCode = data.statusCode;
    const error = data.result;

    // If error is not 401 (unauthorized), show a toast
    if (statusCode !== 401) {
      store.dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: error,
        })
      );
    }

    // Handle expired access token (401 error)
    if (statusCode === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite loop

      // Request new access token using refresh token
      const response = await axios
        .create({
          withCredentials: true,
        })
        .get(`/api/auth?type=refreshToken`);

      // Refresh Successful -> retry original request
      if (response.data.status === "ok") {
        const newAccessToken = response.data.result.accessToken;

        setItem(KEY_ACCESS_TOKEN, newAccessToken);
        originalRequest.headers![
          "Authorization"
        ] = `Bearer ${response.data.result.accessToken}`;

        return axios(originalRequest);
      }
      // Refresh failed -> clear tokens and redirect to login
      else {
        store.dispatch(
          showToast({
            type: TOAST_FAILURE,
            message: "Token expired",
          })
        );
        removeItem(KEY_ACCESS_TOKEN);
        window.location.replace(`/login`);
        return Promise.reject(error);
      }
    }
    // Reject other errors
    return Promise.reject(error);
  },
  async (error) => {
    console.log("error last", error);

    // Show toast for unexpected network errors
    store.dispatch({
      type: TOAST_FAILURE,
      message: error.message,
    });

    return Promise.reject(error);
  }
);
