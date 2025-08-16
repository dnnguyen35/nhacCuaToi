import axios from "axios";
import queryString from "query-string";
import { getStore } from "../../utils/storeUtil";

import { setUser } from "../../redux/slices/userSlice";

const baseURL = process.env.REACT_APP_API_URL;

let isRefreshing = false;
let subscribers = [];

const onTokenRefreshed = (token) => {
  subscribers.forEach((callback) => {
    callback(token);
  });
  subscribers = [];
};

const subscribeTokenRefresh = (callback) => {
  subscribers.push(callback);
};

const privateClient = axios.create({
  baseURL,
  paramsSerializer: {
    encode: (params) => queryString.stringify(params),
  },
});

privateClient.interceptors.request.use(async (config) => {
  const headers = {
    Authorization: `Bearer ${sessionStorage.getItem("actkn")}`,
  };

  if (!(config.data instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  return {
    ...config,
    headers,
  };
});

privateClient.interceptors.response.use(
  (response) => {
    if (response && response.data) return response.data;
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshToken = sessionStorage.getItem("refreshtkn");
          const response = await axios.post(
            `${baseURL}/auth/renew-accesstoken`,
            {
              refreshToken,
            }
          );

          const newAccessToken = response.data.newAccessToken;
          sessionStorage.setItem("actkn", newAccessToken);

          onTokenRefreshed(newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return privateClient(originalRequest);
        } catch (error) {
          getStore().dispatch(setUser(null));
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          originalRequest._retry = true;
          resolve(privateClient(originalRequest));
        });
      });
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default privateClient;
