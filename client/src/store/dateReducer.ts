import { SET_DATE } from './types';
import moment from 'moment';

export const dateReducer = (
  state: moment.Moment = moment(),
  action: DateAction
): moment.Moment => {
  switch (action.type) {
    case SET_DATE:
      return action.payload;
    default:
      return state;
  }
}

export const setDate = (data: moment.Moment) => {
  return { type: SET_DATE, payload: data }
}
