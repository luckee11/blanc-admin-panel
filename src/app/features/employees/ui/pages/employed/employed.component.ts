import { ChangeDetectionStrategy, Component, DestroyRef, OnDestroy, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { initialsOf } from '../../../../../shared/utils/text';
import { EmployeesFacade } from '../../../dataProviders/employees.facade';
import { Human } from '../../../models/interfaces/human.interface';
import { getHumanStatusSeverity } from '../../../utils/functions/employees.functions';

const DEFAULT_PAGE_SIZE = 10;

@Component({
  selector: 'app-employed',
  standalone: true,
  imports: [
    FormsModule,
    TableModule, ButtonModule, InputTextModule,
    TagModule, AvatarModule, TooltipModule,
    IconFieldModule, InputIconModule,
    PageHeaderComponent,
  ],
  templateUrl: './employed.component.html',
  styleUrl: './employed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployedComponent implements OnDestroy {
  protected facade = inject(EmployeesFacade);
  private router      = inject(Router);
  private destroyRef  = inject(DestroyRef);

  humans     = this.facade.humans;
  pagination = this.facade.humansPagination;
  loading    = this.facade.humansLoading;

  searchKeyword   = '';
  currentPageSize = DEFAULT_PAGE_SIZE;

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  onLazyLoad(event: TableLazyLoadEvent): void {
    const rows = event.rows ?? DEFAULT_PAGE_SIZE;
    const page = Math.floor((event.first ?? 0) / rows);
    this.currentPageSize = rows;
    this.runSearch(page, rows);
  }

  onSearchInput(): void {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.runSearch(0, this.currentPageSize);
    }, 400);
  }

  refresh(): void {
    this.runSearch(0, this.currentPageSize);
  }

  ngOnDestroy(): void {
    if (this.searchTimer) clearTimeout(this.searchTimer);
  }

  openDetail(h: Human): void {
    this.router.navigate(['/employees/employed', h.id]);
  }

  tagSeverity(s: string): 'success' | 'warn' | 'info' | 'danger' | 'secondary' {
    return getHumanStatusSeverity(s);
  }

  ini(n: string) { return initialsOf(n); }

  private runSearch(page: number, pageSize: number): void {
    this.facade.searchHumans({
      keyword: this.searchKeyword.trim() || undefined,
      page,
      pageSize,
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
