# LEMON — website

The LEMON Digital homepage, built from the Claude Design files in `design-source/`.
It's a plain HTML/CSS website: no build step, no installs. Every file can be edited in the browser on GitHub.

## What's in here

| File / folder | What it is |
|---|---|
| `index.html` | The homepage (all text lives here) |
| `assets/css/styles.css` | All styling: colours, fonts, layout and the mobile versions |
| `assets/js/main.js` | Mobile menu, contact form, footer year |
| `assets/img/` | Favicon, app icons and the social-share image (`og-image.png`) |
| `404.html` | "Page not found" page |
| `data/` | Projects and adverts (edited with Pages CMS) |
| `design-source/` | Your original Claude Design exports, kept for reference (not used by the site) |

## Updating projects and adverts (no code)

Projects (*Fresh work*) and the advert banner are edited with **Pages CMS**, a free online editor for GitHub sites.

1. Go to **https://app.pagescms.org** and click **Sign in with GitHub**.
2. The first time, allow Pages CMS to access the `johnreni/lemon` repository.
3. Open **johnreni/lemon** and choose the `main` branch.
4. In the left menu:
   - **Projects (Fresh work)**: add, edit, reorder or remove projects. You can upload a picture for each one.
   - **Advert banner**: change the text, button, link or colour; upload a banner picture; or switch an advert off. If several adverts are switched on, they take turns.
5. Click **Save**. The live site updates within a minute or two.

The editor saves to `data/projects.json`, `data/ads.json` and uploaded pictures to `assets/uploads/`. Its settings are in `.pages.yml`.

## Still to do

- **Domain**: when `getlemondigital.com` points to this site, change the two `johnreni.github.io/lemon` addresses at the top of `index.html` to it.
- **Social links**: none yet. Send them over and a *Follow* column can go back in the footer.

## Contact form

By default, **Send** opens the visitor's email app with their message already written, addressed to `data-email`.
If you'd rather receive messages without that step, create a free form at [formspree.io](https://formspree.io).
Then paste the form URL it gives you into `action=""` on the `<form>` tag, for example `action="https://formspree.io/f/abcd1234"`.
