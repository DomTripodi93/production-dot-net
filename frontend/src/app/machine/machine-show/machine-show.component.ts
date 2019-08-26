import { Component, OnInit, OnDestroy } from '@angular/core';
import { Machine } from '../machine.model';
import { Subscription } from 'rxjs';
import { MachineService } from 'src/app/machine/machine.service';

@Component({
  selector: 'app-machine-show',
  templateUrl: './machine-show.component.html',
  styleUrls: ['./machine-show.component.css']
})
export class MachineShowComponent implements OnInit, OnDestroy{
  machines: Machine[] = [];
  subscription1 = new Subscription;
  subscription2 = new Subscription;
  isFetching = false;
  isError = false;
  error = '';

  constructor(
    private mach: MachineService,
  ) { }

  ngOnInit() {
    this.getMachines();
    this.subscription2 = this.mach.machChanged.subscribe(()=>{
      setTimeout(()=>{this.getMachines()}, 50);
    })
  }

  getMachines(){
    this.subscription1 = this.mach.fetchAllMachines()
    .subscribe(machines => {
      this.machines = machines;
      this.isFetching = false;
    }, error => {
      this.isFetching = false;
      this.isError = true;
      this.error = error.message
    });
  }

  onDelete(id, machine){
    if (confirm("Are you sure you want to delete " +machine+ "?")){
      this.mach.deleteMachine(id).subscribe(()=>{
        setTimeout(()=>{this.mach.machChanged.next()}, 50);
      });
    }
  }

  ngOnDestroy(){
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
  }

}
