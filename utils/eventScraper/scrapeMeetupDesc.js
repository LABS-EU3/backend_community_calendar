/* eslint-disable arrow-body-style */
/* eslint-disable no-plusplus */
const cheerio = require('cheerio');
const axios = require("axios");

const fetchData = async (link) => {
  const result = await axios({
    method: "get",
    url: link,
    json: true,
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });
  return cheerio.load(result.data, {
    normalizeWhitespace: false,
  });
};

const scrapeDescription = (link) => new Promise((resolve, reject) => {
  return fetchData(link).then(($) => {
    const dataSet = [];
    const descArray = [];
    const hostArray = [];
    const locationsArray = [];

    const descriptions = $('.event-description.runningText').toArray();
    const locations = $('.venueDisplay-venue-address.text--secondary.text--small').toArray();
    const hosts = $('.text--bold.text--small.display--inlineBlock').toArray();

    hosts.forEach((host) => {
      const hostString = $(host).text().replace(/(\r\n|\n|\r)/gm, "");
      hostArray.push(hostString);
    });

    locations.forEach((location) => {
      const locationString = $(location).text().replace(/(\r\n|\n|\r)/gm, "");
      locationsArray.push(locationString);
    });

    descriptions.forEach((description) => {
      const descriptionString = $(description).text().replace(/(\r\n|\n|\r)/gm, "");
      descArray.push(descriptionString);
    });

    for (let i = descArray.length - 1; i >= 0; i--) {
      dataSet.push({
        description: descArray[i],
        location: `${locationsArray[i]}`,
        host: hostArray[i],
      });
    }

    resolve(dataSet);
  }).catch((error) => reject(error));
});

module.exports = scrapeDescription;
