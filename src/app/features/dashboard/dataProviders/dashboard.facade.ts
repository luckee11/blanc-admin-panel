import { Injectable, computed, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeesFacade } from '../../employees/dataProviders/employees.facade';
import { IprFacade } from '../../ipr/dataProviders/ipr.facade';
import { SurveysFacade } from '../../surveys/dataProviders/surveys.facade';
import { NewsFacade } from '../../news/dataProviders/news.facade';
import { EmailsFacade } from '../../emails/dataProviders/emails.facade';
import { IprStatus } from '../../ipr/enums/ipr-status.enum';
import { SurveyStatus } from '../../surveys/enums/survey-status.enum';
import { NewsStatus } from '../../news/enums/news-status.enum';
import { EmailStatus } from '../../emails/enums/email-status.enum';

@Injectable({ providedIn: 'root' })
export class DashboardFacade {
  private employeesF = inject(EmployeesFacade);
  private iprF = inject(IprFacade);
  private surveysF = inject(SurveysFacade);
  private newsF = inject(NewsFacade);
  private emailsF = inject(EmailsFacade);

  readonly stats = computed(() => ({
    employees: this.employeesF.employees().length,
    departments: this.employeesF.departments().length,
    activePlans: this.iprF.plans().filter(
      (p) => p.status === IprStatus.InProgress || p.status === IprStatus.OnReview,
    ).length,
    activeSurveys: this.surveysF.surveys().filter(
      (s) => s.status === SurveyStatus.Active,
    ).length,
    overdueTasks: this.iprF.tasks().filter(
      (t) => t.status === IprStatus.Overdue,
    ).length,
    publishedNews: this.newsF.news().filter(
      (n) => n.status === NewsStatus.Published,
    ).length,
    scheduledEmails: this.emailsF.emails().filter(
      (e) => e.status === EmailStatus.Scheduled,
    ).length,
  }));

  /** Последние ИПР с реального бэка (GET /api/admin/development-plans/recent). */
  readonly recentPlans        = this.iprF.recentDevelopmentPlans;
  readonly recentPlansLoading = this.iprF.recentPlansLoading;

  loadRecentDevelopmentPlans(limit = 5): Observable<void> {
    return this.iprF.loadRecentDevelopmentPlans(limit);
  }

  readonly activeSurveys = computed(() =>
    this.surveysF.surveys().filter((s) => s.status === SurveyStatus.Active).slice(0, 3),
  );

  readonly upcomingNews = computed(() =>
    this.newsF.news()
      .filter((n) => n.status === NewsStatus.Published || n.status === NewsStatus.Scheduled)
      .slice(0, 2),
  );

  /** Недавно добавленные сотрудники с реального бэка (GET /api/admin/humans/recent). */
  readonly recentHumans        = this.employeesF.recentHumans;
  readonly recentHumansLoading = this.employeesF.recentHumansLoading;

  loadRecentHumans(): Observable<void> {
    return this.employeesF.loadRecentHumans();
  }

  readonly totalResponses = computed(() =>
    this.surveysF.surveys().reduce((sum, s) => sum + s.responses, 0),
  );
}
