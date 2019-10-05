import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-change-time',
  templateUrl: './change-time.component.html',
  styleUrls: ['./change-time.component.css']
})
export class ChangeTimeComponent implements OnInit {
  @Input() time: string;

  constructor() { }

  ngOnInit() {
    console.log(this.time)
  }

}
