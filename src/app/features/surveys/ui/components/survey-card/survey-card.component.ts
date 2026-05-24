import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { formatDate } from '../../../../../shared/utils/format';
import { Survey } from '../../../models/interfaces/survey.interface';
import { SurveyStatus } from '../../../enums/survey-status.enum';
import { getSurveyStatusLabel, calcResponseRate } from '../../../utils/functions/surveys.functions';

@Component({
  selector: 'app-survey-card',
  standalone: true,
  imports: [ButtonModule, TagModule, ProgressBarModule],
  templateUrl: './survey-card.component.html',
  styleUrl: './survey-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurveyCardComponent {
  readonly survey = input.required<Survey>();
  readonly view   = output<void>();
  readonly edit   = output<void>();
  readonly delete = output<void>();

  readonly statusLabel  = computed(() => getSurveyStatusLabel(this.survey().status));
  readonly responseRate = computed(() => calcResponseRate(this.survey()));

  fmt(d: string) { return formatDate(d); }

  tagSeverity(s: SurveyStatus): 'secondary' | 'success' | 'info' | 'warn' {
    const m: Record<SurveyStatus, 'secondary' | 'success' | 'info' | 'warn'> = {
      [SurveyStatus.Draft]: 'secondary', [SurveyStatus.Active]: 'success',
      [SurveyStatus.Completed]: 'info', [SurveyStatus.Archived]: 'secondary',
    };
    return m[s] ?? 'secondary';
  }
}
