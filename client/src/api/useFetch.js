import axios from "axios";
import fakeApi from "@/api/fakeApi"

const apiURL = process.env.VUE_APP_API
const useFakeApi = apiURL === 'fakeApi'
const api = axios.create({
  baseURL: process.env.VUE_APP_API,
});
/*
api.interceptors.request.use(
  async (config) => {
    config.header = config.headers;
    if (localStorage.getItem("token")) {
      config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(function (response) {
  return response;
});
*/
export const useFetch = useFakeApi ? fakeApi : api
