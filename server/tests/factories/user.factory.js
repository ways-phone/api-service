import faker from 'faker';

class UserFactory {
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
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: 'thisisapassword1',
        role: 'client',
      },
      attrs
    );
  }

  generateAdmin(attrs) {
    return Object.assign(
      {},
      {
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: 'thisisapassword1',
        role: 'admin',
      },
      attrs
    );
  }
}

export default new UserFactory();
