const axios = require("axios").default;
const cheerio = require("cheerio");

const newspapers = [
  // ... (same newspaper data)
];

const articles = [];

exports.handler = async (event, context) => {
  newspapers.forEach(async (newspaper) => {
    try {
      const response = await axios.get(newspaper.address);
      const html = response.data;
      const $ = cheerio.load(html);

      $('a:contains("Red Bull")', html).each(function () {
        if ($(this).children("img").length === 0) {
          const title = $(this).text().replace(/\s+/g, " ").trim();
          const url = $(this).attr("href");

          if (title && title.length > 0) {
            articles.push({
              title,
              url: newspaper.base + url,
              source: newspaper.name,
            });
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  });

  return {
    statusCode: 200,
    body: JSON.stringify(articles),
  };
};
