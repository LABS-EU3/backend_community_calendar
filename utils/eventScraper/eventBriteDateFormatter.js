const moment = require('moment');

const eventBriteDateFormatter = (dateToFormat) => {
  const checkDate = `${dateToFormat} 2020`;

  if (checkDate.includes('Today')) {
    const date = moment().format('llll').split(' 2')[0];
    const time = checkDate.split('at')[1];
    return `${date}${time}`;
  }
  if (checkDate.includes('Tomorrow')) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const date = moment(tomorrow).format('llll').split(' 2')[0];
    const time = checkDate.split('at')[1];
    return `${date}${time}`;
  }
  if (checkDate.includes(' + ')) {
    return checkDate.split(' + ')[0];
  }

  return moment().format('llll');
};

module.exports = eventBriteDateFormatter;
