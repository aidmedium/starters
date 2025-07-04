import { HttpTypes } from "@medusajs/types";

import { sdk } from "@/lib/config";
import medusaError from "@/lib/utils/medusa-error";

import { getAuthHeaders } from "./cookies";

export const retrieveOrder = async (id: string, request?: Request) => {
  const headers = {
    ...getAuthHeaders(request),
  };

  return sdk.client
    .fetch<HttpTypes.StoreOrderResponse>(`/store/orders/${id}`, {
      method: "GET",
      query: {
        fields:
          "*payment_collections.payments,*items,*items.metadata,*items.variant,*items.product",
      },
      headers,
    })
    .then(({ order }) => order)
    .catch((err) => medusaError(err));
};

export const listOrders = async (
  limit: number = 10,
  offset: number = 0,
  filters?: Record<string, any>,
  request?: Request
) => {
  const headers = {
    ...getAuthHeaders(request),
  };

  return sdk.client
    .fetch<HttpTypes.StoreOrderListResponse>(`/store/orders`, {
      method: "GET",
      query: {
        limit,
        offset,
        order: "-created_at",
        fields: "*items,+items.metadata,*items.variant,*items.product",
        ...filters,
      },
      headers,
    })
    .then(({ orders }) => orders)
    .catch((err) => medusaError(err));
};

export const createTransferRequest = async (
  formData: FormData,
  request?: Request
): Promise<{
  success: boolean;
  error: string | null;
  order: HttpTypes.StoreOrder | null;
}> => {
  const id = formData.get("order_id") as string;

  if (!id) {
    return { success: false, error: "Order ID is required", order: null };
  }

  const headers = getAuthHeaders(request);

  return await sdk.store.order
    .requestTransfer(
      id,
      {},
      {
        fields: "id, email",
      },
      headers
    )
    .then(({ order }) => ({ success: true, error: null, order }))
    .catch((err) => ({ success: false, error: err.message, order: null }));
};

export const acceptTransferRequest = async (id: string, token: string, request?: Request) => {
  const headers = getAuthHeaders(request);

  return await sdk.store.order
    .acceptTransfer(id, { token }, {}, headers)
    .then(({ order }) => ({ success: true, error: null, order }))
    .catch((err) => ({ success: false, error: err.message, order: null }));
};

export const declineTransferRequest = async (id: string, token: string, request?: Request) => {
  const headers = getAuthHeaders(request);

  return await sdk.store.order
    .declineTransfer(id, { token }, {}, headers)
    .then(({ order }) => ({ success: true, error: null, order }))
    .catch((err) => ({ success: false, error: err.message, order: null }));
};
