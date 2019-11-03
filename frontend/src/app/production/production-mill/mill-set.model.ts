import { Job } from 'src/app/job/job.model';
import { Operation } from 'src/app/job/job-ops/operation.model';

export interface MillSet {
    partNumber: string,
    jobNumber: string,
    ops: Operation[]
}