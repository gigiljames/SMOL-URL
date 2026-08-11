import { ROUTES } from "../constants/routes";
import { axiosInstance, type ResponseType } from "./axios";

export interface UrlItem {
  id: string;
  title: string;
  url: string;
  shortCode: string;
  createdAt: string;
  updatedAt: string;
}

export const getUrls = async (
  search?: string
): Promise<ResponseType<UrlItem[]>> => {
  const url = search ? `${ROUTES.URL.FETCH}?search=${encodeURIComponent(search)}` : ROUTES.URL.FETCH;
  const response = await axiosInstance.get<ResponseType<UrlItem[]>>(url);
  return response.data;
};

export const createShortUrl = async (
  url: string,
  title?: string
): Promise<ResponseType<UrlItem>> => {
  const response = await axiosInstance.post<ResponseType<UrlItem>>(
    ROUTES.URL.CREATE,
    { url, title }
  );
  return response.data;
};

export const updateUrlTitle = async (
  id: string,
  title: string
): Promise<ResponseType<UrlItem>> => {
  const response = await axiosInstance.patch<ResponseType<UrlItem>>(
    ROUTES.URL.UPDATE(id),
    { title }
  );
  return response.data;
};

export const deleteShortUrl = async (
  id: string
): Promise<ResponseType<{ message: string }>> => {
  const response = await axiosInstance.delete<ResponseType<{ message: string }>>(
    ROUTES.URL.DELETE(id)
  );
  return response.data;
};
