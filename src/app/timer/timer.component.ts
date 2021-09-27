import { Component, OnInit } from '@angular/core';
import { interval, fromEvent } from 'rxjs';
import { buffer, throttle, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit {
  seconds = 0;
  minutes = 0;
  isActive = false;
  timer = ``;

  ngOnInit() {
    const obs$ = interval(1000);
    obs$.subscribe(() => {
      if (this.isActive) this.seconds++;
      if (this.seconds === 60) {
        this.minutes++;
        this.seconds = 0;
      }
      let minutes = '0' + this.minutes;
      let seconds = '0' + this.seconds;
      this.timer = `${minutes.slice(-2)} : ${seconds.slice(-2)}`;
    });
    const btn = document.getElementsByClassName('timer__btn__wait');

    const clickStream$ = fromEvent(btn, 'click');
    const dbClick = clickStream$.pipe(
      buffer(clickStream$.pipe(throttle((ev) => interval(500)))),
      map((arr) => arr.length),
      filter((len) => len === 2)
    );
    dbClick.subscribe((e) => (this.isActive = false));
  }

  start() {
    this.isActive = true;
  }
  stop() {
    this.isActive = false;
    this.seconds = 0;
    this.minutes = 0;
  }
  reset() {
    this.seconds = 0;
    this.minutes = 0;
  }
}
