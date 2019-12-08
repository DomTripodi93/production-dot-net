import { Component, OnInit, OnDestroy } from '@angular/core';
import { Machine } from '../machine.model';
import { Subscription } from 'rxjs';
import { MachineService } from 'src/app/machine/machine.service';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-machine-show',
  templateUrl: './machine-show.component.html',
  styleUrls: ['./machine-show.component.css']
})
export class MachineShowComponent implements OnInit, OnDestroy{
  machines: Machine[] = [];
  subscriptions: Subscription[] = [];
  isFetching = false;
  isError = false;
  error = '';
  editMode: boolean[] = [];

  constructor(
    private mach: MachineService,
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.getMachines();
    this.subscriptions.push(
      this.mach.machChanged.subscribe(()=>{
        setTimeout(()=>{this.getMachines();}, 50);
      })
    );
  }

  getMachines(){
    this.editMode = [];
    this.subscriptions.push(
      this.mach.fetchMachinesByType()
        .subscribe(machines => {
          this.machines = machines;
          machines.forEach(()=>{
            this.editMode.push(false);
          })
          this.isFetching = false;
        }, error => {
          this.isFetching = false;
          this.isError = true;
          this.error = error.message;
        }
      )
    );
  }
  //Sets Machines for display, and hold values for in-page machine editing switch

  onDelete(machine){
    if (confirm("Are you sure you want to delete " +machine+ "?")){
      this.mach.deleteMachine(machine).subscribe(()=>{
        this.mach.machChanged.next();
      });
    }
  }
  //Activated by delete click, shows confirmation dialogue box before sending delete
  // signal to API, updates machine list

  onEdit(index){
    this.editMode[index] = true;
  }
  //Switches value to start editing selected machine in-page


  ngOnDestroy(){
    this.subscriptions.forEach((sub)=>{sub.unsubscribe()})
  }
  //Removes observable subscriptions
}
