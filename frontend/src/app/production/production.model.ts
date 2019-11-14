export interface Production {
    id: number;
    partNumber: string;
    quantity: number;
    jobNumber: string;
    opNumber: string;
    date: string;
    machine: string;
    shift: string;
    inQuestion: boolean;
    average: boolean;
}