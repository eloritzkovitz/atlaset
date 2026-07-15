**_Effective July 15, 2026_**

## Atlaset is a privacy-conscious travel and map app. This document explains what data the app uses, where it is stored and how you can manage it.

## Data We Collect

- **Account information** when you sign in (Google account basic profile).
- **Your custom data:** such as lists, layers, markers, saved maps, trips and friends.
- **Your activity:** events that appear on your activity page.
- **Local caching data** stored in your browser for offline use (IndexedDB).

## How Data Is Stored

By default Atlaset stores data locally in your browser using IndexedDB (via Dexie.js) for guest sessions and for offline support. When you sign in, your data is synced to Firebase (Firestore) under your account so you can access it across devices. Some app features write activity logs to Firestore to power the activity feed.

## Third-Party Services

Atlaset uses the following third-party services:

- **Firebase** — Authentication, Firestore database and App Check. Please refer to Firebase's privacy documentation for details.
- **Google Analytics** — Used to collect anonymous, aggregated usage metrics (like features used and session duration) to help us improve the app. GA4 does not log or store individual IP addresses; it performs a temporary geolocation lookup and discards the IP. You can find out how Google uses data [here](https://policies.google.com/technologies/partner-sites).
- **Hosting** — The application is deployed to providers such as Vercel or Render; these providers may collect standard hosting and access logs.

Map data used by Atlaset is primarily included in the app (for example built-in GeoJSON assets). If you enable optional external map providers or embed maps, those providers may collect connection information (IP address, tile requests) — consult their policies for specifics.

## Cookies & Tracking

Atlaset uses a service worker (PWA) for offline support. We also use cookies set by Google Analytics to collect optional, anonymous usage metrics to help us understand how the app is being used. This analytics tracking is completely optional, is disabled by default, and can be toggled at any time in the app settings. We request your explicit consent before enabling any tracking.

## Security

We use reasonable technical measures (Firebase security rules, App Check, HTTPS) to protect your data in transit and at rest. You are responsible for keeping your account credentials secure.

## Exporting & Deleting Data

You can export your maps and data from the app (JSON export) and download backups. To remove your cloud data, use the account settings page or open an issue/contact via GitHub and we will assist with deletion requests.

## Children

Atlaset is not directed at children under the age of 13.

## Contact & Changes

For privacy questions or data requests, open an issue or contact via the [GitHub repository](https://github.com/eloritzkovitz/atlaset).

We may update this policy from time to time; changes will be posted here with an updated effective date.
