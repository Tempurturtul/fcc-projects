const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' })
  response.end('index');
});

app.get('/:date', (request, response) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  let date = new Date(request.params.date);

  if (date.toDateString() === 'Invalid Date') {
    // Try converting the date param to a number.
    date = new Date(Number(request.params.date));

    if (date.toDateString() === 'Invalid Date') {
      // Still no luck, assume invalid input.
      return response.json({ "unix": null, "natural": null });
    }
  }

  response.json({
    "unix": date.getTime(),
    "natural": `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
