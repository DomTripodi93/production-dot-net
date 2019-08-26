import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PartService } from 'src/app/part/part.service';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-part-find',
  templateUrl: './part-find.component.html',
  styleUrls: ['./part-find.component.css']
})
export class PartFindComponent implements OnInit, OnDestroy{
  @ViewChild('data') jobForm: NgForm;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private partServe: PartService,
    private auth: AuthService
  ) {}

  onSubmit(){
    let part = this.jobForm.value.part
    let machine ="";
    let job ="";
    let searchHold = [];
    if (this.jobForm.value.job){
      job = this.jobForm.value.job;
      searchHold.push("job="+job);
    }
    if (this.jobForm.value.part){
      part = this.jobForm.value.part;
      searchHold.push("part="+part);
    }
    if (this.jobForm.value.machine){
      machine = this.jobForm.value.machine;
      searchHold.push("machine="+this.auth.splitJoin(machine));
    }
    let search = searchHold.join("&");
    let movement = "../"+search;
    this.router.navigate([movement], {relativeTo: this.route});
  }

  onCancel(){
    window.history.back();
  }

  ngOnInit(){
    this.auth.hideButton(1);
  }

  ngOnDestroy(){
    this.auth.showButton(1);
  }
}