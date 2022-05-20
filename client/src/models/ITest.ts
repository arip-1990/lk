import { ICategory } from "./ICategory";

export interface ITest {
    id: string;
    category: ICategory;
    score: number;
    totalScore: number;
    corrects: number;
    totalCorrects: number;
    start: moment.Moment;
    finish: moment.Moment;
    results: Result[];
}
