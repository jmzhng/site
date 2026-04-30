# jeremy zhang — personal site

Static site, vanilla HTML / CSS / JS. No build step.

## File layout

```
index.html        ← home
about.html        ← about me
blog.html         ← thoughts (post archive)
styles.css        ← all styling, theme variables at top
clock.js          ← live timezone clocks
posts.js          ← the POSTS array (list of post URLs) + render logic
posts/
  example.html         ← newest example post / template
  older-example.html   ← older example post
```

## Adding a blog post

Two steps:

1. **Create the post file.** Easiest way: copy `posts/example.html` to a new file (e.g. `posts/my-new-post.html`). At the top of the file, edit two `<meta>` tags:
   ```html
   <meta name="post-title" content="Your Title Here" />
   <meta name="post-date"  content="2026-04-30" />
   ```
   Then write the post body inside `<div class="post-body">`. The on-page title, the date below it, and the browser-tab title all fill in automatically from those meta tags.

2. **Register the post.** Open `posts.js` and add the path to the `POSTS` array:
   ```js
   window.POSTS = [
     "posts/my-new-post.html",
     "posts/example.html",
     "posts/older-example.html",
   ];
   ```
   Order in the array doesn't matter — posts are sorted by their `post-date` automatically. The home page shows the 5 most recent; the thoughts page groups everything by year.

That's it. Don't touch `index.html` or `blog.html` — the lists there are generated.

## Editing the rest

| Where | What |
|---|---|
| `index.html` → `<p class="blurb">` | short bio on home |
| `index.html` → `<div class="times">` | timezone rows (city name, IANA timezone in `data-tz`, link URLs) |
| `about.html` → `<p class="about-contacts">` | git / twt / lin / email |
| `about.html` → `<div class="about-body">` | long-form bio |
| `styles.css` → `:root` block | accent color, text colors, grid spacing |

## Hosting on GitHub Pages

1. Push to a GitHub repo.
2. Settings → Pages → Source: **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. Site lives at `https://<username>.github.io/<repo>/`.

For a user/org root site, name the repo `<username>.github.io` and it lives at `https://<username>.github.io/`.

## Local preview

Because the post lists use `fetch()`, the site needs to be served over HTTP — opening `index.html` directly via `file://` will leave the lists empty. From the project root:

```
python3 -m http.server 8000
```

Then open <http://localhost:8000>.
