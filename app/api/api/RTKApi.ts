import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { IAuthProvidersEntity } from 'oneentry/dist/auth-provider/authProvidersInterfaces';
import type { IError } from 'oneentry/dist/base/utils';
import type { IBlockEntity } from 'oneentry/dist/blocks/blocksInterfaces';
import type { IFormsEntity } from 'oneentry/dist/forms/formsInterfaces';
import type {
  IOrderByMarkerEntity,
  IOrdersEntity,
} from 'oneentry/dist/orders/ordersInterfaces';
import type { IPositionBlock } from 'oneentry/dist/pages/pagesInterfaces';
import type {
  IAccountsEntity,
  ISessionEntity,
} from 'oneentry/dist/payments/paymentsInterfaces';
import type { IProductsEntity } from 'oneentry/dist/products/productsInterfaces';
import type { IUserEntity } from 'oneentry/dist/users/usersInterfaces';

import { LanguageEnum } from '@/app/types/enum';
import type { ApiResponse } from '@/app/types/hooks';

import { api } from './api';

interface BlockByMarkerProps {
  marker: string;
  activeLang: string;
}

interface BlocksByPageUrlProps {
  pageUrl: string;
  activeLang: string;
}

interface SingleOrderProps {
  marker: string;
  id: number;
  activeLang: string;
}

// Generic function to handle API responses
const handleApiResponse = async <T>(
  apiCall: Promise<T | IError>,
): Promise<ApiResponse<T>> => {
  try {
    const result = await apiCall;
    return result;
  } catch (error) {
    return error as IError;
  }
};

/**
 * Creates basic redux logic.
 */
