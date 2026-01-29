# Changelog

## 2026-01-29

- **Countries:** Replaced 3x2 flags with own package and made some improvements <span class="changelog-tag chore">chore</span>
- **General:** Added changelog page <span class="changelog-tag docs">docs</span>
- **UI:** Fixed some layouts <span class="changelog-tag bugfix">bugfix</span>
- **User:** Added menu option for bug reporting <span class="changelog-tag feature">feature</span>

## 2026-01-27

- **Dashboard:** Added personal achievements <span class="changelog-tag feature">feature</span>

## 2026-01-16

- **Trips:** Added pagination to the trips table <span class="changelog-tag feature">feature</span>

## 2026-01-15

- **Trips:** Added trip participants, allowing users to share the same trips with family and friends <span class="changelog-tag feature">feature</span>
- **Trips:** Removed support for trips in guest mode <span class="changelog-tag breaking">breaking</span>
- **UI:** Some UI updates and fixes <span class="changelog-tag bugfix">bugfix</span>

## 2026-01-12

- **Atlas | Countries:** Updated sort button and menu <span class="changelog-tag feature">feature</span>
- **Countries:** Added new toggle for sovereign countries <span class="changelog-tag feature">feature</span>
- **General:** Fixed some bugs <span class="changelog-tag bugfix">bugfix</span>

## 2026-01-11

- **Atlas | Export:** Added an option to embed maps with an HTML iframe <span class="changelog-tag feature">feature</span>
- **UI:** Updated some layouts to be more flexible <span class="changelog-tag chore">chore</span>

## 2026-01-09

- **Atlas | Export:** Expanded map export to allow sharing maps via an encoded URL <span class="changelog-tag feature">feature</span>
- **Atlas | Export:** Added download data as JSON option <span class="changelog-tag feature">feature</span>
- **Atlas | Map:** Updated UI to show interactive elements and data based on map mode <span class="changelog-tag feature">feature</span>

## 2026-01-08

- **Atlas | Map:** Replaced use of react-simple-maps with updated and improved components for better control and maintainability <span class="changelog-tag chore">chore</span>
- **Atlas | Map:** Centralized map state management <span class="changelog-tag chore">chore</span>
- **Atlas | Map:** Some other map fixes <span class="changelog-tag bugfix">bugfix</span>

## 2026-01-06

- **General:** Added a new homepage <span class="changelog-tag feature">feature</span>
- **General:** Added a new about page <span class="changelog-tag feature">feature</span>
- **UI:** Updated layouts for some pages <span class="changelog-tag chore">chore</span>

## 2026-01-05

- **Atlas:** Reorganized some UI components and layouts in the atlas page <span class="changelog-tag chore">chore</span>
- **General:** Moved auth and settings management to Redux <span class="changelog-tag chore">chore</span>
- **UI:** Updated loading spinners and error messages across pages <span class="changelog-tag feature">feature</span>

## 2026-01-02

- **General:** Added audio and animation effects in various places <span class="changelog-tag feature">feature</span>
- **General:** Redesigned tooltips and removed some unnecessary ones <span class="changelog-tag chore">chore</span>
- **General:** Updated all static data fetching to be prebuilt and not cached <span class="changelog-tag chore">chore</span>
- **Quizzes:** Renamed games to quizzes <span class="changelog-tag chore">chore</span>
- **Quizzes:** Redesigned quizzes to allow types, modes and difficulties, and updated logic accordingly <span class="changelog-tag feature">feature</span>
- **Quizzes:** Added leaderboards to show 25 best results for each category <span class="changelog-tag feature">feature</span>

## 2025-12-28

- **Atlas | Filters:** Fixed default selection for core filters <span class="changelog-tag bugfix">bugfix</span>
- **Atlas | Layers:** Updated layers to support custom filter labels <span class="changelog-tag feature">feature</span>

## 2025-12-27

- **Atlas | UI** Redesigned map legend <span class="changelog-tag feature">feature</span>
- **General:** Updated service structures to be consistent <span class="changelog-tag chore">chore</span>
- **User | Friends:** Users can now add and manage friends <span class="changelog-tag feature">feature</span>
- **User | Activity:** Updated activity actions to be based on a number value <span class="changelog-tag chore">chore</span>

## 2025-12-23

