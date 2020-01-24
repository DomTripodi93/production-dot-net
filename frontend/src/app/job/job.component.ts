import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { JobService } from './job.service';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  constructor(
    public auth: AuthService,
    public jobServ: JobService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.subscribe((params: Params) => {
        this.auth.machType = params["machType"];
        this.jobServ.jobChanged.next()
      })
    ) 
  }

  switchActive(){
    this.jobServ.onlyActive = !this.jobServ.onlyActive;
    this.jobServ.jobChanged.next();
  }

  ngOnDestroy(){
    this.subscriptions.forEach(sub=>{
      sub.unsubscribe();
    })
  }

}
