export interface Production {
    id: number;
    quantity: number;
    jobNumber: string;
    date: Date;
    machine: string;
    shift: string;
    inQuestion: boolean;
}