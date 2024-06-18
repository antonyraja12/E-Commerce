import { useState } from "react";
import axios from "axios";

const useHttpClient = (baseUrl) => {
  const [error, setError] = useState(null);

  const httpClient = axios.create({
    // Add any custom configurations here, such as base URL
    baseURL: baseUrl,

    // timeout: 5000,
    // headers: { 'Authorization': 'Bearer token' }
  });

  httpClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
      setError(error);
      return Promise.reject(error);
    }
  );

  const list = async (url, filter = {}) => {
    try {
      const response = await httpClient.get(url, { params: filter });
      return response;
    } catch (error) {
      setError(error);
      return null;
    }
  };

  const retrieve = async (url, id) => {
    try {
      const response = await httpClient.get(`${url}/${id}`);
      return response;
    } catch (error) {
      setError(error);
      return null;
    }
  };

  const add = async (url, data) => {
    try {
      const response = await httpClient.post(url, data);
      return response;
    } catch (error) {
      setError(error);
      return null;
    }
  };

  const update = async (url, data, id) => {
    try {
      const response = await httpClient.put(`${url}/${id}`, data);
      return response;
    } catch (error) {
      setError(error);
      return null;
    }
  };

  const patch = async (url, data, id) => {
    try {
      const response = await httpClient.patch(`${url}/${id}`, data);
      return response;
    } catch (error) {
      setError(error);
      return null;
    }
  };

  const save = async (url, data) => {
    try {
      const response = await httpClient.post(url, data);
      return response;
    } catch (error) {
      setError(error);
      return null;
    }
  };

  const remove = async (url, id) => {
    try {
      const response = await httpClient.delete(`${url}/${id}`);
      return response;
    } catch (error) {
      setError(error);
      return null;
    }
  };

  const rearrange = async (url, id, orderNo) => {
    try {
      const response = await httpClient.put(`${url}/${id}/${orderNo}`);
      return response;
    } catch (error) {
      setError(error);
      return null;
    }
  };

  return {
    error,
    list,
    retrieve,
    add,
    update,
    patch,
    save,
    remove,
    rearrange,
  };
};

export default useHttpClient;
