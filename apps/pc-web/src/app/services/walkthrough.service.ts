import { Injectable, inject } from '@angular/core';
import { ShepherdService } from 'angular-shepherd';
import { WALKTHROUGHS, WalkthroughItem } from '../constants/walkthroughs';


@Injectable({
  providedIn: 'root'
})
export class WalkthroughService {
  walkthroughs: WalkthroughItem[] = WALKTHROUGHS;
  shepherdService = inject(ShepherdService); 

  start() {
    const tour = this.shepherdService;
    tour.modal = true;
    const steps = this.walkthroughs.filter(walkthrough => {
      return !localStorage.getItem(walkthrough.storageKey)
    }).map(walkthrough => {
      localStorage.setItem(walkthrough.storageKey, 'viewed');
      return walkthrough.config;
    });
    this.shepherdService.addSteps(steps);
    this.shepherdService.start();
  }

  isActive() {
    return this.shepherdService.isActive;
  }

  stop() {
    this.shepherdService.cancel();
  }
}
