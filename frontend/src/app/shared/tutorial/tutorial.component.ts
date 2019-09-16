import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { MachineService } from '../../machine/machine.service';
import { PartService } from 'src/app/part/part.service';
import { HourlyService } from '../../hourly/hourly.service';
import { ProductionService } from '../../production/production.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css']
})
export class TutorialComponent implements OnInit, OnDestroy {
  machines = false;
  parts = false;
  hourly = false;
  production = false;  
  job = "";
  subscriptions: Subscription[] = [];

  constructor(
    private auth: AuthService,
    private mach: MachineService,
    private partServ: PartService,
    private hourlyServ: HourlyService,
    private prodServ: ProductionService
  ) { }

  ngOnInit() {
    this.checkAll();
    this.subscriptions.push(this.mach.machChanged.subscribe(()=>{
      setTimeout(()=>{this.checkMachines()},50)}
    ));
    this.subscriptions.push(this.partServ.partChanged.subscribe(()=>{
      setTimeout(()=>{this.checkParts()},50)}
    ));
    this.subscriptions.push(this.hourlyServ.hourlyChanged.subscribe(()=>{
      setTimeout(()=>{this.checkHourly()},50)}
    ));
    this.subscriptions.push(this.prodServ.proChanged.subscribe(()=>{
      setTimeout(()=>{this.checkProduction()},50)}
    ));
  }

  checkAll(){
    this.checkMachines();
    this.checkParts();
    this.checkHourly();
    this.checkProduction();
  }

  checkMachines(){
    this.mach.fetchAllMachines()
      .subscribe(machine => {
        if (machine.length > 0){
          this.machines = true;
          }
        }
      )
  }

  checkParts(){
    this.partServ.fetchAllParts()
      .subscribe(part => {
        if (part.length > 0){
          this.parts = true;
        }
      }
    )
  }

  checkHourly(){
    this.hourlyServ.fetchAllHourly()
      .subscribe(hour => {
        if (hour.length > 0){
          this.hourly = true;
        }
      }
    )}


  checkProduction(){
    this.prodServ.fetchAllProduction()
      .subscribe(prod => {
        if (prod.length > 0){
          this.job = prod[0].jobNumber
          this.production = true;
        }
      }
    )
  }

  notNew() {
    if (confirm("Are you sure you want to hide these tutorials?")){
      this.auth.changeNew().subscribe(()=>{
        this.auth.authChanged.next();
      })
    }
  }

  ngOnDestroy(){
    this.subscriptions.forEach((sub)=>{
      sub.unsubscribe()
    })
  }
}
