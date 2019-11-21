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

  constructor(
    private proServ: ProductionService
  ) { }

  ngOnInit() {
  }


  changeAvg(avg: boolean, id){
    let newAvg = {
      average: !avg
    };
    this.proServ.setAverage(newAvg, id).subscribe(()=>{
      this.proServ.proChanged.next();
    });
  }

  addProd(){
    this.editMode = true;
  }

}