export const RTKApi = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery<IError>(),
  endpoints: (build) => ({
    /**
     * Get all blocks by page url.
     * @param pageUrl    - Page URL.
     * @param activeLang - Language code. Default "en_US".
     * @returns          Query result with position blocks
     */
    getBlocksByPageUrl: build.query<IPositionBlock[], BlocksByPageUrlProps>({
      queryFn: async ({ pageUrl, activeLang }) => {
        const result = await handleApiResponse(
          api.Pages.getBlocksByPageUrl(pageUrl, activeLang),
        );
        if (!result || (result as IError)?.statusCode) {
          return { error: result as IError };
        }
        return { data: result as IPositionBlock[] };
      },
    }),
    /**
     * Get Product By Id.
     * @param id - Product ID.
     * @returns  Query result with product
     */
    getProductById: build.query<IProductsEntity, { id: number }>({
      queryFn: async ({ id }) => {
        if (!id) {
          return {
            error: {
              statusCode: 400,
              message: 'Product ID is required',
            } as IError,
          };
        }
        const result = await handleApiResponse(api.Products.getProductById(id));
        if (!result || (result as IError)?.statusCode) {
          return { error: result as IError };
        }
        return { data: result as IProductsEntity };
      },
    }),
    /**
     * Get Products By Ids.
     * @param items - Array of product IDs as string.
     * @returns     Query result with products
     */
    getProductsByIds: build.query<IProductsEntity[], { items: string }>({
      queryFn: async ({ items }) => {
        if (!items || items.length < 1) {
          return { data: [] };
        }
        const result = await handleApiResponse(
          api.Products.getProductsByIds(items),
        );
        if (!result || (result as IError).statusCode >= 400) {
          return { error: result as IError };
        } else {
          return { data: result as IProductsEntity[] };
        }
      },
    }),
    /**
     * Get block by Marker.
     * @param marker     - Marker of Block.
     * @param activeLang - Language code. Default "en_US".
     * @returns          Query result with block
     */
    getBlockByMarker: build.query<IBlockEntity, BlockByMarkerProps>({
      queryFn: async ({ marker, activeLang }) => {
        const result = await handleApiResponse(
          api.Blocks.getBlockByMarker(marker, activeLang),
        );
        if (!result || (result as IError)?.statusCode) {
          return { error: result as IError };
        }
        return { data: result as IBlockEntity };
      },
    }),
    /**
     * Get all auth providers objects.
     * @param langCode - Language code. Default "en_US".
     * @returns        Query result with auth providers
     */
    getAuthProviders: build.query<IAuthProvidersEntity[], string>({
      queryFn: async (langCode) => {
        const result = await handleApiResponse(
          api.AuthProvider.getAuthProviders(langCode),
        );
        if (!result || (result as IError)?.statusCode) {
          return { error: result as IError };
        }
        return { data: result as IAuthProvidersEntity[] };
      },
    }),
    /**
     * Get form by marker.
     * @param marker - Marker of form.
     * @param lang   - Language code. Default "en_US"
     * @returns      Query result with form
     */
    // eslint-disable-next-line prettier/prettier
    getFormByMarker: build.query<IFormsEntity, { marker: string; lang: string }>({
      queryFn: async ({ marker, lang }) => {
        const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
        const result = await handleApiResponse(
          api.Forms.getFormByMarker(marker, langCode),
        );
        if (!result || (result as IError)?.statusCode) {
          return { error: result as IError };
        }
        return { data: result as IFormsEntity };
      },
    }),
    /**
     * Getting the data of an authorized user.
     * @param langCode - Required parameter lang code.
     * @returns        Query result with user data
     */
    getMe: build.query<IUserEntity, { langCode: string }>({
      queryFn: async ({ langCode }) => {
        try {
          const result = await handleApiResponse(api.Users.getUser(langCode));
          if (!result || (result as IError)?.statusCode) {
            return { error: result as IError };
          }
          return { data: result as IUserEntity };
        } catch (error) {
          return { error: error as IError };
        }
      },
    }),
    /**
     * Get all payment accounts as an array.
     * @returns Query result with payment accounts
     */
    getAccounts: build.query<IAccountsEntity[], object>({
      queryFn: async () => {
        const result = await handleApiResponse(api.Payments.getAccounts());
        if (!result || (result as IError)?.statusCode) {
          return { error: result as IError };
        }
        return { data: result as IAccountsEntity[] };
      },
    }),
    /**
     * Retrieve one order storage object by marker.
     * @param marker - Marker of the order object.
     * @returns      Query result with order storage
     */
    getOrderStorageByMarker: build.query<IOrdersEntity, { marker: string }>({
      queryFn: async ({ marker }) => {
        const result = await handleApiResponse(
          api.Orders.getOrderByMarker(marker),
        );
        if (!result || (result as IError)?.statusCode) {
          return { error: result as IError };
        }
        return { data: result as IOrdersEntity };
      },
    }),
    /**
     * Get a single payment session object by its identifier.
     * @param id - Identifier of the retrieved payment session object.
     * @returns  Query result with payment session
     */
    getPaymentSessionById: build.query<ISessionEntity, { id: number }>({
      queryFn: async ({ id }) => {
        const result = await handleApiResponse(api.Payments.getSessionById(id));
        if (!result || (result as IError)?.statusCode) {
          return { error: result as IError };
        }
        return { data: result as ISessionEntity };
      },
    }),
    /**
     * Getting a single order from the order storage object created by the user
     * @param id         - ID of the order object.
     * @param marker     - The text identifier of the order storage object.
     * @param activeLang - Optional language field.
     * @returns          Query result with single order
     */
    getSingleOrder: build.query<IOrderByMarkerEntity, SingleOrderProps>({
      queryFn: async ({ id, marker, activeLang }) => {
        const result = await handleApiResponse(
          api.Orders.getOrderByMarkerAndId(marker, id, activeLang),
        );
        if (!result || (result as IError)?.statusCode) {
          return { error: result as IError };
        }
        return { data: result as IOrderByMarkerEntity };
      },
    }),
  }),
});

export const {
  useGetBlockByMarkerQuery,
  useGetBlocksByPageUrlQuery,
  useGetFormByMarkerQuery,
  useGetAuthProvidersQuery,
  useLazyGetMeQuery,
  useGetAccountsQuery,
  useGetPaymentSessionByIdQuery,
  useLazyGetPaymentSessionByIdQuery,
  useGetOrderStorageByMarkerQuery,
  useGetSingleOrderQuery,
  useGetProductByIdQuery,
  useGetProductsByIdsQuery,
} = RTKApi;
