import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PartService } from '../part.service';
import { OpService } from '../../job/job-ops/operation.service';
import { Part } from '../part.model';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-part-edit',
  templateUrl: './part-edit.component.html',
  styleUrls: ['./part-edit.component.css']
})
export class PartEditComponent implements OnInit {
  @Output() cancel = new EventEmitter<boolean>();
  @Input() part: Part;
  editRevForm: FormGroup;
  difference: number;
  
  constructor(
    private partServ: PartService,
    private opServ: OpService
  ) { }

  ngOnInit() {
    this.partServ.partUpdated.subscribe(()=>{
      this.onSubmit();
    })
    this.initForm();
  }


  private initForm() {
    this.editRevForm = new FormGroup({
      'rev': new FormControl(this.part.rev)
    });
  }

  onSubmit(){
    if (this.editRevForm.value.rev.includes("/")){
      this.editRevForm.value.rev = this.opServ.slashToDash(this.editRevForm.value.rev);
    }
    if (+this.part.rev != this.editRevForm.value.rev){
      this.partServ.changeRev(this.editRevForm.value, this.part.partNumber).subscribe();
      this.partServ.partChanged.next();
    } 
  }

  submitAll(){
    this.partServ.partUpdated.next();
  }

  onCancel(){
    this.cancel.emit(false);
  }

}

