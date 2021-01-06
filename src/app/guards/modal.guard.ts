import { ModalComponent } from '../components/modal/modal.component';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router'
import { Observable } from 'rxjs'

export interface ModalGuard {
  modalComponent: ModalComponent
  shouldGuard?(): boolean
  applyToUrls?: string[]
  excludeUrls?: string[]
}

@Injectable()
/**
 * le Guards sont des codes sur le net pour les sécurités
 * a voir comment ca marche pour la suite
 */
export class ModalGuardService implements CanDeactivate<ModalGuard> {
  constructor() {}

  canDeactivate(
      guard: ModalGuard,
      currentRoute: ActivatedRouteSnapshot,
      currentState: RouterStateSnapshot,
      nextState?: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if ((guard.shouldGuard === undefined || guard.shouldGuard()) &&
          (guard.excludeUrls === undefined || guard.excludeUrls.indexOf(nextState?.url) === -1) &&
          (guard.applyToUrls === undefined || guard.applyToUrls.indexOf(nextState?.url) > -1)) {
          return guard.modalComponent.open()
      }
      return true
  }
}
