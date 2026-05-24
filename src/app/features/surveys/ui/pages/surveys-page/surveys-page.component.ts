import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { ConfirmDeleteComponent } from '../../../../../shared/components/confirm-delete/confirm-delete.component';
import { formatDate } from '../../../../../shared/utils/format';
import { SurveysFacade } from '../../../dataProviders/surveys.facade';
import { Survey } from '../../../models/interfaces/survey.interface';
import { SurveyStatus } from '../../../enums/survey-status.enum';
import { SurveyCardComponent } from '../../components/survey-card/survey-card.component';
import { getSurveyStatusLabel, getSurveyStatusBadge, calcResponseRate } from '../../../utils/functions/surveys.functions';

@Component({
  selector: 'app-surveys-page',
  standalone: true,
  imports: [
    FormsModule, ButtonModule, InputTextModule, TextareaModule, SelectModule, TagModule,
    ModalComponent, PageHeaderComponent, ConfirmDeleteComponent, SurveyCardComponent,
  ],
  templateUrl: './surveys-page.component.html',
  styleUrl: './surveys-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurveysPageComponent {
  private facade     = inject(SurveysFacade);
  private destroyRef = inject(DestroyRef);

  surveys = this.facade.surveys;

  statusFormOpts = [
    { label: 'Черновик',   value: SurveyStatus.Draft },
    { label: 'Активный',   value: SurveyStatus.Active },
    { label: 'Завершён',   value: SurveyStatus.Completed },
    { label: 'В архиве',   value: SurveyStatus.Archived },
  ];

  modal = signal<'form' | 'view' | 'delete' | null>(null);
  editing = signal<Survey | null>(null);
  form: Survey = this.empty();

  empty(): Survey {
    return {
      id: '', title: '', description: '', status: SurveyStatus.Draft,
      audience: 'Все сотрудники', questions: 10, responses: 0, totalRecipients: 0,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    };
  }

  canSave() { return !!this.form.title; }

  openCreate() { this.form = this.empty(); this.editing.set(null); this.modal.set('form'); }
  openEdit(s: Survey) { this.form = { ...s }; this.editing.set(s); this.modal.set('form'); }
  openView(s: Survey) { this.editing.set(s); this.modal.set('view'); }
  openDelete(s: Survey) { this.editing.set(s); this.modal.set('delete'); }
  closeModal() { this.modal.set(null); this.editing.set(null); }

  save() {
    if (!this.canSave()) return;
    this.form.questions = Number(this.form.questions) || 0;
    this.form.totalRecipients = Number(this.form.totalRecipients) || 0;
    this.form.responses = Number(this.form.responses) || 0;
    const op$ = this.editing()?.id
      ? this.facade.update(this.form)
      : this.facade.create(this.form);
    op$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.closeModal());
  }

  doDelete() {
    const s = this.editing();
    if (!s) { this.closeModal(); return; }
    this.facade.delete(s.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.closeModal());
  }

  pct(s: Survey) { return calcResponseRate(s); }
  label(s: SurveyStatus) { return getSurveyStatusLabel(s); }
  badge(s: SurveyStatus) { return getSurveyStatusBadge(s); }
  fmt(d?: string) { return formatDate(d); }

  tagSeverity(s: SurveyStatus): 'secondary' | 'success' | 'info' | 'warn' {
    const m: Record<SurveyStatus, 'secondary' | 'success' | 'info' | 'warn'> = {
      [SurveyStatus.Draft]: 'secondary', [SurveyStatus.Active]: 'success',
      [SurveyStatus.Completed]: 'info', [SurveyStatus.Archived]: 'secondary',
    };
    return m[s] ?? 'secondary';
  }
}
