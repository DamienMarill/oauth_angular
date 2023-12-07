import {Injectable} from '@angular/core';
import Echo from 'laravel-echo';
import {
  BACKEND_URL,
  MIX_PUSHER_APP_KEY,
  MIX_PUSHER_FORCE_TLS,
  MIX_PUSHER_HOST,
  MIX_PUSHER_PORT,
  MIX_PUSHER_PORT_TLS,
  MIX_PUSHER_TRANSPORT
} from "../../../environments/environment";
import {ApiService} from "./api.service";

// @ts-ignore
window.Pusher = require('pusher-js');

@Injectable({
  providedIn: 'root'
})
export class WsService {
  
  constructor(
    public apiService: ApiService
  ) {
    let ws = this.initWs();
    let channel = this.linkChannel(ws);
    this.bindEvents(channel);
  }

  initWs(): any{
    return new Echo({
      broadcaster: 'pusher',
      cluster: 'mt1',
      key: MIX_PUSHER_APP_KEY,
      wsHost: MIX_PUSHER_HOST,
      wsPort: MIX_PUSHER_PORT,
      wssPort: MIX_PUSHER_PORT_TLS,
      forceTLS: MIX_PUSHER_FORCE_TLS,
      disableStats: true,
      enabledTransports: MIX_PUSHER_TRANSPORT,
      authEndpoint: BACKEND_URL + '/broadcasting/auth',
      auth:
        {
          headers:
            {
              'Authorization': 'Bearer '+this.apiService.token
            }
        }
    });
  };

  linkChannel(ws: any) {
    return ws.private('App.Models.User.' + this.apiService.user?.id).pusher;
  }

  bindEvents(channel: any){
    channel.bind('TestEvent', (data: any) => {
      console.log('TestEvent', data);
    });
  }
}
