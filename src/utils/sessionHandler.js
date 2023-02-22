import CryptoJS from "crypto-js";

const encryptSession = (data) => {
  const KEY = "4S$1st4nt";

  return CryptoJS.AES.encrypt(data, KEY).toString();
};

const decryptSession = (data) => {
  const KEY = "4S$1st4nt";

  const bytes = CryptoJS.AES.decrypt(data, KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const checkDecryptLocalStorageWithoutMessier = () => {
  return decryptSession(localStorage.getItem("authorization-token")) === "" ||
      decryptSession(localStorage.getItem("expires-token")) === "" ||
      decryptSession(localStorage.getItem("session")) === "" ||
      decryptSession(localStorage.getItem("semester")) === "";
};

const checkDecryptLocalStorage = () => {
  return decryptSession(localStorage.getItem("authorization-token")) === "" ||
      decryptSession(localStorage.getItem("messier-token")) === "" ||
      decryptSession(localStorage.getItem("expires-token")) === "" ||
      decryptSession(localStorage.getItem("session")) === "" ||
      decryptSession(localStorage.getItem("semester")) === "";
};

const resetLocalStorage = () => {
  localStorage.setItem("authorization-token", "");
  localStorage.setItem("messier-token", "");
  localStorage.setItem("expires-token", "");
  localStorage.setItem("session", "");
  localStorage.setItem("semester", "");
};

const resetLocalStorageIfEmpty = () => {
  if (!localStorage.getItem("authorization-token")) {
    localStorage.setItem("authorization-token", "");
  }
  if (!localStorage.getItem("messier-token")) {
    localStorage.setItem("messier-token", "");
  }
  if (!localStorage.getItem("expires-token")) {
    localStorage.setItem("expires-token", "");
  }
  if (!localStorage.getItem("session")) {
    localStorage.setItem("session", "");
  }
  if (!localStorage.getItem("semester")) {
    localStorage.setItem("semester", "");
  }
};

export {
  encryptSession,
  decryptSession,
  checkDecryptLocalStorage,
  checkDecryptLocalStorageWithoutMessier,
  resetLocalStorage,
  resetLocalStorageIfEmpty,
};
