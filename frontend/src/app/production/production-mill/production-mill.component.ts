import { Component, OnInit } from '@angular/core';
import { MachineService } from 'src/app/machine/machine.service';
import { ProductionService } from '../production.service';
import { OpService } from 'src/app/job/job-ops/operation.service';
import { JobService } from 'src/app/job/job.service';
import { DaysService } from 'src/app/shared/days/days.service';
import { Machine } from 'src/app/machine/machine.model';

@Component({
  selector: 'app-production-mill',
  templateUrl: './production-mill.component.html',
  styleUrls: ['./production-mill.component.css']
})
export class ProductionMillComponent implements OnInit {
  machines: Machine[] = [];

  constructor(
    private dayServ: DaysService,
    private machServ: MachineService,
    private proServ: ProductionService,
    private jobServ: JobService,
    private opServ: OpService
  ) { }

  ngOnInit() {
    this.getProduction();
  }

  getProduction(){
    this.machServ.fetchMachinesByType().subscribe((machines)=>{
      this.machines = machines;
      machines.forEach(mach =>{
        this.opServ.fetchOp(this.opServ.slashToDash(mach.currentOp)+"&job="+mach.currentJob).subscribe((op)=>{
          console.log(op)
          if (op.partsToDate == null){
            op.partsToDate = "0";
          }
        });
      });
    });
  }
  //display part totals in each operation by machine they are running on, 
  // and remaining hours for op on the job, and on the monthly requirement  

}
