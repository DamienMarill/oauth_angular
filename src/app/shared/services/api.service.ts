import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {BACKEND_URL_API} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private _token?: string;
  isInit: boolean = false;
  initEvent: Subject<boolean> = new Subject<boolean>();

  get token(): string | undefined {
    return this._token;
  }
  private set token(value: string | undefined) {
    this._token = value;
  }

  private _user?: User;
  get user(): User | undefined {
    return this._user;
  }
  private set user(value: User | undefined) {
    this._user = value;
  }

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.init();
  }

  public async init(){
    // Récupère le code dans l'url
    let urlParams = new URLSearchParams(window.location.search);

    // S'il y a un code dans l'url, on effectue une requête pour récupérer le token
    if(urlParams.has('code')){
      let code = urlParams.get('code') as string;

      // Effectue la requête sur le callback de l'API
      let res = await this.requestApi('/auth/callback', 'GET', {code});
      if(res && res.token){
        this.savTokens(res.token);
        await this.getUser();
        this.router.navigate(['/']);
      }
    }else{
      // Sinon on récupère le token dans le localstorage s'il existe et on le stocke dans la variable token
      this.token = localStorage.getItem('apiToken') ? JSON.parse(localStorage.getItem('apiToken') as string).token : undefined;
      if(this.token){
        await this.getUser();
      }
    }

    // On indique que l'initialisation est terminée
    this.isInit = true;
    this.initEvent.next(true);
  }

  // Effectue une requête vers l'API et retourne une promesse
  public async requestApi(action: string, method: string = 'GET', datas: any = {}, httpOptions: any = {}): Promise<any> {

    // Création de la route d'API à appeler
    const methodWanted = method.toLowerCase();
    let route = BACKEND_URL_API + action;

    let req = null;

    // Si il n'y a pas de header, on en crée un qui demande du json en retour
    if (httpOptions.headers === undefined) {
      httpOptions.headers = new HttpHeaders({
        'Accept': 'application/json',
      });
    }

    // Si il y a un token, on l'ajoute dans le header pour authentifier l'utilisateur
    if (this.token) {
      httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + this.token);
    }

    // En fonction de la méthode demandée, on effectue la requête correspondante
    switch (methodWanted) {
      case 'post':
        req = this.http.post(route, datas, httpOptions);
        break;
      case 'patch':
        req = this.http.post(route, datas, httpOptions);
        break;
      case 'put':
        req = this.http.put(route, datas, httpOptions);
        break;
      case 'delete':
        route += '?' + Object.keys(datas).map((key) => {
          return key + '=' + datas[key];
        }).join('&');

        req = this.http.delete(route, httpOptions);
        break;
      default:
        route += '?' + Object.keys(datas).map((key) => {
          return key + '=' + datas[key];
        }).join('&');

        req = this.http.get(route, httpOptions);
        break;
    }

    // On retourne la promesse de la requête
    return req.toPromise();
  }

  // Enregistre le token dans le localstorage et dans la variable token
  savTokens(apiToken: string){

    // Enregistre le token dans le localstorage
    localStorage.setItem('apiToken', JSON.stringify({
      token: apiToken,
    }));

    this.token = apiToken;

  }

  // Vérifie si l'utilisateur est connecté
  isLogged(): boolean{
    return this.token !== undefined;
  }

  // Déconnecte l'utilisateur
  logout(){
    localStorage.removeItem('apiToken');
    this.token = undefined;
  }

  async getUser() {
    await this.requestApi('/user').then((data: User) => {
      this.user = data;
    });
  }
}
