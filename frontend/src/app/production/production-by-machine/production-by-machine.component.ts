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
    private machServ: MachineService
  ) { }

  ngOnInit() {
    this.setMachines();
    this.machServ.machChanged.subscribe(()=>{
      this.ready = false;
      this.setMachines();
    })
  }


  setMachines(){
    this.machServ.fetchMachinesByType()
    .subscribe((machines: Machine[]) => {
      if (this.auth.machType == "lathe"){
        this.fullMach = [];
        let used = 0;
        machines.forEach((mach)=>{
          if (mach.currentOp !== "None"){
            this.fullMach.push(mach);
          }
          used += 1;
          if (used == machines.length){
            this.ready = true;
          }
        });
      } else {
        this.fullMach = machines;
        this.ready = true;
      }
    });
  }

}
