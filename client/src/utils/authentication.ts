export const saveToken = token => {
  window.sessionStorage['token'] = token;
};

export const getToken = () => {
  return window.sessionStorage['token'];
};

export const deleteToken = () => {
  delete window.sessionStorage['token'];
};

export const logout = () => {
  delete window.sessionStorage['token'];
};

export const isLoggedIn = () => {
  let token = getToken();
  let payload;

  if (token) {
    try {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      payload = JSON.parse(payload);

      let hasExpired = payload.exp < Date.now() / 1000;

      if (hasExpired) logout();
      console.log(payload);
      return !hasExpired;
    } catch (err) {
      return false;
    }
  } else {
    return false;
  }
};

export const currentUser = () => {
  if (isLoggedIn()) {
    try {
      let token = getToken();
      let payload = token.split('.')[1];
      payload = window.atob(payload);
      payload = JSON.parse(payload);

      return payload;
    } catch (err) {
      throw new Error(err);
    }
  }
};
