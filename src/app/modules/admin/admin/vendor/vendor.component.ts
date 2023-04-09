import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'permission',
  templateUrl: './vendor.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VendorComponent {
  /**
   * Constructor
   */
  constructor() {
  }
}
