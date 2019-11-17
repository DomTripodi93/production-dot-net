import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import _ from 'lodash';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
import { DaysService } from 'src/app/shared/days/days.service';
import { MachineService } from 'src/app/machine/machine.service';
import { ProductionService } from '../production.service';
import { Machine } from 'src/app/machine/machine.model';
import { OpService } from 'src/app/job/job-ops/operation.service';
import { Production } from '../production.model';

@Component({
  selector: 'app-production-by-machine',
  templateUrl: './production-by-machine.component.html',
  styleUrls: ['./production-by-machine.component.css']
})
export class ProductionByMachineComponent implements OnInit {
  fullMach: Machine[] = [];
  prodLots: Production[][] = [];
  months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  date = new Date();
  month = this.date.getMonth();
  ready = false;


  constructor(
    public auth: AuthService,
    private machServ: MachineService,
    private proServ: ProductionService,
    private opServ: OpService
  ) { }

  ngOnInit() {
    if (this.auth.machType == "lathe"){
      this.setProduction();
    }
    this.proServ.proChanged.subscribe(()=>{
      this.ready = false;
      this.fullMach = [];
      this.prodLots = [];
      if (this.auth.machType == "lathe"){
        this.setProduction();
      }
    })
  }


  setProduction(){
    this.machServ.fetchMachinesByType()
    .subscribe((machines: Machine[]) => {
      let used = 0;
      machines.forEach((mach)=>{
        if (mach.currentOp !== "None"){
          this.prodLots.push([]);
          this.fullMach.push(mach);
        }
        used += 1;
        if (used == machines.length){
          let set = 0;
          this.fullMach.forEach(machine=>{
            let search = "mach=" + this.auth.splitJoin(machine.machine) 
              + "&job=" + machine.currentJob 
              + "&op=" + this.opServ.slashToDash(machine.currentOp);
            this.proServ.fetchProduction(search).subscribe(prod=>{
              this.prodLots[set] = prod;
              set += 1
              if (set == this.prodLots.length){
                if (this.prodLots.length > 1){
                  this.prodLots.sort((a, b) => ((a[0].machine > b[0].machine)? 1 : -1));
                }
                this.ready = true;
              }
            })
          })
        }
      });
    });
  }

}
