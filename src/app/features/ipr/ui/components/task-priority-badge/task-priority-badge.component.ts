import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TaskPriority } from '../../../enums/task-priority.enum';
import { getPriorityBadge, getPriorityLabel } from '../../../utils/functions/ipr.functions';

@Component({
  selector: 'app-task-priority-badge',
  standalone: true,
  template: `<span class="badge {{ badgeClass() }}">{{ priorityLabel() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskPriorityBadgeComponent {
  readonly priority = input.required<TaskPriority>();

  readonly badgeClass    = computed(() => getPriorityBadge(this.priority()));
  readonly priorityLabel = computed(() => getPriorityLabel(this.priority()));
}
