import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'event-land',
  templateUrl: './event-land.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventLandComponent {
  /**
   * Constructor
   */
  constructor() {
  }
}
