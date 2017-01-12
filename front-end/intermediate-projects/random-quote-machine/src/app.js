(function() {
  var quoteBoxElem = document.querySelector('.quote-box');
  var currentQuoteIndex = 0;
  var quotes = shuffle([
    {
      quote: "Stand up, there you go. You were dreaming. What's your name?",
      source: "Jiub"
    },
    {
      quote: "Well, not even last night's storm could wake you. I heard them say we've reached Morrowind. I'm sure they'll let us go.",
      source: "Jiub"
    },
    {
      quote: "Quiet, here comes the guard.",
      source: "Jiub"
    },
    {
      quote: "This is where you get off, come with me.",
      source: "Imperial Guard"
    },
    {
      quote: "Get yourself up on deck, and let's keep this as civil as possible.",
      source: "Imperial Guard"
    },
    {
      quote: "This is where they want you. Head down to the dock and he'll show you to the Census Office.",
      source: "Imperial Guard"
    },
    {
      quote: "You finally arrived, but our records don't show from where.",
      source: "Imperial Guard"
    },
    {
      quote: "Great. I'm sure you'll fit right in. Follow me up to the office and they'll finish your release.",
      source: "Imperial Guard"
    },
    {
      quote: "Ahh yes, we've been expecting you. You'll have to be recorded before you're officially released. There are a few ways we can do this, and the choice is yours.",
      source: "Socucius Ergalla"
    },
    {
      quote: "Very good. The letter that preceded you mentioned you were born under a certain sign. And what would that be?",
      source: "Socucius Ergalla"
    },
    {
      quote: "Interesting. Now before I stamp these papers, make sure this information is correct.",
      source: "Socucius Ergalla"
    },
    {
      quote: "Show your papers to the Captain when you exit to get your release fee.",
      source: "Socucius Ergalla"
    },
    {
      quote: "First, let me take your identification papers. Thank you. Word of your arrival only reached me yesterday. I am Sellus Gravius. But my background is not important. I'm here to welcome you to Morrowind.",
      source: "Sellus Gravius"
    },
    {
      quote: "Yes. You're in Morrowind. I don't know why you're here. Or why you were released from prison and shipped here. But your authorization comes directly from Emperor Uriel Septim VII himself. And I don't need to know any more than that. When you leave this office, you are a free man. But before you go, I have instructions on your duties. Instructions from the Emperor. So pay careful attention.",
      source: "Sellus Gravius"
    },
    {
      quote: "This package came with the news of your arrival. You are to take it to Caius Cosades, in the town of Balmora. Go to the South Wall Cornerclub, and ask for Caius Cosades -- they'll know where to find him. Serve him as you would serve the Emperor himself. I also have a letter for you, and a disbursal to your name.",
      source: "Sellus Gravius"
    },
    {
      quote: "Report to Caius Cosades in Balmora. I can't tell you where to find him, but you are to go to the South Wall Cornerclub and ask for him. Someone there can direct you to him.",
      source: "Sellus Gravius"
    }
  ]);

  init();

  function init() {
    var newQuoteBtn = document.querySelector('.new-quote-btn');
    newQuoteBtn.addEventListener('click', nextQuote);

    render();
  }

  function render() {
    var quote = '<p>' +
                  '<q>' + quotes[currentQuoteIndex].quote + '</q>' +
                '</p>';
    var citation = '<p>' +
                     '–' + quotes[currentQuoteIndex].source +
                   '</p>';
    var tweetBtn = '<a class="twitter-share-button" ' +
                     'href="https://twitter.com/intent/tweet" data-count="none" data-url="none" data-text="' + trailOff(quotes[currentQuoteIndex].quote, 140) + '">' +
                     'Tweet' +
                   '</a>';

    quoteBoxElem.innerHTML = quote + citation + tweetBtn;

    // Refresh the twitter widgets.
    twttr.widgets.load();
  }

  function nextQuote() {
    if (currentQuoteIndex >= quotes.length - 1) {
      quotes = shuffle(quotes);
      currentQuoteIndex = 0;
    } else {
      currentQuoteIndex++;
    }

    render();
  }

  function shuffle(array) {
    // Avoid mutating the argument array.
    array = array.slice(0);
    var length = array.length;
    var shuffled = [];

    while (length > 0) {
      var index = Math.floor(Math.random() * length);

      shuffled.push(array[index]);
      array.splice(index, 1);

      length--;
    }

    return shuffled;
  }

  function trailOff(string, maxLength) {
    if (maxLength < 3) {
      throw new Error('Second argument (max length) must be >= 3.')
    }

    if (string.length > maxLength) {
      string = string.substr(0, maxLength - 3);

      // Try to trim the end of the string from the last occurence of whitespace.
      if (string.lastIndexOf(' ') !== -1) {
        string = string.substr(0, string.lastIndexOf(' '));
      }

      string += '...';
    }

    return string;
  }
})();
