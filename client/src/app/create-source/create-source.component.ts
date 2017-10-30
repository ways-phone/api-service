import { Component, OnInit } from '@angular/core';
import { isLoggedIn } from '../../utils/authentication';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SourceService } from '../services/source.service';

@Component({
  selector: 'app-create-source',
  templateUrl: './create-source.component.html',
  styleUrls: ['../create-client/create-client.component.css'],
  providers: [SourceService]
})
export class CreateSourceComponent implements OnInit {
  name: string;
  errors: string;
  success: string;
  constructor(
    private router: Router,
    private location: Location,
    private sourceService: SourceService
  ) {}

  getClient() {
    return this.location.path().split('/')[2];
  }
  getCampaign() {
    return this.location.path().split('/')[3];
  }

  create() {
    this.sourceService
      .create(this.name, this.getClient(), this.getCampaign())
      .then(data => {
        this.success = `${data.name} successfully created.`;
      })
      .catch(error => {
        this.errors = error.json().message;
      });
  }

  cancel() {
    this.location.back();
  }

  ngOnInit() {
    if (!isLoggedIn()) {
      this.router.navigate(['./login']);
    }
  }
}
