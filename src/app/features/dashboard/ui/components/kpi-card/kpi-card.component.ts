import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from '../../../../../shared/components/icon/icon.component';
import { IconName } from '../../../../../shared/components/icon/icon.icons';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCardComponent {
  readonly value     = input.required<number>();
  readonly label     = input.required<string>();
  readonly icon      = input.required<IconName>();
  readonly delta     = input('');
  readonly deltaType = input<'up' | 'down' | ''>('');
  readonly iconColor = input<'blue' | 'gold' | 'emerald' | 'red'>('blue');
}
