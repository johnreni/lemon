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
| `design-source/` | Your original Claude Design exports, kept for reference (not used by the site) |

## Things to fill in before launch

Search `index.html` for `[` and `EDIT:` to find them all.

1. **Prices**: `[YOUR PRICE]` (twice) and `[X]` posts a month in *Packages*.
2. **Contact details**: `[hello@yourdomain.com]`, `[+000 000 000 000]`, `[City, Country]`. Update the `mailto:` and `tel:` links too.
3. **Form email**: `data-email="hello@yourdomain.com"` on the contact form.
4. **Projects**: `[Client name]` and `[Project image]` in *Fresh work*. Upload photos to `assets/img/` and swap the placeholder text for
   `<img src="assets/img/your-photo.jpg" alt="What the project is">`.
5. **Social links**: in the footer *Follow* column, replace each `href="#top"` with your profile URL.
6. **Web address**: in the `<head>`, replace `https://www.yourdomain.com` (2 places) so link previews show the right image.

## Contact form

By default, **Send** opens the visitor's email app with their message already written, addressed to `data-email`.
If you'd rather receive messages without that step, create a free form at [formspree.io](https://formspree.io).
Then paste the form URL it gives you into `action=""` on the `<form>` tag, for example `action="https://formspree.io/f/abcd1234"`.
