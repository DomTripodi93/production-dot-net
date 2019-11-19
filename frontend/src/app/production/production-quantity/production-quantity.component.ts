import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ProductionService } from '../production.service';
import { Production } from '../production.model';

@Component({
  selector: 'app-production-quantity',
  templateUrl: './production-quantity.component.html',
  styleUrls: ['./production-quantity.component.css']
})
export class ProductionQuantityComponent implements OnInit {
  @Input() quantity: string;
  @Input() id: string;
  @Input() production: Production;
  editQuantityForm: FormGroup;
  difference: number;
  
  constructor(
    private proServ: ProductionService
  ) { }

  ngOnInit() {
    this.proServ.proSubmit.subscribe(()=>{
      this.onSubmit();
    })
    this.initForm();
  }


  private initForm() {
    this.editQuantityForm = new FormGroup({
      'quantity': new FormControl(this.quantity)
    });
  }

  onSubmit(){
    if (this.id){
      if (this.editQuantityForm.value.quantity != this.quantity){
        this.quantity = this.editQuantityForm.value.quantity;
        this.proServ.setQuantity(this.editQuantityForm.value, this.id).subscribe();        
      }
    } else {
      this.production.quantity = this.editQuantityForm.value.quantity;
      this.proServ.addProduction(this.production).subscribe();
    }
  }

  submitAll(){
    this.proServ.proSubmit.next();
  }
}
