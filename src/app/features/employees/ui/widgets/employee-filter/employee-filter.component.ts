import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../../shared/components/icon/icon.component';
import { EmploymentStatus } from '../../../enums/employment-status.enum';

@Component({
  selector: 'app-employee-filter',
  standalone: true,
  imports: [FormsModule, IconComponent],
  templateUrl: './employee-filter.component.html',
  styleUrl: './employee-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeFilterComponent {
  readonly departments = input<string[]>([]);
  readonly resultCount = input(0);

  readonly searchChange = output<string>();
  readonly deptChange   = output<string>();
  readonly statusChange = output<string>();

  search = '';
  dept = '';
  status = '';

  readonly EmploymentStatus = EmploymentStatus;

  onSearch() { this.searchChange.emit(this.search); }
  onDept()   { this.deptChange.emit(this.dept); }
  onStatus() { this.statusChange.emit(this.status); }
}
