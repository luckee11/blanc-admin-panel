import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ICONS, IconName } from './icon.icons';

@Component({
  selector: 'ui-icon',
  standalone: true,
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  readonly name   = input<IconName>('home');
  readonly size   = input(18);
  readonly stroke = input(2);

  readonly path = computed(() => ICONS[this.name()] ?? '');
}
