/* Assemble the contact address at runtime so the literal email never appears
   in any page source. Spam harvesters scrape the static HTML and don't run
   JS, so this hides the address from them while keeping the link working for
   real visitors. The "@" is built via char code so even "hi@" never appears. */
(function () {
  var user = 'hi', host = 'kilmaru.com';
  var addr = user + String.fromCharCode(64) + host;
  var links = document.querySelectorAll('.js-mail');
  for (var i = 0; i < links.length; i++) {
    links[i].setAttribute('href', 'mailto:' + addr);
  }
})();
