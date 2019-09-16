import { Component, OnInit } from '@angular/core';
import { Job } from '../../job.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { JobService } from '../../job.service';
import { ActivatedRoute, Params } from '@angular/router';
import { DaysService } from 'src/app/shared/days/days.service';

@Component({
  selector: 'app-job-find-show',
  templateUrl: './job-find-show.component.html',
  styleUrls: ['./job-find-show.component.css']
})
export class JobFindShowComponent implements OnInit {
  isFetching = false;
  isError = false;
  error = '';
  oneJob: Job;
  jobs: Job[] = [];
  job = "";
  id = '';
  subscription = new Subscription;
  subscription2 = new Subscription;

  constructor(
    private auth: AuthService,
    private jobServ: JobService,
    private route: ActivatedRoute,
    private dayServ: DaysService
  ) { }

  ngOnInit() {
    this.subscription2 = this.route.params.subscribe((params: Params) =>{
      this.job = params['job'];
      this.getOneJob();
    });
    this.subscription = this.auth.authChanged.subscribe(
      ()=>{
        this.id = this.auth.user
      }
    )
  }

  onDelete(job, id){
    if (confirm("Are you sure you want to delete " +job+ "?")){
      this.jobServ.deleteJob(id).subscribe();
      this.jobServ.jobChanged.next();
    }
  }

  getOneJob() {
    this.isFetching = true;
    this.jobServ.fetchJob(this.job)
      .subscribe(job => {
        this.oneJob = job;
        this.dayServ.dates = [];
        this.isFetching = false;
      }, error => {
        this.isFetching = false;
        this.isError = true;
        this.error = error.message
      })
  }  
}
