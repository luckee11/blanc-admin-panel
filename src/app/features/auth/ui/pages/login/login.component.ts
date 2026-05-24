import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { IconComponent } from '../../../../../shared/components/icon/icon.component';
import { AuthFacade } from '../../../dataProviders/auth.facade';
import { AUTH_ERRORS } from '../../../utils/constants/auth.constants';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule, PasswordModule, CheckboxModule,
    MessageModule, IconFieldModule, InputIconModule,
    IconComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private auth       = inject(AuthFacade);
  private router     = inject(Router);
  private destroyRef = inject(DestroyRef);

  email    = '';
  password = '';
  skipAD   = false;

  error   = signal<string | null>(null);
  loading = signal(false);

  submit(e: Event) {
    e.preventDefault();
    this.error.set(null);
    this.loading.set(true);

    this.auth.login({
      email:    this.email.trim(),
      password: this.password,
      skipAD:   this.skipAD,
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.loading.set(false);

        if (!result.ok) {
          this.error.set(result.error ?? AUTH_ERRORS.loginFailed);
          return;
        }
        this.router.navigate(['/dashboard']);
      });
  }
}
