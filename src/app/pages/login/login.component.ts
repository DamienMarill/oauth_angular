import { Component } from '@angular/core';
import {BACKEND_URL} from "../../../environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  providerRedirect = BACKEND_URL + '/auth/redirect';

}
