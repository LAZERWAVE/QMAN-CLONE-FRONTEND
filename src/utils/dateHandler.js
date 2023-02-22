import moment from "moment-timezone";

const getFullFormatDate = (value) => {
  return moment(value).tz("Asia/Bangkok").add(7, "hours").toISOString().split(".")[0]+"Z";
};

const disabledDates = (value) => {
  return moment().tz("Asia/Bangkok").format() > moment(value).tz("Asia/Bangkok").format();
};

const formatDate = (value) => {
  return moment(value).tz("Asia/Bangkok").format("DD MMM YYYY");
};

const formatDateReturn = (value) => {
  const date = moment(String(value)).format("DD");
  const month = moment(String(value)).format("MM");
  const year = moment(String(value)).format("YYYY");
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(date));
};

export {
  getFullFormatDate,
  disabledDates,
  formatDate,
  formatDateReturn,
};
