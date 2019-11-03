import { Component, OnInit, OnDestroy } from '@angular/core';
import { Part } from '../part.model';
import { Subscription } from 'rxjs';
import { PartService } from '../part.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-part-show',
  templateUrl: './part-show.component.html',
  styleUrls: ['./part-show.component.css']
})
export class PartShowComponent implements OnInit, OnDestroy{
  parts: Part[] = [];
  subscriptions: Subscription[] =[];
  isFetching = false;
  isError = false;
  error = '';

  constructor(
    private partServ: PartService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    if (this.partServ.onlyActive == true){
      this.getParts();
    } else {
      this.getAllParts();
    }
    this.subscriptions.push(this.partServ.partChanged.subscribe(()=>{
      setTimeout(()=>{
        if (this.partServ.onlyActive == true){
          this.getParts();
        } else {
          this.getAllParts();
        }
      }, 50);
    }));
  }

  getParts(){
    this.subscriptions.push(this.partServ.fetchPartsByType()
    .subscribe(parts => {
      this.parts = parts;
      this.isFetching = false;
    }, error => {
      this.isFetching = false;
      this.isError = true;
      this.error = error.message
    }));
  }

  getAllParts(){
    this.subscriptions.push(this.partServ.fetchAllPartsByType()
    .subscribe(parts => {
      this.parts = parts;
      this.isFetching = false;
    }, error => {
      this.isFetching = false;
      this.isError = true;
      this.error = error.message
    }));
  }

  ngOnDestroy(){
    this.parts = [];
    this.subscriptions.forEach((sub)=>{
      sub.unsubscribe();
    })
  }

}