import pick from 'lodash/pick';

export default (passedProps, allowedSystems = []) =>
  pick(passedProps, allowedSystems);
