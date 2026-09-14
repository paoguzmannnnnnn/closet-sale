# The Drop — Closet Sale App

A full-stack web app to organize and run a closet sale with friends: track inventory, mark items as sold, and see how much each person has raised in real time.

**Stack:** React · Supabase · Vercel

🔗 **Live demo:** https://closet-sale.vercel.app
*(Note: hosted on a free tier — if the link is down, the app can be run locally with the steps below.)*

---

## Features

- Add, edit, and delete items with a photo or an emoji
- Upload photos from camera or gallery
- Mark items as sold
- See total raised per person
- Global dashboard showing each person's progress
- Supports up to 6 people, each with their own color

---

## Tech stack

- **Frontend:** React
- **Backend / Database:** Supabase (PostgreSQL + storage)
- **Hosting:** Vercel

---

## Run it locally

### 1. Install dependencies

```
npm install
```

### 2. Set up environment variables

Copy `.env.example` to a new file called `.env` and fill in your own Supabase credentials:

```
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> `.env` is git-ignored on purpose — never commit your real credentials.

### 3. Start the app

```
npm start
```

Then open http://localhost:3000

---

## Deploy on Vercel

1. Push the project to GitHub.
2. Go to vercel.com and sign in with GitHub.
3. Click **Add New Project** and import the `closet-sale` repo.
4. Under **Environment Variables**, add:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
5. Click **Deploy**.

Vercel will give you a live URL like `https://closet-sale-xxx.vercel.app`.

---
