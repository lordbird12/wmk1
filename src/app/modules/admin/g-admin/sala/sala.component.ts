import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'sala',
  templateUrl: './sala.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalaComponent {
  /**
   * Constructor
   */
  constructor() {
  }
}
