
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
        this.date = new Date;
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

    dateForForm(date){
        console.log(date)
        let dateHold = date.split("-");
        if (dateHold[0].length != 2){
            dateHold[0] = "0" + dateHold[0];
        };
        if (dateHold[1].length != 2){
            dateHold[1] = "0" + dateHold[1];
        };
        date = dateHold[2] + "-" + dateHold[0] + "-" + dateHold[1];
          return date;
    }
}