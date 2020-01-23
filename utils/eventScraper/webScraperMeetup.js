/* eslint-disable arrow-body-style */
/* eslint-disable no-plusplus */
const cheerio = require('cheerio');
const axios = require("axios");

// type can be tech
const fetchData = async (userCity, userCountry, type) => {
  const result = await axios({
    method: "get",
    url: `https://www.meetup.com/find/events/&=${type}/?allMeetups=false&radius=50&userFreeform=${userCity}%2C+${userCountry}`,
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
    const locationsArray = [];
    const attendingArray = [];

    const dates = $('time').toArray();
    const titles = $('.resetLink.big.event.wrapNice.omnCamp.omngj_sj7e.omnrv_fe1').toArray();
    const links = $('.resetLink.big.event.wrapNice.omnCamp.omngj_sj7e.omnrv_fe1').toArray();
    const locations = $('.resetLink.omnCamp.omngj_sj7ea.omnrv_fe1a').toArray();
    const attendants = $('.attendee-count').toArray();

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

    locations.forEach((location) => {
      const locationString = $(location).text().replace(/(\r\n|\n|\r)/gm, "");
      locationsArray.push(locationString);
    });

    attendants.forEach((attendant) => {
      const attendantString = $(attendant).text().replace(/(\r\n|\n|\r|\D)/gm, "");
      attendingArray.push(attendantString);
    });

    for (let i = titlesArray.length - 1; i >= 0; i--) {
      dataSet.push({
        title: newTitles[i],
        date: datesArray[i],
        link: linksArray[i],
        location: locationsArray[i],
        source: 'meetup',
        city: userCity,
        country: userCountry,
        attending: attendingArray[i],
      });
    }

    resolve(dataSet);
  }).catch((error) => reject(error));
});

module.exports = scrapeEvents;
