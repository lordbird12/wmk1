import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'deposit',
  templateUrl: './deposit.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepositComponent {
  /**
   * Constructor
   */
  constructor() {
  }
}
