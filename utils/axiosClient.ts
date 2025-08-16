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

export const axiosClient = axios.create({
  withCredentials: true,
});

// REQUEST INTERCEPTORS
axiosClient.interceptors.request.use((request) => {
  const accessToken = getItem(KEY_ACCESS_TOKEN);
  request.headers["Authorization"] = `Bearer ${accessToken}`;
  return request;
});

// RESPONSE INTERCEPTORS
axiosClient.interceptors.response.use(
  async (response: AxiosResponse) => {
    const data = response.data;

    if (data.status === "ok") {
      return response;
    }

    const originalRequest = response.config as AxiosRequestConfig & {
      _retry?: boolean;
    };
    const statusCode = data.statusCode;
    const error = data.result;

    if (statusCode !== 401) {
      store.dispatch(
        showToast({
          type: TOAST_FAILURE,
          message: error,
        })
      );
    }

    //means the access token expired
    if (statusCode === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const response = await axios
        .create({
          withCredentials: true,
        })
        .get(`/api/auth?type=refreshToken`);

      if (response.data.status === "ok") {
        const newAccessToken = response.data.result.accessToken;

        setItem(KEY_ACCESS_TOKEN, newAccessToken);
        originalRequest.headers![
          "Authorization"
        ] = `Bearer ${response.data.result.accessToken}`;

        return axios(originalRequest);
      } else {
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

    return Promise.reject(error);
  },
  async (error) => {
    console.log("error last", error);

    store.dispatch({
      type: TOAST_FAILURE,
      message: error.message,
    });

    return Promise.reject(error);
  }
);
