import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'item',
  templateUrl: './sacred.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SacredComponent {
  /**
   * Constructor
   */
  constructor() {
  }
}
