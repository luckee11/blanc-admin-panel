import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { ConfirmDeleteComponent } from '../../../../../shared/components/confirm-delete/confirm-delete.component';
import { ToastService } from '../../../../../shared/services/toast.service';
import { formatDateTime } from '../../../../../shared/utils/format';
import { EmailsFacade } from '../../../dataProviders/emails.facade';

@Component({
  selector: 'app-template-view',
  standalone: true,
  imports: [ButtonModule, PageHeaderComponent, ConfirmDeleteComponent],
  templateUrl: './template-view.component.html',
  styleUrl: './template-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateViewComponent {
  readonly id = input.required<string>();

  private facade     = inject(EmailsFacade);
  private router     = inject(Router);
  private toast      = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  template = computed(() => this.facade.templates().find((t) => t.id === this.id()) ?? null);

  confirmVisible = signal(false);

  back(): void {
    this.router.navigate(['/emails']);
  }

  confirmDelete(): void {
    const t = this.template();
    this.confirmVisible.set(false);
    if (!t) return;
    this.facade.deleteTemplate(t.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.toast.success('Шаблон удалён', t.name);
        this.router.navigate(['/emails']);
      });
  }

  fmt(d?: string): string { return formatDateTime(d); }
}
