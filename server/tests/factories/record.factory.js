import faker from 'faker';

class RecordFactory {
  generateList(count, attrs = {}) {
    let list = [];
    while (count) {
      list.push(this.generate(attrs));
      count--;
    }
    return list;
  }

  generate(attrs) {
    const mobile =
      '0' + faker.phone.phoneNumberFormat(0).replace(/-/g, ' ').slice(1, 21);

    const home =
      '0' + faker.phone.phoneNumberFormat(0).replace(/-/g, ' ').slice(1, 21);
    return Object.assign(
      {},
      {
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email: faker.internet.email(),
        title: faker.name.prefix(),
        address1: faker.address.streetAddress(false),
        suburb: faker.address.city(),
        state: faker.address.state(true),
        mobilephone: mobile,
        homephone: home,
      },
      attrs
    );
  }
}

export default new RecordFactory();
