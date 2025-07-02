import { HttpTypes } from "@medusajs/types";

import { sdk } from "@/lib/config";
import { sortProducts } from "@/lib/utils/sort-products";
import type { SortOptions } from "@/lib/utils/sort-products";

import { DEFAULT_COUNTRY_CODE } from "../constants";
import { getAuthHeaders } from "./cookies";
import { getRegion, retrieveRegion } from "./regions";

type QueryParams = HttpTypes.StoreProductParams & Record<string, any>;

export const listProducts = async (
  request: Request,
  data?: {
    pageParam?: number;
    queryParams?: QueryParams;
    countryCode?: string;
    regionId?: string;
    request?: Request;
  }
): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number };
  nextPage: number | null;
  queryParams?: QueryParams;
}> => {
  const { pageParam = 1, queryParams, countryCode = DEFAULT_COUNTRY_CODE, regionId } = data ?? {};

  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required");
  }

  const limit = queryParams?.limit || 12;
  const _pageParam = Math.max(pageParam, 1);
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit;

  let region: HttpTypes.StoreRegion | undefined | null;

  if (countryCode) {
    region = await getRegion(countryCode);
  } else {
    region = await retrieveRegion(regionId!);
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    };
  }

  const headers = {
    ...getAuthHeaders(request),
  };

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(`/store/products`, {
      method: "GET",
      query: {
        limit,
        offset,
        region_id: region?.id,
        fields: "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
        ...queryParams,
      },
      headers,
    })
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null;

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      };
    });
};

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async (
  request: Request,
  data?: {
    page?: number;
    queryParams?: QueryParams;
    sortBy?: SortOptions;
    countryCode?: string;
  }
): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number };
  nextPage: number | null;
  queryParams?: QueryParams;
}> => {
  const { page = 1, queryParams, sortBy = "created_at", countryCode } = data ?? {};
  const limit = queryParams?.limit || 12;

  const {
    response: { products, count },
  } = await listProducts(request, {
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 100,
    },
    countryCode,
    request,
  });

  const sortedProducts = sortProducts(products, sortBy);

  const pageParam = (page - 1) * limit;

  const nextPage = count > pageParam + limit ? pageParam + limit : null;

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit);

  return {
    response: {
      products: paginatedProducts,
      count,
    },
    nextPage,
    queryParams,
  };
};
