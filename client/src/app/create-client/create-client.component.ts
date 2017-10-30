import { Component, OnInit } from '@angular/core';
import { isLoggedIn } from '../../utils/authentication';
import { Router } from '@angular/router';

import { ClientsService } from '../services/clients.service';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.css'],
  providers: [ClientsService]
})
export class CreateClientComponent implements OnInit {
  name: string;
  errors: string;
  success: string;
  constructor(private router: Router, private clientsService: ClientsService) {}

  create() {
    this.clientsService
      .create(this.name)
      .then(data => {
        this.success = `${data.name} successfully created.`;
      })
      .catch(error => {
        this.errors = error.json().message;
      });
  }

  cancel() {
    this.router.navigate(['./dashboard']);
  }

  ngOnInit() {
    if (!isLoggedIn()) {
      this.router.navigate(['./login']);
    }
  }
}
