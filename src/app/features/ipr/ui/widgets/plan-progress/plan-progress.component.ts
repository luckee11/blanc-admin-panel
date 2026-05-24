import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IprPlan } from '../../../models/interfaces/ipr-plan.interface';
import { IprStatus } from '../../../enums/ipr-status.enum';

@Component({
  selector: 'app-plan-progress',
  standalone: true,
  templateUrl: './plan-progress.component.html',
  styleUrl: './plan-progress.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanProgressComponent {
  readonly plan = input.required<IprPlan>();

  readonly progressColor = computed(() => {
    const p = this.plan();
    if (p.status === IprStatus.Overdue) return '#ef4444';
    if (p.status === IprStatus.Completed) return '#10b981';
    return '';
  });
}
