import { Component, OnInit } from '@angular/core';
import { isLoggedIn } from '../../utils/authentication';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CampaignsService } from '../services/campaigns.service';

@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['../create-client/create-client.component.css'],
  providers: [CampaignsService]
})
export class CreateCampaignComponent implements OnInit {
  name: string;
  contactspaceId: string;
  errors: string;
  success: string;
  constructor(
    private router: Router,
    private location: Location,
    private campaignsService: CampaignsService
  ) {}

  getClient() {
    return this.location.path().split('/')[1];
  }

  create() {
    this.campaignsService
      .create(this.name, this.contactspaceId, this.getClient())
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
