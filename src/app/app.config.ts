import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { MessageService, ConfirmationService } from 'primeng/api';
import { definePreset } from '@primeuix/themes';
import Nora from '@primeuix/themes/nora';

import { routes } from './app.routes';
import { authInterceptor } from './features/auth/interceptors/auth.interceptor';

const BlancPreset = definePreset(Nora, {
  primitive: {
    /* Кастомные цвета под бренд Blanc */
    blanc: {
      50: '#eef4ff',
      100: '#d8e8ff',
      200: '#b4d0ff',
      300: '#82b4ff',
      400: '#4b90fb',
      500: '#2563eb',
      600: '#1c4a82',
      700: '#143560',
      800: '#0b2444',
      900: '#071830',
      950: '#040f1f',
    },
  },
  semantic: {
    primary: {
      50: '{blanc.50}',
      100: '{blanc.100}',
      200: '{blanc.200}',
      300: '{blanc.300}',
      400: '{blanc.400}',
      500: '{blanc.500}',
      600: '{blanc.600}',
      700: '{blanc.700}',
      800: '{blanc.800}',
      900: '{blanc.900}',
      950: '{blanc.950}',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{blanc.800}',       /* #0b2444 — основной navy */
          inverseColor: '#ffffff',
          hoverColor: '{blanc.700}',
          activeColor: '{blanc.700}',
        },
        highlight: {
          background: '{blanc.50}',
          focusBackground: '{blanc.100}',
          color: '{blanc.800}',
          focusColor: '{blanc.800}',
        },
        content: {
          background: '#ffffff',
          hoverBackground: '{surface.50}',
          borderColor: '{surface.200}',
          color: '{surface.900}',
          hoverColor: '{surface.900}',
        },
        overlay: {
          select: {
            background: '#ffffff',
            borderColor: '{surface.200}',
            color: '{surface.900}',
          },
          popover: {
            background: '#ffffff',
            borderColor: '{surface.200}',
            color: '{surface.900}',
          },
          modal: {
            background: '#ffffff',
            borderColor: '{surface.200}',
            color: '{surface.900}',
          },
        },
      },
    },
  },
  components: {
    button: {
      root: {
        borderRadius: '10px',
        gap: '8px',
      },
    },
    inputtext: {
      root: {
        borderRadius: '10px',
      },
    },
    select: {
      root: {
        borderRadius: '10px',
      },
    },
    datatable: {
      headerCell: {
        background: '{surface.50}',
        color: '{surface.500}',
        borderColor: '{surface.200}',
      },
    },
    toast: {
      root: {
        borderRadius: '12px',
        width: '360px',
      },
    },
    card: {
      root: {
        borderRadius: '14px',
        shadow: '0 1px 2px rgba(15,23,42,.06)',
      },
    },
    dialog: {
      root: {
        borderRadius: '14px',
      },
    },
    badge: {
      root: {
        borderRadius: '999px',
      },
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
    MessageService,
    ConfirmationService,
    providePrimeNG({
      theme: {
        preset: BlancPreset,
        options: {
          darkModeSelector: false,
          cssLayer: {
            name: 'primeng',
            order: 'primeng, app',
          },
        },
      },
    }),
  ],
};
