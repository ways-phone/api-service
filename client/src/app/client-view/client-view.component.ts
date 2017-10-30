import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import { isLoggedIn } from '../../utils/authentication';

import { ClientsService } from '../services/clients.service';

import { CampaignsService } from '../services/campaigns.service';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-client-view',
  templateUrl: './client-view.component.html',
  styleUrls: ['../dashboard/dashboard.component.css'],
  providers: [ClientsService, CampaignsService],
})
export class ClientViewComponent implements OnInit {
  @Input() campaigns;
  isHidden: boolean;
  confirmHide: boolean;
  selectedCampaign;
  client: string;
  constructor(
    private clientsService: ClientsService,
    private campaignsService: CampaignsService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.isHidden = false;
    this.confirmHide = false;
  }

  goBack() {
    this.location.back();
  }

  goToCampaign(campaign) {
    this.router.navigate([`/clients/${this.client}/${campaign.path}`]);
  }

  goToCreateCampaign() {
    this.router.navigate([`./${this.client}/create-campaign`]);
  }

  showConfirmHide(campaign) {
    this.confirmHide = true;
    this.selectedCampaign = campaign;
  }

  fetch() {
    this.clientsService
      .getClient(this.client, this.isHidden)
      .then(campaigns => (this.campaigns = campaigns));
  }

  cancelHide() {
    this.confirmHide = false;
    this.selectedCampaign = undefined;
  }

  showHidden(): void {
    if (this.isHidden === false) this.isHidden = undefined;
    else this.isHidden = false;
    this.fetch();
  }

  hide(campaign) {
    this.campaignsService.hide(this.client, campaign).then(res => {
      this.confirmHide = false;
      this.fetch();
    });
  }

  ngOnInit() {
    if (!isLoggedIn()) {
      this.router.navigate(['./login']);
    } else {
      this.route.paramMap
        .switchMap((params: ParamMap) => {
          this.client = params.get('client');
          return this.clientsService.getClient(this.client, this.isHidden);
        })
        .subscribe(campaigns => (this.campaigns = campaigns));
    }
  }
}
