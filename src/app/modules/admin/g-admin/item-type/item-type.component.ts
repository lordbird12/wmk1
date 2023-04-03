import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'permission',
  templateUrl: './item-type.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemTypeComponent {
  /**
   * Constructor
   */
  constructor() {
  }
}
