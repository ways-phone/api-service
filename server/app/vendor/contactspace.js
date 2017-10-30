import { createDatasetURL, pushRecordURL } from '../config/API';
import { convertRecordToXML, convertXMLResponse } from '../utils/xml-converter';

import request from 'request-promise';

export const createDatasetInContactSpace = async (campaign, name) => {
  const url = createDatasetURL(campaign.contactspaceId, name);
  const response = await request(url);
  const parsed = await convertXMLResponse(response);
  try {
    return parsed.xml.datasets[0].dataset[0].id[0];
  } catch (err) {
    throw new Error(err);
  }
};

export const pushRecord = async (dataset, record) => {
  const xml = convertRecordToXML(record);
  const url = pushRecordURL(dataset.ID, xml);
  const response = await request(url);
  const parsed = await convertXMLResponse(response);
  return parsed;
};
