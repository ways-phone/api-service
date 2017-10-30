import { ClientModel } from './client';
export class CampaignModel {
  creator: string;
  id: string;
  name: string;
  path: string;
  client: ClientModel;
}
