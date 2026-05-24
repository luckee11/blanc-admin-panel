import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'ui-confirm-delete',
  standalone: true,
  imports: [ModalComponent, ButtonModule],
  templateUrl: './confirm-delete.component.html',
  styleUrl: './confirm-delete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDeleteComponent {
  readonly visible = input(false);
  readonly entity  = input('эту запись');
  readonly confirm = output<void>();
  readonly cancel  = output<void>();
}
