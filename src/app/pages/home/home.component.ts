import { Component } from '@angular/core';
import {WsService} from "../../shared/services/ws.service";
import {ApiService} from "../../shared/services/api.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  photoForm: FormGroup;

    constructor(
      private ws: WsService,
      private apiService: ApiService,
      private formBuilder: FormBuilder,
    ) {
      this.photoForm = this.formBuilder.group({
        photo: [null, Validators.required]
      });
    }

    sendEvent(){
      this.apiService.requestApi('/event', 'POST', {name: 'test', data: 'test'});
    }

  onFileSelect(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.photoForm.get('photo')?.setValue(input.files[0]);
    } else {
      this.photoForm.get('photo')?.setValue(null);
    }
  }

  envoyerPhoto(){
    const fichierInput = this.photoForm.get('photo')?.value;
    if (fichierInput) {
      console.log(this.photoForm)
      this.uploadFichier(fichierInput);
    }
  }

  uploadFichier(fichier: File) {
    const formData = new FormData();
    formData.append('photo', fichier, fichier.name);

    this.apiService.requestApi('/photo', 'POST', formData).then(
      response => {
        console.log('Upload réussi !', response);
      },
      error => {
        console.error('Erreur lors de l\'upload :', error);
      }
    );
  }
}
