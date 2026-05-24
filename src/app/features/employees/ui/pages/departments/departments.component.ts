import { ChangeDetectionStrategy, Component, DestroyRef, OnDestroy, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { initialsOf } from '../../../../../shared/utils/text';
import { EmployeesFacade } from '../../../dataProviders/employees.facade';
import { SquadPerson } from '../../../models/interfaces/squad.interface';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule, InputTextModule, AvatarModule, SkeletonModule,
    IconFieldModule, InputIconModule,
    PageHeaderComponent,
  ],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentsComponent implements OnInit, OnDestroy {
  private facade     = inject(EmployeesFacade);
  private destroyRef = inject(DestroyRef);

  squads  = this.facade.squads;
  loading = this.facade.squadsLoading;

  searchKeyword = '';
  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.refresh();
  }

  ngOnDestroy(): void {
    if (this.searchTimer) clearTimeout(this.searchTimer);
  }

  onSearchInput(): void {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.refresh(), 400);
  }

  refresh(): void {
    this.facade.loadSquads(this.searchKeyword.trim() || undefined)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  personName(p?: SquadPerson | null): string {
    return p?.fullName?.trim() || '—';
  }

  ini(p?: SquadPerson | null): string {
    if (!p) return '';
    return initialsOf(p.fullName || `${p.firstName ?? ''} ${p.lastName ?? ''}`);
  }
}
