import faker from 'faker';

class ClientFactory {
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
      },
      attrs
    );
  }
}

export default new ClientFactory();
