# LEMON — website

The LEMON Digital homepage, built from the Claude Design files in `design-source/`.
It's a plain HTML/CSS website: no build step, no installs. Every file can be edited in the browser on GitHub.

## What's in here

| File / folder | What it is |
|---|---|
| `index.html` | The English homepage |
| `fr/index.html` | The French homepage — **when you change text on one, change it on the other too** |
| `privacy.html`, `fr/confidentialite.html` | Privacy policy (English / French) |
| `assets/css/styles.css` | All styling: colours, fonts, layout and the mobile versions |
| `assets/js/main.js` | Mobile menu, contact form (WhatsApp or email), projects / clients / adverts |
| `assets/fonts/`, `assets/css/fonts.css` | The two brand fonts, hosted on the site itself |
| `sitemap.xml`, `robots.txt` | Help Google find every page |
| `assets/img/` | Favicon, app icons and the social-share image (`og-image.png`) |
| `404.html` | "Page not found" page |
| `data/` | Projects, clients and adverts (edited with Pages CMS) |
| `design-source/` | Your original Claude Design exports, kept for reference (not used by the site) |

## Updating projects and adverts (no code)

Projects (*Fresh work*), *Clients* and the advert banner are edited with **Pages CMS**, a free online editor for GitHub sites.

1. Go to **https://app.pagescms.org** and click **Sign in with GitHub**.
2. The first time, allow Pages CMS to access the `johnreni/lemon` repository.
3. Open **johnreni/lemon** and choose the `main` branch.
4. In the left menu:
   - **Projects (Fresh work)**: add, edit, reorder or remove projects. You can upload a picture for each one.
   - **Clients & reviews**: add clients, and paste in a review once a client sends you one (only use their real words, with their permission).
   - **Advert banner**: change the text, button, link or colour; upload a banner picture; or switch an advert off. If several adverts are switched on, they take turns.
5. Click **Save**. The live site updates within a minute or two.

Every item has optional **(French)** fields. Fill them in for the French page; if left empty, the English text is shown there.

The editor saves to `data/projects.json`, `data/testimonials.json`, `data/ads.json` and uploaded pictures to `assets/uploads/`. Its settings are in `.pages.yml`.

## Domain

The site is hosted free on GitHub Pages and shown at **https://getlemondigital.com** (the `CNAME` file sets this).
The domain is registered at Hostinger, whose DNS points it to GitHub:

| Type | Name | Points to |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | johnreni.github.io |

Don't change the MX or email-related TXT records; those run your email.
Nothing needs uploading to Hostinger: changes on GitHub or in Pages CMS go live on the domain automatically.

## Google and statistics (one-time setup, in the browser)

1. **Google Search Console**: https://search.google.com/search-console → *Add property* → *Domain* → `getlemondigital.com`. Google gives you a TXT record; add it in Hostinger's DNS (or Cloudflare's, if you moved to Cloudflare). Then open *Sitemaps* and submit `sitemap.xml`.
2. **Google Business Profile**: https://business.google.com → add LEMON with your Douala address or service area, phone, website and services. This is what puts you on Google Maps and in "near me" searches.
3. **Visitor statistics**: if your domain is on Cloudflare, go to the Cloudflare dashboard → *Analytics & Logs* → *Web Analytics* and enable it for getlemondigital.com. It's free and uses no cookies, so no banner is needed.

## Still to do

- **Social links**: none yet. Send them over and a *Follow* column can go back in the footer.

## Contact form

Visitors choose **Send on WhatsApp** (opens WhatsApp with their message written, to +237 656 433 068) or **Send by email**.
By default, *Send by email* opens the visitor's email app. To receive emails directly instead, create a free form at [formspree.io](https://formspree.io)
with info@getlemondigital.com, then paste the form URL it gives you into `action=""` on the `<form>` tag **in both `index.html` and `fr/index.html`**,
for example `action="https://formspree.io/f/abcd1234"`.
