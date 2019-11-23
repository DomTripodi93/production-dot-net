import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ProductionService } from '../production.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { JobService } from 'src/app/job/job.service';
import { Machine } from 'src/app/machine/machine.model';
import { OpService } from 'src/app/job/job-ops/operation.service';
import { Production } from '../production.model';

@Component({
  selector: 'app-production-quantity',
  templateUrl: './production-quantity.component.html',
  styleUrls: ['./production-quantity.component.css']
})
export class ProductionQuantityComponent implements OnInit, OnDestroy {
  @Output() updatedProduction = new EventEmitter<Production>();
  @Input() quantity: string;
  @Input() id: string;
  @Input() mach: Machine;
  @Input() date: string;
  @Input() shift: string;
  subscriptions: Subscription[] = [];
  editQuantityForm: FormGroup;
  difference: number;
  production;


  constructor(
    private proServ: ProductionService,
    private auth: AuthService,
    private jobServ: JobService,
    private opServ: OpService
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.proServ.proSubmit.subscribe(()=>{
        this.onSubmit();
      })
    )
    this.initForm();
  }


  private initForm() {
    this.editQuantityForm = new FormGroup({
      'quantity': new FormControl(this.quantity)
    });
  }

  onSubmit(){
    if (this.id){
      if (this.editQuantityForm.value.quantity != this.quantity && this.editQuantityForm.value.quantity != 0){
        this.quantity = this.editQuantityForm.value.quantity;
        this.proServ.setQuantity(this.editQuantityForm.value, this.id).subscribe();        
      } else if (this.editQuantityForm.value.quantity != this.quantity) {
        this.proServ.deleteProduction(this.id).subscribe();
        this.production = this.editQuantityForm.value;
        this.updatedProduction.emit(this.production);
      }
    } else if (this.editQuantityForm.value.quantity != 0) {
      this.quantity = this.editQuantityForm.value.quantity;
      this.jobServ.fetchJob(this.mach.currentJob).subscribe((job)=>{
        this.production = {
          quantity: this.editQuantityForm.value.quantity,
          date: this.date,
          shift: this.shift,
          machine: this.auth.splitJoin(this.mach.machine),
          jobNumber: this.mach.currentJob,
          opNumber: this.opServ.slashToDash(this.mach.currentOp),
          partNumber: job.partNumber,
          machType: this.auth.machType
        }
        this.proServ.addProduction(this.production).subscribe((response: Production)=>{
          this.production = response;
          this.updatedProduction.emit(this.production);
        });
      })
    } 
  }

  submitAll(){
    this.proServ.proSubmit.next();
    setTimeout(()=>{this.proServ.proChanged.next();},200);
  }

  ngOnDestroy(){
    this.subscriptions.forEach(sub=>{
      sub.unsubscribe();
    })
  }
}
