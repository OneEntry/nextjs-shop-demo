/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type { IUserEntity } from 'oneentry/dist/users/usersInterfaces';
import type { JSX, ReactNode } from 'react';
import { createContext, useEffect, useState } from 'react';

import { reDefine, useLazyGetMeQuery } from '@/app/api';
import { updateUserState } from '@/app/api/server/users/updateUserState';
import type { IProducts } from '@/app/types/global';

import { useAppDispatch, useAppSelector } from '../hooks';
import {
  addProductToCart,
  selectCartData,
  selectCartVersion,
  setCartVersion,
} from '../reducers/CartSlice';
import {
  addFavorites,
  selectFavoritesItems,
  selectFavoritesVersion,
  setFavoritesVersion,
} from '../reducers/FavoritesSlice';

/**
 * Authentication context
 * @property {boolean}     isAuth       - Authentication status
 * @property {boolean}     isLoading    - Loading status
 * @property {string}      userToken    - User token
 * @property {IUserEntity} user         - User entity
 * @property {void}        authenticate - Authentication function
 * @property {void}        refreshUser  - User refresh function
 */
export const AuthContext = createContext<{
  isAuth: boolean;
  isLoading: boolean;
  userToken?: string;
  user?: IUserEntity;
  authenticate: () => void;
  refreshUser: () => void;
}>({
  isAuth: false,
  isLoading: false,
  authenticate: () => {},
  refreshUser: () => {},
});

/**
 * Auth provider
 * @param   {object}      props          - Auth provider properties
 * @param   {ReactNode}   props.children - Children ReactNode
 * @param   {string}      props.langCode - Current language code
 * @returns {JSX.Element}                AuthContext Provider
 */
export const AuthProvider = ({
  children,
  langCode,
}: {
  children: ReactNode;
  langCode: string;
}): JSX.Element => {
  /** Initialize Redux dispatch function */
  const dispatch = useAppDispatch();
  /** Track authentication status */
  const [isAuth, setIsAuth] = useState<boolean>(false);
  /** Track loading status */
  const [isLoading, setIsLoading] = useState<boolean>(false);
  /** Store user data */
  const [user, setUser] = useState<IUserEntity | undefined>();
  /** Trigger refetch of user data */
  const [refetch, setRefetch] = useState<boolean>(false);
  /** Trigger user refresh */
  const [refetchUser, setRefetchUser] = useState<boolean>(false);

  /** Get user data from redux AppSelector */
  const cartVersion = useAppSelector(selectCartVersion) as number;
  /** Get favorites version from redux store */
  const favoritesVersion = useAppSelector(selectFavoritesVersion) as number;
  /** Get products in cart from redux store */
  const productsInCart = useAppSelector(selectCartData);
  /** Get favorite product IDs from redux store */
  const favoritesIds = useAppSelector(
    (state: { favoritesReducer: { products: number[] } }) =>
      selectFavoritesItems(state),
  );

  /**
   * Check user data loop with polling interval
   *
   * This function checks for a refresh token in local storage and initiates
   */
  const [trigger, { isError }] = useLazyGetMeQuery({
    pollingInterval: isAuth ? 3000 : 0,
  });

  /**
   * Initialize authorization by checking refresh token
   *
   * This function checks for a refresh token in local storage and initiates
   */
  const onInit = async (): Promise<void> => {
    /** Get refresh token from localStorage */
    const refresh = localStorage.getItem('refresh-token');

    /** If no refresh token, set auth to false */
    if (!refresh) {
      setIsAuth(false);
      return;
    }
    /** Redefine user session with refresh token */
    await reDefine(refresh, langCode);
    /** Check token validity */
    await checkToken();
  };

  /**
   * Check refresh token and validate user authentication
   *
   * This function triggers the user data fetch and validates the authentication
   * status based on the response. It updates the authentication state accordingly.
   * @async
   */
  const checkToken = async () => {
    /** Trigger user data fetch */
    trigger({ langCode })
      .then(async (res) => {
        /** Check if response has error or no user ID */
        if ((res.isError && !res.isLoading) || !res.data?.id) {
          /** Clear refresh token and set auth to false */
          localStorage.setItem('refresh-token', '');
          setIsAuth(false);
        } else {
          /** Set user data and auth status to true */
          setUser(res.data);
          setIsAuth(true);
        }
      })
      .catch(async () => {
        /** Clear refresh token and set auth to false on error */
        localStorage.setItem('refresh-token', '');
        setIsAuth(false);
      });
  };

  /**
   * Update user state on server with cart and favorites data
   *
   * This function sends the updated user state to the server,
   * including the cart and favorites data.
   */
  const updateUserData = async (): Promise<void> => {
    /** Exit if no user data */
    if (!user) {
      return;
    }
    /** Send updated user state to server */
    await updateUserState({
      cart: productsInCart,
      favorites: favoritesIds,
      user: user,
    });
  };

  /** Update user data on auth state change */
  useEffect(() => {
    /** Exit if not authenticated or no user */
    if (!isAuth || !user) {
      return;
    }
    /** Update user data with current cart and favorites */
    updateUserData();
  }, [isAuth, user, productsInCart, favoritesIds]);

  /** Load cart from user state to Redux store */
  useEffect(() => {
    /** Exit if no user cart data or cart already loaded */
    if (!user?.state.cart || cartVersion > 0) {
      return;
    }

    /** Add each product from user state to Redux cart */
    user.state.cart?.forEach((product: IProducts) => {
      const productInCart = productsInCart?.find((p) => p.id === product.id);
      /** If product not in cart, add to cart */
      if (!productInCart) {
        dispatch(addProductToCart(product));
      }
    });

    /** Mark cart as loaded */
    dispatch(setCartVersion(1));
  }, [isAuth, user]);

  /** Load favorites from user state to Redux store */
  useEffect(() => {
    /** Exit if no user favorites data or favorites already loaded */
    if (!user?.state.favorites || favoritesVersion > 0) {
      return;
    }
    /** Add each favorite from user state to Redux favorites */
    user.state.favorites.forEach((element: number) => {
      dispatch(addFavorites(element));
    });
    /** Mark favorites as loaded */
    dispatch(setFavoritesVersion(1));
  }, [isAuth, user]);

  /** Refetch user data when refetch flag changes */
  useEffect(() => {
    /** Set loading state to true */
    setIsLoading(true);
    /** Initialize auth process */
    onInit().then(() => {
      /** Set loading state to false after init */
      setIsLoading(false);
    });
  }, [refetch, langCode]);

  /** Refetch if error and has refresh-token */
  useEffect(() => {
    /** Get refresh token from localStorage */
    const refresh = localStorage.getItem('refresh-token');
    /** If error occurred and refresh token exists */
    if (isError && refresh) {
      /** Trigger refetch */
      setRefetch(true);
      /** Clear refresh token and set auth to false */
      localStorage.setItem('refresh-token', '');
      setIsAuth(false);
    }
  }, [isError]);

  /** Check token on refetch */
  useEffect(() => {
    /** Only check token if already authenticated */
    if (isAuth) {
      checkToken();
    }
  }, [refetch, refetchUser, isAuth]);

  /** Context value object */
  const value = {
    isAuth,
    isLoading,
    user,
    authenticate: () => setRefetch(!refetch),
    refreshUser: () => setRefetchUser(!refetchUser),
  };

  /** Return AuthContext Provider with value */
  return (
    <AuthContext.Provider value={value as any}>{children}</AuthContext.Provider>
  );
};
