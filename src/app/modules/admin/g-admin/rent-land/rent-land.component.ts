import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'rent-land',
  templateUrl: './rent-land.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RentLandComponent {
  /**
   * Constructor
   */
  constructor() {
  }
}
