import { Component } from '@angular/core';
import {WsService} from "../../shared/services/ws.service";
import {ApiService} from "../../shared/services/api.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    constructor(
      private ws: WsService,
      private apiService: ApiService,
    ) {
    }

    sendEvent(){
      this.apiService.requestApi('/event', 'POST', {name: 'test', data: 'test'});
    }
}
