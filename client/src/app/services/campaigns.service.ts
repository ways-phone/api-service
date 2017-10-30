import { Injectable } from '@angular/core';
import BASE_URL from '../../utils/base-url';
import { Http, Headers } from '@angular/http';
import { getToken } from '../../utils/authentication';

import { CampaignModel } from '../models/campaign';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class CampaignsService {
  private headers = new Headers({
    'Content-Type': 'application/json',
    Authorization: getToken()
  });
  constructor(private http: Http) {}

  create(name, contactspaceId, client): Promise<CampaignModel> {
    return this.http
      .post(
        `${BASE_URL}/clients/${client}`,
        { name, contactspaceId },
        { headers: this.headers }
      )
      .toPromise()
      .then(res => res.json() as CampaignModel);
  }

  hide(client, campaign): Promise<any> {
    this.headers = new Headers({
      "Content-Type": "application/json",
      Authorization: getToken()
    });
    return this.http
      .delete(`${BASE_URL}/clients/${client}/${campaign}`, {  headers: this.headers })
      .toPromise()
      .then(res => res.json());
  }
}
