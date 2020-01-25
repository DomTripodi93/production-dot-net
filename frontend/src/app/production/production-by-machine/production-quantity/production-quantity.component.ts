import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ProductionService } from '../../production.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { JobService } from 'src/app/job/job.service';
import { Machine } from 'src/app/machine/machine.model';
import { OpService } from 'src/app/job/job-ops/operation.service';
import { Production } from '../../production.model';

@Component({
  selector: 'app-production-quantity',
  templateUrl: './production-quantity.component.html',
  styleUrls: ['./production-quantity.component.css']
})
export class ProductionQuantityComponent implements OnInit, OnDestroy {
  @Output() updatedProduction = new EventEmitter<Production>();
  @Output() notEdit = new EventEmitter<boolean>();
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
    this.machEditCount(true);
    this.subscriptions.push(
      this.proServ.proSubmit.subscribe(()=>{
        this.onSubmit();
      })
    )
    this.initForm();
  }

  machEditCount(isOpen: boolean){
    setTimeout(()=>{
      this.proServ.openEdit = isOpen;
      this.proServ.editMach = this.mach.machine;
      this.proServ.checkEdits.next();
    }, 1000)
  }

  private initForm() {
    this.editQuantityForm = new FormGroup({
      'quantity': new FormControl(this.quantity)
    });
  }

  submitAll(){
    this.proServ.proSubmit.next();
  }

  onSubmit(){
    if (this.editQuantityForm.value.quantity == null){
      this.editQuantityForm.value.quantity = 0;
    }
    if (this.id){
      if (this.editQuantityForm.value.quantity != this.quantity && this.editQuantityForm.value.quantity != 0){
        let difference = +this.editQuantityForm.value.quantity - +this.quantity;
        this.quantity = this.editQuantityForm.value.quantity;
        this.proServ.setQuantity(this.editQuantityForm.value, this.id, difference).subscribe(()=>{
          this.updatedProduction.emit(this.editQuantityForm.value);
          this.notEdit.emit(false);
          this.machEditCount(false);
        });        
      } else if (this.editQuantityForm.value.quantity != this.quantity) {
        this.proServ.deleteProduction(this.id, +this.quantity).subscribe(()=>{
          this.updatedProduction.emit(this.editQuantityForm.value);
          this.notEdit.emit(false);
          this.machEditCount(false);
        });
      } else {
        this.notEdit.emit(false);
        this.machEditCount(false);
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
          this.notEdit.emit(false);
          this.machEditCount(false);
        });
      })
    } else {
      this.notEdit.emit(false);
      this.machEditCount(false);
    }
  }

  ngOnDestroy(){
    this.subscriptions.forEach(sub=>{
      sub.unsubscribe();
    })
  }
}
