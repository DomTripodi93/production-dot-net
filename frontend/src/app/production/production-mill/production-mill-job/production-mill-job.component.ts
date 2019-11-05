import { Component, OnInit, Input } from '@angular/core';
import { OpService } from 'src/app/job/job-ops/operation.service';
import { MillSet } from '../mill-set.model';
import { Job } from 'src/app/job/job.model';
import { Operation } from 'src/app/job/job-ops/operation.model';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-production-mill-job',
  templateUrl: './production-mill-job.component.html',
  styleUrls: ['./production-mill-job.component.css']
})
export class ProductionMillJobComponent implements OnInit {
  @Input() machine: string;
  @Input() job: Job;
  ops: Operation[] = [];

  constructor(
    private opServ: OpService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.opServ.opsChanged.subscribe(()=>{
      this.getOps();
    })
    this.getOps();
  }

  getOps(){
    this.opServ.fetchOpByMachAndJob(this.auth.splitJoin(this.machine)+"&job="+this.job.jobNumber)
    .subscribe(ops=>{
      this.ops = ops;
    })
  }

}
