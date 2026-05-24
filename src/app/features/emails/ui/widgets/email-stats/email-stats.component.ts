import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { EmailMessage } from '../../../models/interfaces/email-message.interface';
import { EmailStatus } from '../../../enums/email-status.enum';

@Component({
  selector: 'app-email-stats',
  standalone: true,
  templateUrl: './email-stats.component.html',
  styleUrl: './email-stats.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailStatsComponent {
  readonly emails = input.required<EmailMessage[]>();

  count(s: EmailStatus) {
    return this.emails().filter((e) => e.status === s).length;
  }

  readonly EmailStatus = EmailStatus;
}
