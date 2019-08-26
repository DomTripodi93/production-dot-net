
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class DaysService {
    date = new Date();
    today = "";
    month: number;
    stringMonth = "";
    year: number;
    day: number;
    dates = [];

    resetDate(){
        this.today = ""+this.date.getDate();;
        this.month = this.date.getMonth()+1;
        this.stringMonth = ""+this.month;
        this.year = this.date.getFullYear();
    }

    dashToSlash(date){
        let dateHold = date.split("-");
        date = dateHold.join("/")
          return date;
    }
}