
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';


const singleUpload = gql`
mutation singleUpload($file: Upload!) {
  singleUpload(file: $file) {
    filename
  }
}
`;


@Component({
  selector: 'app-test',
  template: `

  <div *ngIf="loading">
  <mat-progress-bar color="warn"></mat-progress-bar>
</div>
<br />
<div class="container" fxLayout="column" fxLayoutAlign="center center">
  <div class="item" fxFlex="50%" fxFlex.xs="90%" fxFlex.md="90%">
    <form [formGroup]="fileUploadForm" #f="ngForm" (ngSubmit)="onUpload()" class="example-form">
      <mat-card class="card">

        <h1 class="mat-h1">Registrar</h1>
        <mat-card-content>

            <input required type="file" (change)="fileChange($event)" placeholder="File" formControlName="file">


          </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" type="submit" [disabled]="!fileUploadForm.valid" aria-label="login">
            <mat-icon>account_circle</mat-icon>
            <span>Registrar</span>
          </button>


        </mat-card-actions>
      </mat-card>

    </form>
  </div>
</div>
  `,
  styles: []
})
export class TestComponent implements OnInit {

  fileUploadForm: FormGroup;
  loading = false;
  hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) { }

  ngOnInit() {
    this.fileUploadForm = this.formBuilder.group({
      file: ['', Validators.required]
    });
  }

  onUpload(): void {

    this.loading = true;

    if (this.fileUploadForm.valid) {
      this.fileUploadForm.disable();

    } else {
      this.loading = false;
      console.log('Form not valid');
    }
  }

  fileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
        const file: File = fileList[0];

        console.log(file);

        this.apollo.mutate({
          mutation: singleUpload,
          variables: {
            'file': file
          }
        }).subscribe(( {data} ) => {
          this.loading = false;
          console.log(data);
         // this.router.navigate(['home']);
        }, (error) => {
          this.fileUploadForm.enable();
          this.loading = false;
          this.snackBar.open(error.message, 'X', {duration: 3000});
        });
    }
  }

}
