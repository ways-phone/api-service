import faker from 'faker';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

class CampaignFactory {
  generateList(count, attrs = {}) {
    let list = [];
    while (count) {
      list.push(this.generate(attrs));
      count--;
    }
    return list;
  }

  generate(attrs) {
    return Object.assign(
      {},
      {
        name: faker.name.firstName() + ' ' + faker.name.lastName(),
        creator: faker.name.firstName(),
        contactspaceId: getRandomInt(1, 500),
      },
      attrs
    );
  }
}

export default new CampaignFactory();
