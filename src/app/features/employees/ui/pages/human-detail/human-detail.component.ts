import { ChangeDetectionStrategy, Component, DestroyRef, OnDestroy, OnInit, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { ConfirmDeleteComponent } from '../../../../../shared/components/confirm-delete/confirm-delete.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { ToastService } from '../../../../../shared/services/toast.service';
import { formatDate } from '../../../../../shared/utils/format';
import { initialsOf } from '../../../../../shared/utils/text';
import { EmployeesFacade } from '../../../dataProviders/employees.facade';
import { Human, UpdateHumanRequest } from '../../../models/interfaces/human.interface';
import { getHumanStatusSeverity } from '../../../utils/functions/employees.functions';

type EditForm = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  location: string;
  region: string;
  dn: string;
  sAMAccountName: string;
  hireDate: string;
  image: string;
  supervisor: Human | null;
  mainSupervisor: Human | null;
};

@Component({
  selector: 'app-human-detail',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule, TagModule, AvatarModule, SkeletonModule, InputTextModule, AutoCompleteModule,
    ConfirmDeleteComponent, PageHeaderComponent, ModalComponent,
  ],
  templateUrl: './human-detail.component.html',
  styleUrl: './human-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HumanDetailComponent implements OnInit, OnDestroy {
  readonly id = input.required<string>();

  protected facade = inject(EmployeesFacade);
  private router      = inject(Router);
  private toast       = inject(ToastService);
  private destroyRef  = inject(DestroyRef);

  human   = this.facade.selectedHuman;
  loading = this.facade.selectedHumanLoading;

  confirmVisible = signal(false);
  deleting       = signal(false);

  editVisible = signal(false);
  saving      = signal(false);
  form: EditForm = this.emptyForm();

  /* ===== Autocomplete state ===== */
  supervisorSuggestions     = signal<Human[]>([]);
  mainSupervisorSuggestions = signal<Human[]>([]);
  supervisorTouched     = signal(false);
  mainSupervisorTouched = signal(false);

  /* ===== Computed presentation ===== */
  readonly fullName = computed(() => {
    const h = this.human();
    if (!h) return '';
    return [h.lastName, h.firstName, h.patronymic].filter(Boolean).join(' ');
  });

  readonly initials = computed(() => initialsOf(this.fullName()));

  ngOnInit(): void {
    this.facade.loadHumanById(this.id())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.facade.clearSelectedHuman();
  }

  back(): void {
    this.router.navigate(['/employees/employed']);
  }

  confirmDelete(): void {
    this.confirmVisible.set(false);
    this.deleting.set(true);
    this.facade.deleteHuman(this.id())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.deleting.set(false);
          this.router.navigate(['/employees/employed']);
        },
        error: () => this.deleting.set(false),
      });
  }

  /* ===== Edit ===== */
  openEdit(): void {
    const h = this.human();
    if (!h) return;
    this.form = {
      firstName:      h.firstName ?? '',
      lastName:       h.lastName ?? '',
      dateOfBirth:    this.toDateInput(h.dateOfBirth),
      email:          h.email ?? '',
      location:       h.location ?? '',
      region:         '',
      dn:             h.dn ?? '',
      sAMAccountName: '',
      hireDate:       this.toDateInput(h.dateOfEmployment),
      image:          h.image ?? '',
      supervisor:     null,
      mainSupervisor: null,
    };
    this.supervisorTouched.set(false);
    this.mainSupervisorTouched.set(false);
    this.supervisorSuggestions.set([]);
    this.mainSupervisorSuggestions.set([]);
    this.editVisible.set(true);
  }

  closeEdit(): void {
    if (this.saving()) return;
    this.editVisible.set(false);
  }

  saveEdit(): void {
    const body = this.buildPatchBody();
    if (!Object.keys(body).length) {
      this.editVisible.set(false);
      return;
    }
    this.saving.set(true);
    this.facade.updateHuman(this.id(), body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.success('Сохранено', 'Изменения применены');
          this.editVisible.set(false);
          this.saving.set(false);
        },
        error: () => {
          this.toast.error('Не удалось сохранить', 'Попробуйте ещё раз');
          this.saving.set(false);
        },
      });
  }

  /* ===== Autocomplete handlers ===== */
  searchSupervisor(event: AutoCompleteCompleteEvent): void {
    this.facade.searchHumansLite(event.query, this.id())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((list) => this.supervisorSuggestions.set(list));
  }

  searchMainSupervisor(event: AutoCompleteCompleteEvent): void {
    this.facade.searchHumansLite(event.query, this.id())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((list) => this.mainSupervisorSuggestions.set(list));
  }

  onSupervisorSelect(h: Human): void {
    this.form.supervisor = h;
    this.supervisorTouched.set(true);
  }

  onSupervisorClear(): void {
    this.form.supervisor = null;
    this.supervisorTouched.set(true);
  }

  onMainSupervisorSelect(h: Human): void {
    this.form.mainSupervisor = h;
    this.mainSupervisorTouched.set(true);
  }

  onMainSupervisorClear(): void {
    this.form.mainSupervisor = null;
    this.mainSupervisorTouched.set(true);
  }

  /** Собираем только изменённые/непустые поля, чтобы не перезаписать чужие значения пустыми строками. */
  private buildPatchBody(): UpdateHumanRequest {
    const h = this.human();
    const body: UpdateHumanRequest = {};
    if (!h) return body;

    const initial: Omit<EditForm, 'supervisor' | 'mainSupervisor'> = {
      firstName:      h.firstName ?? '',
      lastName:       h.lastName ?? '',
      dateOfBirth:    this.toDateInput(h.dateOfBirth),
      email:          h.email ?? '',
      location:       h.location ?? '',
      region:         '',
      dn:             h.dn ?? '',
      sAMAccountName: '',
      hireDate:       this.toDateInput(h.dateOfEmployment),
      image:          h.image ?? '',
    };

    const f = this.form;
    if (f.firstName.trim()      !== initial.firstName)      body.firstName      = f.firstName.trim();
    if (f.lastName.trim()       !== initial.lastName)       body.lastName       = f.lastName.trim();
    if (f.email.trim()          !== initial.email)          body.email          = f.email.trim();
    if (f.location.trim()       !== initial.location)       body.location       = f.location.trim();
    if (f.region.trim()         !== initial.region)         body.region         = f.region.trim();
    if (f.dn.trim()             !== initial.dn)             body.dn             = f.dn.trim();
    if (f.sAMAccountName.trim() !== initial.sAMAccountName) body.sAMAccountName = f.sAMAccountName.trim();
    if (f.image.trim()          !== initial.image)          body.image          = f.image.trim() || null;
    if (f.dateOfBirth           !== initial.dateOfBirth && f.dateOfBirth) body.dateOfBirth = this.toIso(f.dateOfBirth);
    if (f.hireDate              !== initial.hireDate       && f.hireDate)    body.hireDate    = this.toIso(f.hireDate);

    if (this.supervisorTouched())     body.supervisorId      = f.supervisor?.id      ?? null;
    if (this.mainSupervisorTouched()) body.main_supervisorId = f.mainSupervisor?.id ?? null;

    return body;
  }

  private emptyForm(): EditForm {
    return {
      firstName: '', lastName: '', dateOfBirth: '',
      email: '', location: '', region: '',
      dn: '', sAMAccountName: '',
      hireDate: '', image: '',
      supervisor: null, mainSupervisor: null,
    };
  }

  private toDateInput(iso: string | null | undefined): string {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  }

  private toIso(date: string): string {
    return new Date(date).toISOString();
  }

  /* ===== Helpers ===== */
  tagSeverity(s: string): 'success' | 'warn' | 'info' | 'danger' | 'secondary' {
    return getHumanStatusSeverity(s);
  }

  fmt(d: string | null | undefined): string { return d ? formatDate(d) : '—'; }

  fmtTz(tz: number): string {
    if (tz === 0) return 'UTC+0 (Москва)';
    return tz > 0 ? `UTC+${tz}` : `UTC${tz}`;
  }
}