- **User | Profile:** User profiles are now public, accessible through dynamic routes <span class="changelog-tag feature">feature</span>
- **User | Profile:** Added various profile display fields <span class="changelog-tag feature">feature</span>
- **User | Profile:** Home country and visited countries are now stored in the user profile and in the case of the latter synced automatically <span class="changelog-tag feature">feature</span>

## 2025-12-22

- **UI:** Fixed a bug with pagination <span class="changelog-tag bugfix">bugfix</span>
- **Countries:** Improved text and flag alignment in the display <span class="changelog-tag chore">chore</span>
- **Countries:** Added new options to filter countries in the display by region and subregion <span class="changelog-tag feature">feature</span>

## 2025-12-21

- **General:** Added CI workflow on every push and PR <span class="changelog-tag chore">chore</span>
- **General:** Updated some types, contexts, providers and hooks to satisfy linting rules <span class="changelog-tag chore">chore</span>

## 2025-12-20

- **Settings:** Reorganized settings into groups <span class="changelog-tag chore">chore</span>
- **Settings:** Moved settings to a dedicated settings page <span class="changelog-tag feature">feature</span>
- **Settings:** Moved account activity and security to settings <span class="changelog-tag feature">feature</span>
- **Settings:** Added account management actions for deactivation and deletion <span class="changelog-tag feature">feature</span>

## 2025-12-18

- **General:** Removed committed .env files and moved values to the gitignored .env <span class="changelog-tag security">security</span>
- **General:** Added app check handling in production and Firestore rules <span class="changelog-tag security">security</span>
- **General:** Added local data caching for static data to reduce API calls and cold loading <span class="changelog-tag chore">chore</span>
- **General:** Fixed some bugs <span class="changelog-tag bugfix">bugfix</span>
- **UI:** Updated layout to be responsive <span class="changelog-tag chore">chore</span>
- **UI:** Added drawer panels and swipe navigation for mobile screens <span class="changelog-tag feature">feature</span>

## 2025-12-17

- **General:** Deployed application <span class="changelog-tag chore">chore</span>

## 2025-12-16

- **Trips:** Trips can now be added without dates, if the "tentative dates" checkbox is selected <span class="changelog-tag feature">feature</span>
- **Visits:** Updated visit logic to show visits chronologically and grouped by categories (past visits, upcoming, planned) <span class="changelog-tag feature">feature</span>
- **General:** Added a not found page <span class="changelog-tag feature">feature</span>

## 2025-12-15

- **UI:** Replaced color classes with defined theme colors <span class="changelog-tag chore">chore</span>
- **UI:** Improved styling for menus, dropdowns, inputs and other elements <span class="changelog-tag chore">chore</span>
- **UI:** Dark theme will now be the default theme <span class="changelog-tag feature">feature</span>

## 2025-12-10

- **Trips:** Added the option to rate and favorite trips <span class="changelog-tag feature">feature</span>
- **Trips:** Updated the trips table to use pagination and infinite scrolling <span class="changelog-tag feature">feature</span>

## 2025-12-09

- **General:** Implemented pagination for loading lists <span class="changelog-tag feature">feature</span>
- **General:** Fixed some bugs <span class="changelog-tag bugfix">bugfix</span>
- **User | Profile:** Added user profile page <span class="changelog-tag feature">feature</span>
- **User | Profile:** Added logging and displaying actions in the profile page <span class="changelog-tag feature">feature</span>
- **User | Profile:** Added a security section showing some information <span class="changelog-tag feature">feature</span>

## 2025-12-07

- **Dashboard:** Added dashboard feature, showing statistics and information <span class="changelog-tag feature">feature</span>
- **Dashboard:** Moved the old trips statistics from trips to the dashboard <span class="changelog-tag chore">chore</span>
- **General:** Added Electron desktop wrapper for cross-platform support <span class="changelog-tag feature">feature</span>
- **User | Auth:** Implemented UI for login and signup to allow authentication with email/password in addition to Google sign-in <span class="changelog-tag feature">feature</span>
- **User | Auth:** Added password reset and session persistence support <span class="changelog-tag feature">feature</span>

## 2025-12-02

- **UI:** Redesigned the main layout <span class="changelog-tag chore">chore</span>
- **UI:** Updated menu to a sidebar menu, available across all pages <span class="changelog-tag feature">feature</span>
- **UI:** Fixed some panel and menu bugs <span class="changelog-tag bugfix">bugfix</span>

## 2025-12-01

