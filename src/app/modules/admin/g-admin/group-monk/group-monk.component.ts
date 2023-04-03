import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'group-monk',
  templateUrl: './group-monk.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupMonkComponent {
  /**
   * Constructor
   */
  constructor() {
  }
}
