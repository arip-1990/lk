import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { useCallback } from "react";
import { Moment } from "moment";

import { useAppSelector } from "./redux";
import { setDate } from "../store/dateReducer";

export const useDate = () => {
  const date = useAppSelector((state) => state.date);
  const dispatch: Dispatch<any> = useDispatch();

  const setSelectedDate = useCallback(
    (date: Moment) => dispatch(setDate(date)),
    []
  );

  return { selectedDate: date.clone(), setSelectedDate };
};