- **User | Auth:** Connected app with Firebase Authentication and Firestore to support user authentication and data persistence <span class="changelog-tag feature">feature</span>
- **User | Auth:** IndexedDB now works for guest sessions <span class="changelog-tag feature">feature</span>
- **User | Auth:** Upon login, current guest session data will be merged with the account's data <span class="changelog-tag feature">feature</span>

## 2025-11-29

- **Atlas | Timeline:** Updated timeline mode with new features: play/pause controls, a timeline bar with years and visited countries, timeline filters <span class="changelog-tag feature">feature</span>
- **Atlas | Timeline:** Visited countries will now be highlighted on the map and in the country list when moving between years <span class="changelog-tag feature">feature</span>
- **General:** Improved keyboard focus support for accessibility <span class="changelog-tag feature">feature</span>
- **Settings:** Updated settings to allow coloring home country and grouped color palettes <span class="changelog-tag feature">feature</span>

## 2025-11-18

- **Atlas | Timeline:** Timeline mode can now be navigated with arrow keys <span class="changelog-tag feature">feature</span>
- **Atlas | Timeline:** Added an additional yearly mode <span class="changelog-tag feature">feature</span>
- **Settings:** Added color settings for overlays and timeline modes, which can be chosen from the settings <span class="changelog-tag feature">feature</span>

## 2025-11-16

- **UI:** Some UI updates <span class="changelog-tag chore">chore</span>

## 2025-11-15

- **Atlas | Countries:** Added visit status badge next to countries in the details modal <span class="changelog-tag feature">feature</span>
- **Atlas | Export:** Expanded map export formats to include JPEG and WebP as well <span class="changelog-tag feature">feature</span>
- **Atlas | Timeline:** Improved timeline mode to color countries by visit count <span class="changelog-tag feature">feature</span>
- **Test:** Added Vitest unit tests for shared and feature hooks and utilities <span class="changelog-tag test">test</span>
- **Test:** Added Cypress E2E tests for various main flows <span class="changelog-tag test">test</span>
- **Test:** Improved component testability <span class="changelog-tag test">test</span>

## 2025-11-06

- **General:** Implemented PWA support <span class="changelog-tag feature">feature</span>

## 2025-11-05

- **General:** Moved data logic to services <span class="changelog-tag chore">chore</span>

## 2025-11-04

- **UI:** Added branding <span class="changelog-tag feature">feature</span>

## 2025-11-01

- **Trips:** Added trip management <span class="changelog-tag feature">feature</span>
- **General:** Switched data persistence from LocalStorage to IndexedDB <span class="changelog-tag chore">chore</span>
- **General:** Various other updates to components, hooks and other shared files <span class="changelog-tag chore">chore</span>

## 2025-10-22

- **Atlas | Countries:** Non-sovereign countries will now show their sovereign/claimant <span class="changelog-tag feature">feature</span>
- **General:** Reorganized and improved components, utility functions and style classes <span class="changelog-tag chore">chore</span>
- **UI:** Fixed some UI bugs <span class="changelog-tag bugfix">bugfix</span>

## 2025-10-19

- **Atlas | Markers:** Added map markers <span class="changelog-tag feature">feature</span>

## 2025-10-18

- **Atlas | Layers:** Layers can now be reordered by dragging them <span class="changelog-tag feature">feature</span>
- **General:** Modals in the toolbar will now close when clicking outside the modal area <span class="changelog-tag feature">feature</span>
- **General:** Fixed some other minor bugs <span class="changelog-tag bugfix">bugfix</span>

## 2025-10-17

- **General:** Reorganized project and updated some styles <span class="changelog-tag chore">chore</span>

## 2025-10-16

- **Atlas | Export:** Added option to export map as SVG/PNG <span class="changelog-tag feature">feature</span>
- **Atlas | Map:** Updated map UI and styles <span class="changelog-tag chore">chore</span>
- **General:** Added key command shortcuts for better feature <span class="changelog-tag feature">feature</span>
- **Settings:** Added settings for better configuration <span class="changelog-tag feature">feature</span>
- **UI:** Updated UI, toolbars and other components <span class="changelog-tag chore">chore</span>

## 2025-10-08

- **UI:** Various updates to UI, themes, styles, types and some bugfixes <span class="changelog-tag chore">chore</span>

## 2025-10-05

- **UI:** Updated UX <span class="changelog-tag chore">chore</span>

## 2025-10-04

- Initial commit
