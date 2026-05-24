import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Employee } from '../../../models/interfaces/employee.interface';
import { initialsOf } from '../../../../../shared/utils/text';

@Component({
  selector: 'app-employee-row',
  standalone: true,
  imports: [],
  templateUrl: './employee-row.component.html',
  styleUrl: './employee-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeRowComponent {
  readonly employee = input.required<Employee>();

  readonly initials = computed(() => initialsOf(this.employee().fullName));
}
