const ghpages = require('gh-pages');
const options = {
  src: [
    '*',
    '*/**',
    '!node_modules',
  ],
  branch: 'heroku-url-shortener-microservice',
};

ghpages.publish(__dirname, options, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log('Successfully deployed.');
});
