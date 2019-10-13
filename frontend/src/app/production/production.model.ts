export interface Production {
    id: number;
    partNum: string;
    quantity: number;
    jobNumber: string;
    opNumber: string;
    date: string;
    machine: string;
    shift: string;
    inQuestion: boolean;
}