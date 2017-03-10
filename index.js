const scrapeIt = require('scrape-it');

const availableBeers = [];
const getUrl = (pageNb) => (
  `https://www.latelierdesbieres.fr/12-achat-bieres-en-ligne#/page-${pageNb}`
);
let nbOfPages = 0;

/**
 * Display current beers if the program is interrupted.
 */
process.on('SIGINT', function() {
  console.log('It seems you killed the program. hopefully we caught your beers:');
  console.log(availableBeers);
  process.exit();
});

getNbOfPages((res) => {
  nbOfPages = res;
  (function getPage(counter) {
    getBeers(counter, () => {
      if (counter > 0) {
        console.log(`Getting page ${counter}...`);
        getPage(--counter);
      } else {
        displayAllBeers();
      }
    });
  })(nbOfPages);
});

function displayAllBeers() {
  console.log(availableBeers);
}

function getNbOfPages(callback) {
  scrapeIt(getUrl(1), {
    nbOfPages: '#pagination_bottom > ul > li.truncate + li'
  }, (err, page) => {
    if (!err) {
      callback(parseInt(page.nbOfPages, 10));
    } else {
      throw `Error while getting nbOfPages: ${err}`;
    }
  });
}

function getBeers(pageNb, callback) {
  scrapeIt(`https://www.latelierdesbieres.fr/12-achat-bieres-en-ligne#/page-${pageNb}`, {
    articles: {
      listItem: '#content > ul > li',
      data: {
        name: 'a.product-name',
        price: 'span.product-price',
        productUrl: {
          selector: 'a.product_img_link',
          attr: 'href',
        },
        pictureUrl: {
          selector: 'a.product_img_link > img',
          attr: 'src',
        }
      }
    }
  }, (err, page) => {
    if (!err) {
      page.articles.forEach((article) => {
        if (article.name.length > 0 && article.price.length > 0) {
          availableBeers.push(article);
        }
      });
      callback();
    } else {
      console.log(`Oops, we got an error for page ${pageNb}`);
    }
  });
}
