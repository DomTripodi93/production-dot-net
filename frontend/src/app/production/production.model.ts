export interface Production {
    id: number;
    quantity: number;
    jobNumber: string;
    date: string;
    machine: string;
    shift: string;
    inQuestion: boolean;
}