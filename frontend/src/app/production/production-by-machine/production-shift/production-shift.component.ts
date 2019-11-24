import { Component, OnInit, Input } from '@angular/core';
import { Production } from '../../production.model';
import { ProductionService } from '../../production.service';
import { Machine } from 'src/app/machine/machine.model';

@Component({
  selector: 'app-production-shift',
  templateUrl: './production-shift.component.html',
  styleUrls: ['./production-shift.component.css']
})
export class ProductionShiftComponent implements OnInit {
  @Input() prod: Production;
  @Input() editMode: boolean;
  @Input() mach: Machine;
  @Input() date: string;
  @Input() shift: string;

  constructor(
    private proServ: ProductionService
  ) { }

  ngOnInit() {
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
    this.editMode = false;
    if (!this.prod){
      this.prod = $event;
    } else if ($event.quantity > 0){
      this.prod.quantity = $event.quantity;
    } else {
      this.prod = null;
    }
  }

}
