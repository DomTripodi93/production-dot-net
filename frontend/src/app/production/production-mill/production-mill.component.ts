import { Component, OnInit } from '@angular/core';
import { MachineService } from 'src/app/machine/machine.service';
import { ProductionService } from '../production.service';
import { OpService } from 'src/app/job/job-ops/operation.service';
import { JobService } from 'src/app/job/job.service';
import { DaysService } from 'src/app/shared/days/days.service';
import { Machine } from 'src/app/machine/machine.model';
import { MillSet } from './mill-set.model';

@Component({
  selector: 'app-production-mill',
  templateUrl: './production-mill.component.html',
  styleUrls: ['./production-mill.component.css']
})
export class ProductionMillComponent implements OnInit {
  machines: Machine[] = [];
  millSets: MillSet[][] = []

  constructor(
    private dayServ: DaysService,
    private machServ: MachineService,
    private jobServ: JobService,
    private opServ: OpService
  ) { }

  ngOnInit() {
    this.getProduction();
  }

  getProduction(){
    this.machServ.fetchMachinesByType().subscribe(machines=>{
      this.jobServ.fetchJobsByType().subscribe((jobs=>{
        machines.forEach(machine=>{
          let millSetsHold: MillSet[] = []
          let used = 1;
          jobs.result.forEach(job=>{
            this.opServ.fetchOpByMachAndJob(machine.machine+"&job="+job.jobNumber)
            .subscribe(ops=>{
              let millSetHold: MillSet = {
                jobNumber: job.jobNumber,
                partNumber: job.partNumber,
                ops: ops
              }
              millSetsHold.push(millSetHold)
            })
            if (used == jobs.result.length){
              this.millSets.push(millSetsHold);
              console.log(this.millSets)
            }
          })
        })
      }))
      this.machines = machines;
    });
  }
  //display part totals in each operation by machine they are running on, 
  // and remaining hours for op on the job, and on the monthly requirement  

}
