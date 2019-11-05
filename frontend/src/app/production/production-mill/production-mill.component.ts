import { Component, OnInit } from '@angular/core';
import { MachineService } from 'src/app/machine/machine.service';
import { OpService } from 'src/app/job/job-ops/operation.service';
import { JobService } from 'src/app/job/job.service';
import { Machine } from 'src/app/machine/machine.model';
import { MillSet } from './mill-set.model';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-production-mill',
  templateUrl: './production-mill.component.html',
  styleUrls: ['./production-mill.component.css']
})
export class ProductionMillComponent implements OnInit {
  millSets: MillSet[][] = [];
  machines = [];

  constructor(
    private machServ: MachineService,
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.getProduction();
  }

  getProduction(){
    this.machServ.fetchMachinesByType().subscribe(machines=>{
      this.machines = machines
    });
  }

}
