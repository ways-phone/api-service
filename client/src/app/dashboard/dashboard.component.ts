import { Component, OnInit } from "@angular/core";
import { isLoggedIn } from "../../utils/authentication";
import { Router } from "@angular/router";

import { ClientsService } from "../services/clients.service";
import { ClientModel } from "../models/client";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  clients: ClientModel[];
  isHidden: boolean;
  confirmHide: boolean;
  errors: string;
  selectedClient: ClientModel;
  constructor(private router: Router, private clientsService: ClientsService) {
    this.isHidden = false;
    this.confirmHide = false;
  }

  showConfirmHide(client) {
    this.confirmHide = true;
    this.selectedClient = client;
  }

  cancelHide() {
    this.confirmHide = false;
    this.selectedClient = undefined;
  }

  showHidden(): void {
    if (this.isHidden === false) this.isHidden = undefined;
    else this.isHidden = false;
    this.fetch();
  }

  fetch(): void {
    this.clientsService.fetch(this.isHidden).then(data => {
      this.clients = data;
    });
  }

  hide(client) {
    this.clientsService
      .hide(client)
      .then(res => {
        this.confirmHide = false;
        this.fetch();
      })
      .catch(err => {
        this.errors = err.json().message;
      });
  }

  goToCreateClient() {
    this.router.navigate(["./clients/create"]);
  }

  goToClient(client) {
    this.router.navigate([`/clients/${client.path}`]);
  }

  ngOnInit() {
    if (!isLoggedIn()) {
      this.router.navigate(["./login"]);
    } else {
      this.fetch();
    }
  }
}
