# LKM Beauty — React + Firebase

Korean skincare/makeup e-commerce site. Public pages (Home, Services, About,
Contact) plus a protected Admin dashboard (login, register, forgot password,
product CRUD) built on Firebase Auth + Firestore.

## 1. Install dependencies

```bash
npm install
```

## 2. Create your Firebase project

1. Go to https://console.firebase.google.com → **Add project**.
2. Once created, click the **web icon (</>)** to register a web app — this gives you a config object.
3. In the left sidebar, enable:
   - **Authentication** → Sign-in method → enable **Email/Password**.
   - **Firestore Database** → Create database → start in **test mode** (fine for a class project; see security rules note below).

## 3. Add your Firebase keys

Copy `.env.example` to `.env` and paste in the values from step 2:

```bash
cp .env.example .env
```

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## 4. Run it

```bash
npm run dev
```

Visit `http://localhost:5173`. Public pages work immediately (they fall back
to sample products until Firestore has real data). Go to
`/admin/register` to create your first admin account, then `/admin/login`
to manage products.

## What's included

- `src/pages/` — Home, Services, About, Contact (public site)
- `src/admin/` — Login, Register, ForgotPassword, protected Dashboard with
  full product CRUD (Create, Read, Update, Delete)
- `src/context/AuthContext.jsx` — Firebase Auth wrapper (login, register,
  logout, password reset)
- `src/firebase/config.js` — Firebase app initialization
- `src/firebase/products.js` — Firestore CRUD functions for the `products`
  collection
- `src/components/ProtectedRoute.jsx` — redirects to `/admin/login` if not
  signed in

The Contact form writes each submission to a `messages` collection in
Firestore, so you can show that off as "CRUD" too (Create for visitors,
Read for you in the Firebase console or a future admin tab).

## Firestore structure

- **products** — `{ name, category, price, description, createdAt }`
- **messages** — `{ name, email, message, createdAt }`

## Before you submit / deploy

Firestore "test mode" rules allow anyone to read/write for 30 days — fine
for local dev, not for a real deploy. A minimal rule set for this project:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /messages/{id} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

Paste that into Firebase Console → Firestore → Rules before you deploy or
demo it live.