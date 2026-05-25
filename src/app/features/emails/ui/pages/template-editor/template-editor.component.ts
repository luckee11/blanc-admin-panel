import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { EditorModule } from 'primeng/editor';

import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { ToastService } from '../../../../../shared/services/toast.service';
import { EmailsFacade } from '../../../dataProviders/emails.facade';

@Component({
  selector: 'app-template-editor',
  standalone: true,
  imports: [FormsModule, ButtonModule, InputTextModule, EditorModule, PageHeaderComponent],
  templateUrl: './template-editor.component.html',
  styleUrl: './template-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateEditorComponent {
  private facade     = inject(EmailsFacade);
  private router     = inject(Router);
  private toast      = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  name = '';
  subject = '';
  description = '';
  body = '';
  saving = signal(false);

  canSave(): boolean {
    return !!(this.name.trim() && this.subject.trim() && this.body?.trim());
  }

  back(): void {
    this.router.navigate(['/emails']);
  }

  save(): void {
    if (!this.canSave()) return;
    this.saving.set(true);
    this.facade.saveTemplate({
      name: this.name.trim(),
      subject: this.subject.trim(),
      description: this.description.trim() || null,
      body: this.body,
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.success('Шаблон сохранён', this.name.trim());
          this.router.navigate(['/emails']);
        },
        error: () => {
          this.saving.set(false);
          this.toast.error('Не удалось сохранить шаблон', 'Попробуйте ещё раз');
        },
      });
  }
}
