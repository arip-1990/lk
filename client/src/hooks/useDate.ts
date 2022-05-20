import { useAppSelector } from "./redux";
import { setDate } from "../store/dateReducer";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { useCallback } from "react";
import moment from 'moment';

export const useDate = () => {
    const date = useAppSelector((state) => state.date);
    const dispatch: Dispatch<any> = useDispatch();
    
    const setSelectedDate = useCallback((date: moment.Moment) => dispatch(setDate(date)), []);

    return { selectedDate: date.clone(), setSelectedDate };
}
