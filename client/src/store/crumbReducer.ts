import { ICategory } from '../models/ICategory';
import { SET_CRUMB, CLEAR_CRUMB } from './types';

export const crumbReducer = (
  state: ICategory[] = [],
  action: CrumbAction
): ICategory[] => {
  switch (action.type) {
    case SET_CRUMB:
      const cat = action.payload;
      if (!cat.parent) return [cat];
      const index = state.findIndex(item => item.id === cat.id);
      if (index !== -1) return state.slice(0, index + 1)
      return [...state, cat];
    case CLEAR_CRUMB:
      return [];
    default:
      return state;
  }
}

export const setCrumb = (data: ICategory) => {
  return { type: SET_CRUMB, payload: data }
}

export const clearCrumb = () => {
  return { type: CLEAR_CRUMB, payload: [] }
}
