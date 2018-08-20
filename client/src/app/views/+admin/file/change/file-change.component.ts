import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import gql from 'graphql-tag';


const singleUpload = gql`
mutation changeFile($file: Upload!, $where: FileWhereUniqueInput!) {
  changeFile(file: $file, where: $where) {
    filename
  }
}
`;

@Component({
  selector: 'app-file-change',
  template: `
    <div class="container">
      <div class="loading">
        <mat-progress-bar *ngIf="loading" color="warn"></mat-progress-bar>
      </div>
    </div>
    <br />
    <div class="container" fxLayout="row" fxLayoutAlign="center center">
      <div class="item" fxFlex="50%" fxFlex.xs="98%" fxFlex.md="70%">

        <div class="mat-elevation-z8">
          <form [formGroup]="fileUploadForm" #f="ngForm" (ngSubmit)="onUploadfile()" class="form">
            <mat-card class="file-card">
              <mat-card-header>
                <mat-card-title>
                  <h1>Subir Archivo</h1>
                </mat-card-title>
              </mat-card-header>

              <mat-card-content>

                <div class="full-width">
                  <input required type="file" (change)="fileChange($event)" placeholder="File" formControlName="file">
                </div>

              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="primary" type="submit" [disabled]="!fileUploadForm.valid" aria-label="singleUpload">
                  <mat-icon>add</mat-icon>
                  <span>Archivo</span>
                </button>

                <button mat-raised-button color="accent" routerLink="/admin/file" routerLinkActive type="button" aria-label="filesList">
                  <mat-icon>list</mat-icon>
                  <span>Listado de files</span>
                </button>
              </mat-card-actions>
            </mat-card>
          </form>
        </div>
      </div>
    </div>

  `,
  styles: [`
    .full-width {
      width: 100%;
    }
  `]
})
export class FileChangeComponent implements OnInit {

  fileUploadForm: FormGroup;
  file: FileList;
  fileId: string;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) { }

  ngOnInit() {

    this.fileUploadForm = this.formBuilder.group({
      file: ['', Validators.required]
    });
  }

  onUploadfile(): void {

    this.loading = true;

    if (this.fileUploadForm.valid) {
      this.fileUploadForm.disable();
      this.fileId = this.activatedRoute.snapshot.params['id'];
      this.apollo.mutate({
        mutation: singleUpload,
        variables: {
          'file': this.file,
          'where': {id: this.fileId}
        }
      }).subscribe(( {data} ) => {
        this.loading = false;

        if (data) {
          this.snackBar.open(
            `Archivo ${data.changeFile.filename} cambiado`,
            'X',
            { duration: 3000 }
          );
          this.router.navigate(['admin', 'file']);
        }

      }, (error) => {
        this.fileUploadForm.enable();
        this.loading = false;
        this.snackBar.open(error.message, 'X', {duration: 3000});
      });
    } else {
      console.log('Form not valid');
    }
  }

  fileChange(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }
}
