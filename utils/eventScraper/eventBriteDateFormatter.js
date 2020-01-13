const moment = require('moment');

const eventBriteDateFormatter = (dateToFormat) => {
  if (dateToFormat.includes('Today')) {
    const date = moment().format('llll').split(' 2')[0];
    const time = dateToFormat.split('at')[1];
    return `${date}${time}`;
  }
  if (dateToFormat.includes('Tomorrow')) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const date = moment(tomorrow).format('llll').split(' 2')[0];
    const time = dateToFormat.split('at')[1];
    return `${date}${time}`;
  }
  if (dateToFormat.includes(' + ')) {
    return dateToFormat.split(' + ')[0];
  }

  return moment().format('llll');
};

module.exports = eventBriteDateFormatter;
