import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';
import { DaysService } from 'src/app/shared/days/days.service';
import { MachineService } from 'src/app/machine/machine.service';
import { Machine } from '../../machine/machine.model';

@Component({
  selector: 'app-hourly-find',
  templateUrl: './hourly-find.component.html',
  styleUrls: ['./hourly-find.component.css']
})
export class HourlyFindComponent implements OnInit, OnDestroy{
  @ViewChild('data') searchForm: NgForm;
  startDate = "";
  machines=[""];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private dayServe: DaysService,
    private mach: MachineService
  ) {}

  onSubmit(){
    let jobNumber = "";
    let machine ="";
    let date ="";
    let searchHold = [];
    if (this.searchForm.value.jobNumber){
      jobNumber = this.searchForm.value.jobNumber;
      searchHold.push("jobNumber="+jobNumber);
    }
    if (this.searchForm.value.date){
      date = this.searchForm.value.date;
      searchHold.push("date="+date);
    }
    if (this.searchForm.value.machine){
      machine = this.searchForm.value.machine;
      searchHold.push("machine="+this.auth.splitJoin(machine));
    }
    let search = searchHold.join("&");
    if (!search){
      search ="x";
    }
    this.router.navigate([search], {relativeTo: this.route})
  }

  onCancel(){
    window.history.back();
  }

  ngOnInit(){
    if (+this.dayServe.today < 10 && this.dayServe.today.length <2){
      this.dayServe.today = "0"+this.dayServe.today
    };
    if (+this.dayServe.month < 10 && this.dayServe.stringMonth.length <2){
      this.dayServe.stringMonth = "0"+this.dayServe.month;
    };
    this.startDate = this.dayServe.year +"-"+this.dayServe.stringMonth+"-"+this.dayServe.today;  
    this.auth.hideButton(1);
    this.mach.fetchAllMachines()
    .subscribe(machines => {
      machines.forEach((mach)=>{
        this.machines.push(mach.machine);
      });
    });
  }

  ngOnDestroy(){
    this.auth.showButton(1);
  }
}
