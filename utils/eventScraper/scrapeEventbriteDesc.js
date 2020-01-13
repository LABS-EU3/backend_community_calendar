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

const scrapeDescriptions = (link) => new Promise((resolve, reject) => {
  fetchData(link).then(($) => {
    let description = '';

    $('.js-xd-read-more-contents.l-mar-top-3').toArray().forEach((desc) => {
      const descriptionText = $(desc).text().replace(/(\r\n|\n|\t|\r)/gm, "");
      description = descriptionText;
    });

    resolve(description);
  }).catch((error) => reject(error));
});

module.exports = scrapeDescriptions;
