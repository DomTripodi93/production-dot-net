import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-log',
  templateUrl: './change-log.component.html',
  styleUrls: ['./change-log.component.css']
})
export class ChangeLogComponent implements OnInit {
  isShown =[false, false, false, false]

  constructor() { }

  ngOnInit() {
  }

  showLog(i: number){
    this.isShown[i]= true;
  }

  hideLog(i: number){
    this.isShown[i]= false;
  }

}
