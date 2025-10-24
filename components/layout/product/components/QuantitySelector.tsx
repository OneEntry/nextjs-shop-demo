'use client';

import type { JSX } from 'react';
import React, { memo, useEffect, useState } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { selectCartItemWithIdLength } from '@/app/store/reducers/CartSlice';

import DecreaseButton from './DecreaseButton';
import IncreaseButton from './IncreaseButton';
import QuantityInput from './QuantityInput';

/**
 * Quantity selector component.
 * Provides a complete quantity selection interface with decrease button, input field, and increase button.
 * Manages local state for quantity value and synchronizes with Redux store.
 * Uses memoization for performance optimization.
 * Only displays when the product is in the cart (quantity > 0).
 * @param   {object}      props           - Component properties.
 * @param   {number}      props.id        - Product ID for identification and cart operations.
 * @param   {number}      props.units     - Count of product available in shop (maximum allowed quantity).
 * @param   {string}      props.title     - Product title for notifications and accessibility.
 * @param   {number}      props.height    - Height of the selector component for styling.
 * @param   {string}      props.className - CSS className for additional styling.
 * @returns {JSX.Element}                 Quantity selector with increase/decrease buttons.
 */
const QuantitySelector = memo(
  ({
    id,
    units,
    title,
    height,
    className,
  }: {
    id: number;
    units: number;
    title: string;
    className?: string;
    height: number;
  }): JSX.Element => {
    const [qty, setQty] = useState(1);

    /** Extract data from cartSlice for the specific product */
    const data = useAppSelector((state) =>
      selectCartItemWithIdLength(state, id),
    );
    const quantity = data || 0;

    /**
     * Update local qty state when Redux store quantity changes.
     * Ensures local state stays in sync with global state.
     */
    useEffect(() => {
      /** Set qty to the Redux quantity or default to 1 if not in cart */
      setQty(quantity > 0 ? quantity : 1);
    }, [quantity]);
    /**
     * Hide component when product is not in cart (quantity <= 0)
     * This provides a clean UI experience by only showing quantity controls
     * for products that have been added to the cart
     */
    if (quantity <= 0) {
      return <></>;
    }

    return (
      <div
        className={
          'flex items-center justify-between rounded-3xl bg-slate-50 px-2' +
          className
        }
        style={{ height: height }}
      >
        <DecreaseButton id={id} qty={qty} title={title} />
        <QuantityInput id={id} qty={qty} units={units} />
        <IncreaseButton id={id} qty={qty} units={units} />
      </div>
    );
  },
);

QuantitySelector.displayName = 'QuantitySelector';

export default QuantitySelector;
