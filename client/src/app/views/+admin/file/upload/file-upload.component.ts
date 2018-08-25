import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import gql from 'graphql-tag';
import { validate } from 'graphql';


const singleUpload = gql`
mutation uploadFile($file: Upload!) {
  uploadFile(file: $file) {
    filename
  }
}
`;

const multipleUploads = gql`
mutation uploadFiles($files: [Upload!]!) {
  uploadFiles(files: $files) {
    filename
  }
}
`;

@Component({
  selector: 'app-file-upload',
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
                  <button mat-button color="accent" mat-mini-fab type="button" (click)="uploadFile.click()">
                  <mat-icon>attachment</mat-icon></button>
                  <input required hidden type="file" #uploadFile (change)="fileChange($event)"
                     multiple placeholder="File" formControlName="files">
                </div>

                <mat-list *ngFor="let file of files">
                  <mat-list-item>{{file.name}}  {{file.size / 1024 / 1024 | number: '1.1'}} MB</mat-list-item>
                </mat-list>

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
export class FileUploadComponent implements OnInit {

  fileUploadForm: FormGroup;
  files: FileList;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) { }

  ngOnInit() {

    this.fileUploadForm = this.formBuilder.group({
      files: ['', Validators.required]
    });
  }

  onUploadfile(): void {

    this.loading = true;

    if (this.fileUploadForm.valid) {
      this.fileUploadForm.disable();
      this.apollo.mutate({
        mutation: multipleUploads,
        variables: {
          'files': this.files
        }
      }).subscribe(( {data} ) => {
        this.loading = false;

        if (data) {
          if (data.uploadFiles.length === 1) {
            this.snackBar.open(
              `${data.uploadFiles.length} archivo  subido correctamente`,
              'X',
              { duration: 3000 }
            );
          } else {
            this.snackBar.open(
              `${data.uploadFiles.length} archivos  subidos correctamente`,
              'X',
              { duration: 3000 }
            );
          }
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
    this.files = event.target.files;
  }
}
