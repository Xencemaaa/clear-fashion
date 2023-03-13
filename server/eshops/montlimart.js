const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.product-list .product-list__block')
    .map((i, element) => {
      const name = $(element)
        .find('.text-reset')
        .text()
        .trim()
        .replace(/\s+/g, ' ');
      const price = parseFloat(
        $(element)
          .find('.text-reset')
          .text()
          .replace(/[^\d.,]/g, '')
          .replace(',', '.')
      );

      return {name, price};
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {String} url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();

      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
