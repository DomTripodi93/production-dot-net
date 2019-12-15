import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-change-log',
  templateUrl: './change-log.component.html',
  styleUrls: ['./change-log.component.css']
})
export class ChangeLogComponent implements OnInit {
  @ViewChild('logSelect', {static: false}) logSelectForm: NgForm;
  isShown = false;
  models = [
    "Machine",
    "Part",
    "Job",
    "Operation",
    "Production",
    "Hourly"
  ];
  defaultModel = "Machine";
  currentModel = "";

  constructor() { }

  ngOnInit() {
  }

  showLog(){
    this.isShown = false;
    this.currentModel = this.logSelectForm.value.model;
    this.isShown = true;
  }

}
