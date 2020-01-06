/* eslint-disable no-console */
/* eslint-disable no-plusplus */
const cheerio = require('cheerio');
const axios = require("axios");

// For Event link reference, add scraped ID to visit the event page
// const linkFormat = `https://www.eventbrite.com/e/neurips-meetup-port-harcourt-tickets-${'link'}?aff=ebdssbdestsearch`;
// variable samples
const science = 'science-and-tech';
// const travel = 'travel-and-outdoor';
const locationSample = 'port-harcourt';
// variable samples

export default function ScrapeEvents() {
  const fetchData = async () => {
    const result = await axios({
      method: "get",
      url: `https://www.eventbrite.com/d/nigeria--${locationSample}/${science}--events/`,
      json: true,
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    return cheerio.load(result.data, {
      normalizeWhitespace: false,
    });
  };

  fetchData().then(($) => {
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

    images.forEach((image) => {
      const imageLink = $(image).attr('src');
      imagesArray.push(imageLink);
    });

    dates.forEach((item) => {
      datesArray.push($(item).text());
    });

    titles.forEach((title) => {
      titlesArray.push($(title).text());
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
    });

    const newTitles = titlesArray.filter((str) => /\S/.test(str));

    for (let i = 0; i < datesArray.length; i++) {
      dataSet.push({
        date: datesArray[i],
        title: newTitles[i],
        link: linksArray[i],
        image_link: imagesArray[i],
        Location: locationsArray[i],
        Price: pricesArray[i],
      });
    }

    return dataSet;
  }).catch((error) => console.log(error));
}
