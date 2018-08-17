import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';

import { RoleGuard } from '@app/core/guard/role.guard';

import { UserListComponent } from './user/list/user-list.component';
import { UserCreateComponent } from './user/create/user-create.component';
import { UserUpdateComponent } from './user/update/user-update.component';
import { UserDetailsComponent } from './user/details/user-details.component';

import { RoleListComponent } from './role/list/role-list.component';
import { RoleCreateComponent } from './role/create/role-create.component';
import { RoleUpdateComponent } from './role/update/role-update.component';
import { RoleDetailsComponent } from './role/details/role-details.component';


const routes: Routes = [
  {
    path: 'user',
    component: UserListComponent,
    data: {title: 'Listado de Usuarios', expectedRole: 'ADMIN'},
    canActivate: [RoleGuard]
  },
  {
    path: 'user/create',
    component: UserCreateComponent,
    data: {title: 'Crear Usuario', expectedRole: 'ADMIN'},
    canActivate: [RoleGuard]
  },
  {
    path: 'user/update/:id',
    component: UserUpdateComponent,
    data: {title: 'Modificar Usuario', expectedRole: 'ADMIN'},
    canActivate: [RoleGuard]
  },
  {
    path: 'user/details/:id',
    component: UserDetailsComponent,
    data: {title: 'Detalles Usuario', expectedRole: 'ADMIN'},
    canActivate: [RoleGuard]
  },
  {
    path: 'role',
    component: RoleListComponent,
    data: {title: 'Listado de Roles', expectedRole: 'ADMIN'},
    canActivate: [RoleGuard]
  },
  {
    path: 'role/create',
    component: RoleCreateComponent,
    data: {title: 'Crear Rol', expectedRole: 'ADMIN'},
    canActivate: [RoleGuard]
  },
  {
    path: 'role/update/:id',
    component: RoleUpdateComponent,
    data: {title: 'Modificar Rol', expectedRole: 'ADMIN'},
    canActivate: [RoleGuard]
  },
  {
    path: 'role/details/:id',
    component: RoleDetailsComponent,
    data: {title: 'Detalles Rol', expectedRole: 'ADMIN'},
    canActivate: [RoleGuard]
  },
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    UserListComponent, UserCreateComponent, UserUpdateComponent, UserDetailsComponent,
    RoleListComponent, RoleCreateComponent, RoleUpdateComponent, RoleDetailsComponent
  ]
})

export class AdminModule { }
