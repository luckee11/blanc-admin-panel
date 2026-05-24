import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'ui-modal',
  standalone: true,
  imports: [DialogModule, ButtonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  readonly title      = input('');
  readonly size       = input<'sm' | 'md' | 'lg'>('md');
  readonly visible    = input(false);
  readonly showFooter = input(true);
  readonly close      = output<void>();

  readonly dialogStyle = computed<Record<string, string>>(() => {
    const widths: Record<string, string> = { sm: '420px', md: '560px', lg: '760px' };
    return { width: widths[this.size()] ?? '560px', 'max-height': 'calc(100vh - 48px)' };
  });
}
