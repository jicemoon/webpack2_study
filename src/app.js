require("./app.scss");

import {
  Observable
} from 'rxjs/observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/scan';

let rxFromEle = document.getElementById('rxFrom');
let rxFromOutput = document.getElementById('rxFromOutput');
let obser = Observable.fromEvent(rxFromEle, 'click');
obser.throttleTime(1000)
  .scan(count => count + 1, rxFromOutput.innerText - 0)
  .subscribe((count) => {
    rxFromOutput.innerText = count;
  })