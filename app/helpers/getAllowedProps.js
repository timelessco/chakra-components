import pick from 'lodash/pick';

import styledProps, { getAllowedProp } from './styleProps';

export default (passedProps, allowedSystems = []) =>
  allowedSystems.length === 0
    ? pick(passedProps, styledProps)
    : pick(passedProps, getAllowedProp(allowedSystems));
