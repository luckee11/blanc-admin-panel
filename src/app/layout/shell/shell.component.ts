import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AuthFacade } from '../../features/auth/dataProviders/auth.facade';
import { NAV } from './nav.config';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastModule, ButtonModule, BadgeModule, AvatarModule, IconComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  private auth       = inject(AuthFacade);
  private router     = inject(Router);
  private destroyRef = inject(DestroyRef);

  nav = NAV;
  collapsed = signal(false);
  userOpen = signal(false);
  user = this.auth.user;

  toggleSidebar() { this.collapsed.update((v) => !v); }

  logout() {
    this.auth.logout()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.router.navigate(['/login']));
  }
}
