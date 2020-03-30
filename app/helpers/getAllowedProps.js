import pick from 'lodash/pick';

import styledProps from './styleProps';

export default (passedProps, allowedSystems = []) =>
  allowedSystems.length === 0
    ? pick(passedProps, styledProps)
    : pick(passedProps, allowedSystems);
