import { Component, OnInit } from '@angular/core';
import { Job } from '../job.model';
import { Subscription } from 'rxjs';
import { JobService } from '../job.service';
import { Pagination } from '../../shared/pagination';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-job-show',
  templateUrl: './job-show.component.html',
  styleUrls: ['./job-show.component.css']
})
export class JobShowComponent implements OnInit {
  jobs: Job[] = [];
  subscriptions: Subscription[] =[];
  isFetching = false;
  isError = false;
  error = '';
  pageNum = 1;
  pageSize = 6;
  pagination: Pagination;

  constructor(
    private jobServ: JobService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.subscriptions.push(this.auth.machTypeChanged.subscribe(()=>{
      this.pageNum = 1;
      this.jobs = [];
      this.getJobs();
    }))
    this.getJobs();
    this.subscriptions.push(
      this.jobServ.jobChanged.subscribe(
        ()=>{
          this.pageNum = 1;
          this.jobs = [];
          setTimeout(()=>{this.getJobs()}, 50);
        }
      )
    );
  }

  getJobs(){this.jobServ.fetchAllJobs(this.pageNum, this.pageSize)
    .subscribe(jobs => {
      this.pageNum++
      this.pagination = jobs.pagination;
      jobs.result.forEach((job)=>{
        this.jobs.push(job);
      })
      this.isFetching = false;
    }, error => {
      this.isFetching = false;
      this.isError = true;
      this.error = error.message
    });
  }

  showMore(){
    this.getJobs();
  }

  ngOnDestroy(){
    this.jobs = [];
    this.subscriptions.forEach(
      (sub)=>{
        sub.unsubscribe();
      }
    );
  }

}
