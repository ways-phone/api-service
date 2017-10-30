const setPhones = (home, mobile) => {
  if (!mobile && !home) {
    return { isInvalid: true };
  } else if (mobile) {
    return { isInvalid: false, phone1: mobile, phone2: home || '' };
  } else {
    return { isInvalid: false, phone1: home, phone2: '' };
  }
};

const switchHomeAndMobile = (home, mobile) => {
  if (mobile && mobile[0] !== '4' && !home) return { mobile: '', home: mobile };
  if (home && home[0] === '4' && !mobile) return { mobile: home, home: '' };
  if (home && home[0] === '4' && mobile) return { mobile: home, home: mobile };
  return { mobile, home };
};

const validatePhones = (phone1, phone2) => {
  if (!phone1 && !phone2) return true;
  if (phone1 && !phone2) return phone1.length !== 11;
  if (!phone1 && phone2) return phone2.length !== 11;
  if (phone1 && phone2) return phone1.length !== 11 && phone2.length !== 11;
};

const cleanPhone = number => {
  const formatted = number
    .replace(new RegExp(/\D/g), '')
    .replace(new RegExp(/^0/), '')
    .replace(new RegExp(/^61/), '')
    .replace(new RegExp(/^0/), '');

  return formatted;
};

const prependPhone = number => {
  if (!number) return number;
  const formatted = '61' + number;
  return formatted;
};

const setGender = gender => {
  const males = ['M', 'm', 'Male', 'male'];
  const females = ['F', 'f', 'Female', 'female'];
  if (males.indexOf(gender) !== -1) {
    gender = 'Male';
  } else if (females.indexOf(gender) !== -1) {
    gender = 'Female';
  } else {
    gender = '';
  }
  return gender;
};

const capitalize = string => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const validation = {
  setPhones: setPhones,
  switchHomeAndMobile: switchHomeAndMobile,
  validatePhones: validatePhones,
  cleanPhone: cleanPhone,
  prependPhone: prependPhone,
  setGender: setGender,
  capitalize: capitalize,
};

export default validation;
