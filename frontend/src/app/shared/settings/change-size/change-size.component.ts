import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-change-size',
  templateUrl: './change-size.component.html',
  styleUrls: ['./change-size.component.css']
})
export class ChangeSizeComponent implements OnInit {
  @Input() size: number;
  @Input() type: string;

  constructor() { }

  ngOnInit() {
    console.log(this.size);
    console.log(this.type);
  }

}
