import { Injectable } from '@angular/core';
import BASE_URL from '../../utils/base-url';
import { Http, Headers } from '@angular/http';
import { getToken } from '../../utils/authentication';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class RecordsService {
  private headers = new Headers({
    'Content-Type': 'application/json',
    Authorization: getToken()
  });
  constructor(private http: Http) {}

  search(query): Promise<any> {
    return this.http
      .post(`${BASE_URL}/records/search`, query, {
        headers: this.headers
      })
      .toPromise()
      .then(res => res.json());
  }
}
