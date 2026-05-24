import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { ConfirmDeleteComponent } from '../../../../../shared/components/confirm-delete/confirm-delete.component';
import { formatDate } from '../../../../../shared/utils/format';
import { initialsOf } from '../../../../../shared/utils/text';
import { NewsFacade } from '../../../dataProviders/news.facade';
import { NewsItem } from '../../../models/interfaces/news-item.interface';
import { NewsStatus } from '../../../enums/news-status.enum';
import { getNewsStatusLabel } from '../../../utils/functions/news.functions';

@Component({
  selector: 'app-news-page',
  standalone: true,
  imports: [
    FormsModule, ButtonModule, InputTextModule, TextareaModule, SelectModule,
    TagModule, AvatarModule, CheckboxModule, TooltipModule,
    ModalComponent, PageHeaderComponent, ConfirmDeleteComponent,
  ],
  templateUrl: './news-page.component.html',
  styleUrl: './news-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsPageComponent {
  private facade     = inject(NewsFacade);
  private destroyRef = inject(DestroyRef);

  items = this.facade.news;
  search = '';
  status = '';

  readonly NewsStatus = NewsStatus;

  filtered = computed(() => {
    const q = this.search.toLowerCase().trim();
    return this.items().filter((n) => {
      if (this.status && n.status !== this.status) return false;
      if (!q) return true;
      return n.title.toLowerCase().includes(q) || n.excerpt.toLowerCase().includes(q);
    });
  });

  statusFilterOpts = [
    { label: 'Все статусы', value: '' },
    { label: 'Черновики', value: NewsStatus.Draft },
    { label: 'Запланированные', value: NewsStatus.Scheduled },
    { label: 'Опубликованные', value: NewsStatus.Published },
    { label: 'В архиве', value: NewsStatus.Archived },
  ];

  statusFormOpts = [
    { label: 'Черновик', value: NewsStatus.Draft },
    { label: 'Запланировано', value: NewsStatus.Scheduled },
    { label: 'Опубликовано', value: NewsStatus.Published },
    { label: 'В архиве', value: NewsStatus.Archived },
  ];

  modal = signal<'form' | 'view' | 'delete' | null>(null);
  editing = signal<NewsItem | null>(null);
  form: NewsItem = this.empty();

  empty(): NewsItem {
    return {
      id: '', title: '', category: 'HR', excerpt: '', body: '',
      status: NewsStatus.Draft, author: 'Анна Соколова',
      publishDate: new Date().toISOString().slice(0, 10),
      pinned: false,
    };
  }

  canSave() { return !!(this.form.title && this.form.body); }

  openCreate() { this.form = this.empty(); this.editing.set(null); this.modal.set('form'); }
  openEdit(n: NewsItem) { this.form = { ...n }; this.editing.set(n); this.modal.set('form'); }
  openView(n: NewsItem) { this.editing.set(n); this.modal.set('view'); }
  openDelete(n: NewsItem) { this.editing.set(n); this.modal.set('delete'); }
  closeModal() { this.modal.set(null); this.editing.set(null); }

  saveAs(s: NewsStatus) {
    this.form.status = s;
    if (!this.canSave()) return;
    const op$ = this.editing()?.id
      ? this.facade.update(this.form)
      : this.facade.create(this.form);
    op$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.closeModal());
  }

  doDelete() {
    const n = this.editing();
    if (!n) { this.closeModal(); return; }
    this.facade.delete(n.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.closeModal());
  }

  tagSeverity(s: NewsStatus): 'secondary' | 'info' | 'success' | 'warn' {
    const m: Record<NewsStatus, 'secondary' | 'info' | 'success' | 'warn'> = {
      [NewsStatus.Draft]: 'secondary', [NewsStatus.Scheduled]: 'info',
      [NewsStatus.Published]: 'success', [NewsStatus.Archived]: 'secondary',
    };
    return m[s] ?? 'secondary';
  }

  ini(n: string) { return initialsOf(n); }
  label(s: NewsStatus) { return getNewsStatusLabel(s); }
  fmt(d?: string) { return formatDate(d); }
}
