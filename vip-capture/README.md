# VIP Capture

Vine Studio 158's crew app for the AskDoctorFaith VIP (day session + gala):

- **Live shared checklist.** When anyone ticks a shot, it appears on every crew phone within a second or two, with their name.
- **Works with bad Wi-Fi.** Ticks are saved on the phone and sync when the signal comes back.
- **Inspo board.** Add shots and reels to try (photo, video or Instagram/TikTok/YouTube link) and mark them tried.
- **Installs like an app.** Add to Home Screen gives an app icon, full screen, and it opens offline.

It's a static site (plain HTML/JS, no build step). Live sync runs on a free **Supabase** project.

## Setup (about 10 minutes)

### 1. Create the database (free)
1. Go to supabase.com and sign up. Click **New project**, give it a name (e.g. `vip-capture`), set a password and pick the region closest to you.
2. When it's ready, open **SQL Editor → New query**, paste everything from `supabase-setup.sql`, and click **Run**.

### 2. Add your keys
1. In Supabase, open **Project Settings → API**. Copy the **Project URL** and the **anon public** key.
2. In GitHub, open `vip-capture/config.js`, click the pencil icon, paste both values, and commit.
   - The anon key is meant to be used in browser apps. Never paste the `service_role` key.

### 3. Put it online (free)
**Netlify:** Add new site → Import an existing project → GitHub → pick this repo.
- Branch: the branch this folder is on
- Base directory: `vip-capture`
- Build command: leave empty
- Publish directory: `vip-capture`

**Vercel** works the same way: Import the repo, set Root Directory to `vip-capture`, Framework: Other, no build command.

You'll get a link like `https://vip-capture.netlify.app`. Send it to the crew.

### 4. Install on each phone
- **iPhone (Safari):** open the link, tap Share, then **Add to Home Screen**.
- **Android (Chrome):** open the link, tap ⋮, then **Install app** (or **Add to Home screen**).

Each person picks their name at the top the first time they open it.

## Notes
- **No logins.** Anyone with the link can tick and add inspo, so share it only with the crew.
- **To reset after an event,** run `delete from ticks; delete from inspo;` in the Supabase SQL Editor.
- **The schedule and shot lists** live in `index.html` (the `DAY` and `GALA` arrays in the script), so you can edit them for the next event.
