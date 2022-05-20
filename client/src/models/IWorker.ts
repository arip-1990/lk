export interface IWorker {
    id: string;
    firstName: string;
    lastName: string;
    middleName: string | null;
    position: string;
    percent: number;
    corrects: number;
    totalCorrects: number;
}

export interface IWorkers {
    store: string;
    workers: IWorker[]
}
