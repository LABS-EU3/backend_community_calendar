/* eslint-disable arrow-body-style */
/* eslint-disable no-plusplus */
const cheerio = require('cheerio');
const axios = require("axios");

const fetchData = async () => {
  const result = await axios({
    method: "get",
    url: `https://www.meetup.com/find/events/tech/?allMeetups=false&radius=50&userFreeform=Abuja%2C+Nigeria`,
    json: true,
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });
  return cheerio.load(result.data, {
    normalizeWhitespace: false,
  });
};

const scrapeEvents = (userCountry, userCity, eventType) => new Promise((resolve, reject) => {
  return fetchData(userCountry, userCity, eventType).then(($) => {
    const datesArray = [];
    const titlesArray = [];
    const linksArray = [];
    const dataSet = [];

    const dates = $('time').toArray();
    const titles = $('.resetLink.big.event.wrapNice.omnCamp.omngj_sj7e.omnrv_fe1').toArray();
    const links = $('.resetLink.big.event.wrapNice.omnCamp.omngj_sj7e.omnrv_fe1').toArray();

    dates.forEach((date) => {
      const dateString = $(date).attr('datetime');
      datesArray.push(dateString);
      datesArray.push(dateString);
    });

    titles.forEach((title) => {
      const titleString = $(title).text().replace(/(\r\n|\n|\r)/gm, "");
      titlesArray.push(titleString);
    });
    const newTitles = titlesArray.filter((str) => /\S/.test(str));

    links.forEach((link) => {
      const linkString = $(link).attr('href');
      linksArray.push(linkString);
    });

    for (let i = titlesArray.length - 1; i >= 0; i--) {
      dataSet.push({
        title: newTitles[i],
        date: datesArray[i],
        link: linksArray[i],
      });
    }

    resolve(dataSet);
  }).catch((error) => reject(error));
});

module.exports = scrapeEvents;
