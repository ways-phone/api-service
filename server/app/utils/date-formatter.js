const getDay = date => {
  return addZero(date.getDate());
};

const getMonth = date => {
  return addZero(date.getMonth() + 1);
};

const getYear = (date, digits) => {
  return date.getFullYear().toString().slice(-digits);
};

const getHours = date => {
  return addZero(date.getHours());
};

const getMinutes = date => {
  return addZero(date.getMinutes());
};

const addZero = number => {
  return ('0' + number).slice(-2);
};

export const formatDate = datestring => {
  let date = createDate(datestring);
  let formatted = getDay(date) + '/' + getMonth(date) + '/' + getYear(date, 4);
  return formatted;
};

export const formatTimestamp = dateString => {
  let date = createDate(dateString);
  return getDay(date) + '/' + getMonth(date) + '/' + getYear(date, 4) + ' ' + getHours(date) + ':' + getMinutes(date);
};

export const createDate = string => {
  try {
    return new Date(string);
  } catch (e) {
    return new Error('not a date');
  }
};

export const createDateObjectFromString = datestring => {
  let split = datestring.split('/');
  let date = new Date();
  date.setDate(split[0]);
  date.setMonth(split[1] - 1);
  date.setFullYear(split[2]);
  return date;
};
