import { Injectable } from '@angular/core';
import BASE_URL from '../../utils/base-url';
import { Http, Headers } from '@angular/http';
import { getToken } from '../../utils/authentication';

import { CampaignModel } from '../models/campaign';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService {
  private headers = new Headers({
    'Content-Type': 'application/json',
    Authorization: getToken(),
  });
  constructor(private http: Http) {}

  changePassword(query) {
    return this.http
      .post(`${BASE_URL}/auth/change-password`, query, {
        headers: this.headers,
      })
      .toPromise()
      .then(res => res.json());
  }

  register(form) {
    return this.http
      .post(`${BASE_URL}/users`, form, {
        headers: this.headers,
      })
      .toPromise()
      .then(res => res.json());
  }
}
