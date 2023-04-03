import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'item',
  templateUrl: './gallery.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryComponent {
  /**
   * Constructor
   */
  constructor() {
  }
}
