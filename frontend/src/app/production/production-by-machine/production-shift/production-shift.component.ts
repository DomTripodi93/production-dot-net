import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Production } from '../../production.model';
import { ProductionService } from '../../production.service';
import { Machine } from 'src/app/machine/machine.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-production-shift',
  templateUrl: './production-shift.component.html',
  styleUrls: ['./production-shift.component.css']
})
export class ProductionShiftComponent implements OnInit, OnDestroy {
  @Input() prod: Production;
  @Input() editMode: boolean;
  @Input() mach: Machine;
  @Input() date: string;
  @Input() shift: string;
  proSubscription: Subscription;

  constructor(
    private proServ: ProductionService
  ) { }

  ngOnInit() {
    this.proSubscription = this.proServ.proChanged.subscribe(()=>{
      this.editMode = false;
    })
  }


  changeAvg(avg: boolean, id){
    this.prod.average = !this.prod.average;
    let newAvg = {
      average: !avg
    };
    this.proServ.setAverage(newAvg, id).subscribe(()=>{
      this.proServ.proChangedAvg.next();
    });
  }

  addProd(){
    this.editMode = true;
  }

  updateProduction($event){
    if (!this.prod){
      this.prod = $event;
    } else if ($event.quantity > 0){
      this.prod.quantity = $event.quantity;
    } else {
      this.prod = null;
    }
  }

  ngOnDestroy(){
    this.proSubscription.unsubscribe();
  }
  //Removes observable subscriptions

}
