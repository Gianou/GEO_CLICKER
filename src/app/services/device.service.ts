import { Injectable, Signal, computed } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  // Signal to hold whether the device is a handset
  private _isHandset = signal<boolean>(false);

  // Public readonly signal
  public readonly isHandset: Signal<boolean> = computed(() => this._isHandset());

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this._isHandset.set(result.matches);
    });
  }
}
