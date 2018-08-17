import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '@app/core/services/auth.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

import { routerTransition } from '@app/core/animations/router.transition';

import { environment as env } from '@env/environment';

@Component({
  selector: 'app-layout',
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav
        #drawer
        class="sidenav"
        fixedInViewport="true"
        [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
        [mode]="(isHandset$ | async) ? 'over' : 'side'"
        [opened]="!(isHandset$ | async)">
        <mat-toolbar class="shadow-navbar" color="primary">
          <img class="logo" src="assets/icono.svg" />
          <span *ngIf="!(isHandset$ | async)">{{appName}}</span>
        </mat-toolbar>
        <mat-nav-list>
          <a class="menu" *ngIf="(isAdmin | async)"
                mat-list-item routerLink="/admin/user" routerLinkActive="active">
            <mat-icon aria-label="users">person</mat-icon>
            <span>Gestión de Usuarios</span>
          </a>
          <a class="menu" *ngIf="(isAdmin | async)"
                mat-list-item routerLink="/admin/role" routerLinkActive="active">
            <mat-icon aria-label="roles">supervisor_account</mat-icon>
            <span>Gestión de Roles</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar class="shadow-navbar" color="primary">
          <mat-toolbar-row>
            <button
              type="button"
              aria-label="Toggle sidenav"
              mat-icon-button
              (click)="drawer.toggle()"
              *ngIf="isHandset$ | async">
              <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
            </button>

            <span class="spacer"></span>

            <button mat-button [matMenuTriggerFor]="menu">
              <span *ngIf="isLoggedIn | async">Bienvenido {{firstname | async}}</span>
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <button mat-menu-item *ngIf="isLoggedIn | async" routerLink="auth/change_password">
                <mat-icon>lock_open</mat-icon>
                <span>Cambiar Contraseña</span>
              </button>

              <button mat-menu-item *ngIf="isLoggedIn | async" routerLink="auth/profile">
                <mat-icon>person</mat-icon>
                <span>Pérfil</span>
              </button>

              <mat-divider *ngIf="isLoggedIn | async"></mat-divider>

              <button mat-menu-item *ngIf="isLoggedIn | async"  (click)="logout()">
                <mat-icon>lock</mat-icon>
                <span>Cerrar Sesión</span>
              </button>
              <button mat-menu-item *ngIf="!(isLoggedIn | async)" routerLink="auth/signup">
                <mat-icon>account_circle</mat-icon>
                <span>Regístrase</span>
              </button>

              <button mat-menu-item *ngIf="!(isLoggedIn | async)" routerLink="auth/login">
                <mat-icon>lock_open</mat-icon>
                <span>Iniciar Sesión</span>
              </button>
            </mat-menu>
          </mat-toolbar-row>
        </mat-toolbar>

        <div class="layout">
          <router-outlet></router-outlet>
        </div>

      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100%;
    }

    mat-nav-list a.menu {
      margin-top: 2px;
      margin-bottom: 2px;
    }

    .mat-month-view > table.mat-calendar-table {
      width: 220px;
    }

    .sidenav {
      width: 220px;
      box-shadow: 3px 0 6px rgba(0,0,0,.24);
    }

    .mat-toolbar-row, .mat-toolbar-single-row {
      height: 64px;
    }

    .layout {
      overflow-y: scroll;
      height: 93.0vh;
      min-height auto;
    }

    mat-toolbar button.active, mat-toolbar a.active {
      color: white;
      background: rgba(27, 26, 26, 0.2);
      padding-top: 13.5px;
      padding-bottom: 13px;
    }

    mat-toolbar button.mat-button, mat-toolbar a.mat-button {
      color: white;
      padding-top: 13.5px;
      padding-bottom: 13px;
    }

    .shadow-navbar {
      box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12);
    }


    a.active {
      background: rgba(27, 26, 26, 0.2);
    }

    .logo {
      width: 50px;
      padding-left: 10px;
      padding-right: 10px;
    }

  `]
})
export class LayoutComponent implements OnInit {

  isLoggedIn: Observable<boolean>;
  isAdmin: Observable<boolean>;
  firstname: Observable<string>;

  envName = env.envName;
  appName = env.appName;
  year = new Date().getFullYear();
  isProd = env.production;


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.firstname = this.authService.getFirstname();
    this.isAdmin = this.authService.isAdmin();
  }

  logout(): void {
    this.authService.logout();
    this.snackBar.open('Usted a cerrado su sesión', 'X', {duration: 3000});
    this.router.navigate(['auth', 'login']);
  }

}
