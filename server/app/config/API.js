export const createDatasetURL = (contactspaceId, datasetName) => {
  if (!contactspaceId || !datasetName) {
    throw new Error(
      // eslint-disable-next-line max-len
      `Cannot Create Dataset URL. Incorrect Parameters Supplied. ContactSpace ID: ${contactspaceId}, Dataset Name: ${datasetName}`
    );
  }
  const KEY = process.env.CONTACT_SPACE_API_KEY;
  // eslint-disable-next-line max-len
  return `https://apidev.contactspace.com/?apikey=${KEY}&function=CreateDataSet&initiativeid=${contactspaceId}&datasetname=${datasetName}&active=1`;
};

export const pushRecordURL = (datasetId, record) => {
  if (!datasetId || !record) {
    throw new Error(
      `Cannot Create Push Record URL. Incorrect Parameters Supplied. dataset: ${datasetId}, record: ${record} `
    );
  }
  const KEY = process.env.CONTACT_SPACE_API_KEY;
  // eslint-disable-next-line max-len
  return `https://apidev.contactspace.com/?apikey=${KEY}&function=InsertRecord&module=data&datasetid=${datasetId}&xmldata=${record}`;
};
