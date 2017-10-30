import { Injectable } from '@angular/core';
import BASE_URL from '../../utils/base-url';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class LoginService {
  constructor(private http: Http) {}

  login(details): Promise<any> {
    return this.http
      .post(`${BASE_URL}/auth/login`, details)
      .toPromise()
      .then(res => res.json());
  }

  changePassword(passwordUpdate): Promise<any> {
    return this.http
      .post(`${BASE_URL}/auth/change-password`, passwordUpdate)
      .toPromise()
      .then(res => res.json());
  }
}
