import Promise from 'bluebird';

const xmlParser = Promise.promisifyAll(require('xml2js'));
const xmlBuilder = new xmlParser.Builder();

export const convertRecordToXML = record => {
  const lines = xmlBuilder.buildObject(record).split('\n');
  const formatted = lines.splice(1, lines.length).join('\n');
  const final = formatted.replace('<root>', '<record>').replace('</root>', '</record>');
  return final;
};

export const convertXMLResponse = response => {
  return xmlParser.parseStringAsync(response);
};
