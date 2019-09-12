import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HourlyService } from '../hourly.service';
import { MachineService } from '../../machine/machine.service';
import { PartService } from '../../part/part.service';

@Component({
  selector: 'app-hourly-set-job',
  templateUrl: './hourly-set-job.component.html',
  styleUrls: ['./hourly-set-job.component.css']
})
export class HourlySetJobComponent implements OnInit {
  @Input() index: number;
  setJobForm: FormGroup;
  jobs = [];

  constructor(
    private hourServ: HourlyService,
    private part: PartService,
    private machServ: MachineService
  ) { }

  ngOnInit() {
    this.initForm()
  }

  private initForm(){
    this.jobs = ["None"];
    this.part.fetchAllParts().subscribe(response =>{
      response.forEach(part => {
        this.jobs.push(part.job)
      });
    })

    this.setJobForm = new FormGroup({
      "currentJob": new FormControl(this.jobs[0], Validators.required)
    });
  }

  onSetJob(){
    this.machServ.setCurrentJob(this.setJobForm.value, this.hourServ.machine.id).subscribe(()=>{
      this.hourServ.hourlyChanged.next()
    });
    this.onCancel()
  }

  onCancel(){
    this.hourServ.quick[this.index]=false;
  }


}
