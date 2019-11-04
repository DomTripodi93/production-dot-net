import { Operation } from 'src/app/job/job-ops/operation.model';

export interface MillSet {
    machine: string,
    partNumber: string,
    jobNumber: string,
    ops: Operation[]
}