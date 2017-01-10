const ghpages = require('gh-pages');
const path = require('path');
const options = {
  src: [
    '*',
    '*/**',
    '!node_modules/**',
    '!tasks/**',
  ],
  branch: 'heroku-url-shortener-microservice',
};

ghpages.publish(path.join(__dirname, '..'), options, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log('Successfully deployed.');
});
