export interface User {
    email: string; 
    name: string;
    password: string;
    id?: string;
    isNew: boolean;
    skipLathe: boolean;
    skipMill: boolean;
    defaultStartTime: string;
    defaultBarEnd: string;
    defaultBarCut: string;
}