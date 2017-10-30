import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ClientsService } from '../services/clients.service';
import {isLoggedIn} from '../../utils/authentication';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-campaign-view',
  templateUrl: './campaign-view.component.html',
  styleUrls: ['../dashboard/dashboard.component.css'],
  providers: [ClientsService]
})
export class CampaignViewComponent implements OnInit {
  @Input() sources;
  client: string;
  campaign: string;
  constructor(
    private clientsService: ClientsService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  goToCreateSource() {
    this.router.navigate([
      `./clients/${this.client}/${this.campaign}/create-source`
    ]);
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    if (!isLoggedIn()) {
      this.router.navigate(['./login']);
    } else {
    this.route.paramMap
      .switchMap((params: ParamMap) => {
        this.client = params.get('client');
        this.campaign = params.get('campaign');
        return this.clientsService.getCampaign(this.client, this.campaign);
      })
      .subscribe(sources => {
        console.log(sources);
        this.sources = sources;
      });
    }
  }
}
