/* eslint-disable arrow-body-style */
/* eslint-disable no-plusplus */
const cheerio = require('cheerio');
const axios = require("axios");
const dateFormatter = require('./eventBriteDateFormatter.js');
// For Event link reference, add scraped ID to visit the event page
// const linkFormat = `https://www.eventbrite.com/e/neurips-meetup-port-harcourt-tickets-${'link'}?aff=ebdssbdestsearch`;
// variable samples

// const travel = 'travel-and-outdoor';
// const userLocation = 'port-harcourt';
// variable samples
const fetchData = async (userCountry, userCity, eventType) => {
  const result = await axios({
    method: "get",
    url: `https://www.eventbrite.com/d/${userCountry}--${userCity}/${eventType}--events/`,
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
    const imagesArray = [];
    const locationsArray = [];
    const pricesArray = [];
    const dataSet = [];
    const dates = $('.eds-text-color--primary-brand').toArray();
    const titles = $('.eds-media-card-content__action-link').toArray();
    const links = $('.eds-media-card-content__action-link').toArray();
    const images = $('.eds-max-img').toArray();
    const locations = $('.card-text--truncated__one').toArray();
    const prices = $('.eds-media-card-content__flag').toArray();
    const eventLinksArray = [];
    images.forEach((image) => {
      const imageLink = $(image).attr('src');
      imagesArray.push(imageLink);
    });
    dates.forEach((item) => {
      if ($(item).text().includes('Today') || $(item).text().includes('Tomorrow') || $(item).text().includes(' + ')) {
        const text = dateFormatter($(item).text());
        datesArray.push(new Date(`${text} ${new Date().getFullYear()}`));
      } else {
        datesArray.push(new Date(`${$(item).text()} ${new Date().getFullYear()}`));
      }
    });
    titles.forEach((title) => {
      const fullTitle = $(title).text();
      const splitTitle = fullTitle.substring(0, (fullTitle.length / 2));
      titlesArray.push(splitTitle);
    });
    locations.forEach((location) => {
      locationsArray.push($(location).text());
    });
    prices.forEach((price) => {
      pricesArray.push($(price).text());
    });
    links.forEach((link) => {
      const fullLink = $(link).attr('href');
      const start = fullLink.indexOf('ts-') + 3;
      const end = fullLink.indexOf('?') - fullLink.indexOf('ts-') - 3;
      linksArray.push(fullLink.substr(start, end));
      eventLinksArray.push(fullLink);
    });
    const newTitles = titlesArray.filter((str) => /\S/.test(str));
    const uniqueTitles = Array.from(new Set(newTitles));
    const uniqueDates = Array.from(new Set(datesArray));
    const uniqueLinkIds = Array.from(new Set(linksArray));
    const uniqueImageLinks = Array.from(new Set(imagesArray));
    const uniqueLocations = Array.from(new Set(locationsArray));
    const uniquePrices = Array.from(new Set(pricesArray));
    const uniqueEventLinks = Array.from(new Set(eventLinksArray));
    for (let i = 0; i < uniqueTitles.length; i++) {
      dataSet.push({
        eventDate: uniqueDates[i],
        name: uniqueTitles[i],
        scrapedEventId: uniqueLinkIds[i],
        imageUrl: uniqueImageLinks[i],
        location: uniqueLocations[i],
        price: uniquePrices[i],
        scrapedEventLink: uniqueEventLinks[i],
        source: 'eventbrite',
        city: userCity,
        country: userCountry,
        eventType,
      });
    }
    resolve(dataSet);
  }).catch((error) => reject(error));
});

module.exports = scrapeEvents;
