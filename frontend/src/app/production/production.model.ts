export interface Production {
    id: number;
    quantity: number;
    job: string;
    date: Date;
    machine: string;
    shift: string;
    inQuestion: boolean;
}