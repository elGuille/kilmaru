/* ───────────────────────────────────────────────────────────
   Umami analytics loader (privacy-first, cookieless, no banner)

   👉  ONLY THING TO DO:
   1. Sign up at https://cloud.umami.is  (or your self-hosted Umami)
   2. Add a website -> copy its "Website ID"
   3. Paste it below, replacing REPLACE_WITH_YOUR_WEBSITE_ID
   4. Commit & push. Done — every page that loads umami.js is tracked.

   If you self-host, also change UMAMI_SRC to your own script URL.
   Outbound link clicks are tracked automatically via the
   data-umami-event="..." attributes already on the links.
   ─────────────────────────────────────────────────────────── */
(function () {
  var WEBSITE_ID = 'e5fcae97-3ccd-4a67-9be4-ce43a0d282f5';
  var UMAMI_SRC = 'https://analytics.kilmaru.com/script.js';

  // Don't load until configured (avoids 400s with a placeholder id).
  if (!WEBSITE_ID || WEBSITE_ID === 'REPLACE_WITH_YOUR_WEBSITE_ID') return;

  var s = document.createElement('script');
  s.defer = true;
  s.src = UMAMI_SRC;
  s.setAttribute('data-website-id', WEBSITE_ID);
  document.head.appendChild(s);
})();
