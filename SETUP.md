# Deployment & Admin Setup (Hostinger)

This site is a React single-page app with a small PHP content API. Content for
**Blogs, Projects, Services, and Testimonials** is edited through a hidden admin
dashboard at `/admin` and stored as JSON files on the server, so edits go live
immediately with no rebuild.

---

## 1. How it fits together

```
public_html/                <- web root (what you deploy)
├── index.html              <- built React app
├── static/                 <- built JS/CSS
├── .htaccess               <- SPA routing + /api passthrough
└── api/                    <- PHP backend (content, login, uploads)

thecopystudio_data/          <- OUTSIDE web root (never redeployed, never public)
├── auth.json               <- admin password hash + token secret
├── content/                <- live blogs/projects/services/testimonials JSON
└── uploads/                <- uploaded images
```

The data folder is a **sibling of `public_html`**. Keeping it outside the web
root means git/FTP redeploys never overwrite your content, and secrets are never
downloadable. See `api/config.php` (`DATA_DIR`) — override with the
`CONTENT_DATA_DIR` env var if your layout differs.

---

## 2. Build the frontend

From the `frontend/` folder:

```bash
yarn install
yarn build
```

This produces the `build/` folder. Its contents (`index.html`, `static/`,
`.htaccess`, `robots.txt`, etc.) are what you upload to `public_html`.

> **API base URL:** the app calls `/api` on the same origin by default. Only set
> `REACT_APP_API_BASE` (in `.env`) if the API lives on a different host.

---

## 3. Upload to Hostinger

1. Upload everything inside `build/` into `public_html/`.
2. Upload the entire `api/` folder into `public_html/api/`.
3. Make sure `.htaccess` landed in `public_html/` (it can be hidden — enable
   "show hidden files" in the File Manager / your FTP client).

On first request the API auto-creates `thecopystudio_data/` (content + uploads)
next to `public_html` and seeds the content from `api/seed/*.json`.

---

## 4. Set the admin password (one time)

1. In a browser, visit:

   ```
   https://your-domain/api/set-password.php?password=YOUR_STRONG_PASSWORD
   ```

   (minimum 8 characters). This writes `auth.json` into the data folder.

2. **Delete `api/set-password.php` from the server** afterwards. To change the
   password later, re-upload it, run with `&force=1`, then delete it again.

---

## 5. Using the admin dashboard

- Go to **`https://your-domain/admin`** (intentionally unlinked from the site).
- Log in with the password you set.
- Pick a content type in the sidebar — **Blogs, Projects, Services,
  Testimonials** — to create, edit, delete entries, and upload images.
- Changes are saved to the live JSON files and appear on the public site right
  away (the site re-fetches automatically).
- The login token lasts 8 hours (`TOKEN_TTL` in `api/config.php`); after that
  you'll be asked to log in again.

---

## 6. Troubleshooting

| Symptom | Fix |
|---|---|
| `/admin` 404s on refresh | `.htaccess` missing from `public_html`, or `mod_rewrite` disabled. |
| Admin edits don't save (401) | Token expired — log in again. |
| "A password is already set" | Expected; add `&force=1` to reset, then delete the file. |
| Images don't display | Ensure `thecopystudio_data/uploads` is writable by PHP. |
| Site shows seed/mock data only | API unreachable — confirm `api/` uploaded and PHP is enabled. |

---

## 7. Security notes

- `auth.json` and all content/uploads live **outside** the web root.
- Only a bcrypt hash of the password is stored — never the plaintext.
- Always delete `set-password.php` after use.
- The `/admin` route is not linked anywhere; treat the URL + password as private.
