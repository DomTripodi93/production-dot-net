import { Job } from 'src/app/job/job.model';

export interface JobWithMore{
    job: Job;
    machine: string;
}