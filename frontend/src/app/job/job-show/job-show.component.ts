import { Component, OnInit } from '@angular/core';
import { Job } from '../job.model';
import { Subscription } from 'rxjs';
import { JobService } from '../job.service';
import { Router, ActivatedRoute } from '@angular/router';

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

  constructor(
    private jobServ: JobService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getJobs();
    this.subscriptions.push(
      this.jobServ.jobChanged.subscribe(
        ()=>{
          setTimeout(()=>{this.getJobs()}, 50);
        }
      )
    );
  }

  getJobs(){
    this.subscriptions.push(this.jobServ.fetchAllJobs()
    .subscribe(jobs => {
      this.jobs = jobs;
      this.isFetching = false;
    }, error => {
      this.isFetching = false;
      this.isError = true;
      this.error = error.message
    }));
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
