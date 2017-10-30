import { Injectable } from "@angular/core";
import BASE_URL from "../../utils/base-url";
import { Http, Headers } from "@angular/http";
import { getToken } from "../../utils/authentication";

import { ClientModel } from "../models/client";
import "rxjs/add/operator/toPromise";

@Injectable()
export class ClientsService {
  private headers;
  constructor(private http: Http) {}

  fetch(isHidden): Promise<ClientModel[]> {
    this.headers = new Headers({
      "Content-Type": "application/json",
      Authorization: getToken()
    });
    return this.http
      .get(`${BASE_URL}/clients`, {
        params: { isHidden },
        headers: this.headers
      })
      .toPromise()
      .then(res => res.json() as ClientModel[]);
  }

  hide(client): Promise<ClientModel> {
    this.headers = new Headers({
      "Content-Type": "application/json",
      Authorization: getToken()
    });
    return this.http
      .delete(`${BASE_URL}/clients/${client}`, { headers: this.headers })
      .toPromise()
      .then(res => res.json() as ClientModel);
  }

  create(name): Promise<ClientModel> {
    this.headers = new Headers({
      "Content-Type": "application/json",
      Authorization: getToken()
    });
    return this.http
      .post(`${BASE_URL}/clients`, { name }, { headers: this.headers })
      .toPromise()
      .then(res => res.json());
  }

  getClient(client: string, isHidden: boolean): Promise<any> {
    this.headers = new Headers({
      "Content-Type": "application/json",
      Authorization: getToken()
    });
    return this.http
      .get(`${BASE_URL}/clients/${client}`, {
        params: { isHidden },
        headers: this.headers
      })
      .toPromise()
      .then(res => res.json());
  }

  getCampaign(client, campaign): Promise<any> {
    this.headers = new Headers({
      "Content-Type": "application/json",
      Authorization: getToken()
    });
    return this.http
      .get(`${BASE_URL}/clients/${client}/${campaign}`, {
        headers: this.headers
      })
      .toPromise()
      .then(res => res.json());
  }
}
