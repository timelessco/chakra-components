import pick from 'lodash/pick';

import { getAllowedStyles } from './styleProps';

export default (passedProps, allowedSystems = []) =>
  pick(passedProps, getAllowedStyles(allowedSystems));
