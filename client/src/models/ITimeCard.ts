export interface ITimeCard {
    id: number;
    timeCardNum: string;
    normativeDays: number;
    normativeHours: number;
    user: string;
    post: string;
    attendances: {
      status: string|null;
      hours: number|null;
    }[];
}
