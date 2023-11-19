import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {inject, Injectable} from "@angular/core";
import {ApiService} from "../services/api.service";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url: string = '';
  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}

  // Vérifie si l'utilisateur est connecté
  private checkLogin(state: RouterStateSnapshot): boolean {
    this.url = state.url;
    if (this.apiService.isLogged()) {
      return this.authState();
    }
    return this.noAuthState();
  }

  // Si l'utilisateur est connecté, on le redirige vers la page d'accueil
  private authState(): boolean {
    if (this.isLoginOrRegister()) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }

  // Si l'utilisateur n'est pas connecté, on le redirige vers la page de connexion
  private noAuthState(): boolean {
    if (this.isLoginOrRegister()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

  // Vérifie si l'utilisateur est sur la page de connexion ou d'inscription
  private isLoginOrRegister(): boolean {
    if (this.url.includes('/login')) {
      return true;
    }
    return false;
  }

  // Vérifie si l'utilisateur est connecté avant d'accéder à la page
  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (!this.apiService.isInit) {
      await this.apiService.initEvent.subscribe(() => true);
    }
    return this.checkLogin(state);
  }
}

export const authGuard: CanActivateFn = async (route, state) => {
  return await inject(AuthService).canActivate(route, state);
};

