import type { JSX } from 'react';
import React from 'react';

import ReviewAnimations from '../animations/ReviewAnimations';

/**
 * ViewAllButton component displays a button that allows users to view all reviews.
 * The button is animated using ReviewAnimations component and its visibility
 * is controlled by the state prop.
 * @param   {object}      props       - Component properties
 * @param   {boolean}     props.state - Controls the animation state of the button
 * @returns {JSX.Element}             Animated button element for viewing all reviews
 */
const ViewAllButton = ({ state }: { state: boolean }): JSX.Element => {
  return (
    <ReviewAnimations
      className="flex flex-col gap-5 max-md:mb-10 max-md:max-w-full"
      index={3}
      state={state}
    >
      <button
        type="button"
        className="btn btn-o btn-md mt-5 self-end max-md:self-center"
      >
        View all reviews
      </button>
    </ReviewAnimations>
  );
};

export default ViewAllButton;
