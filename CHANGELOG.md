# Changelog

## 2026-01-29

- Replaced 3x2 flags with own package and made some improvements
- Added menu option for bug reporting
- Added changelog page
- Some other minor fixes

## 2026-01-27

- Added personal achievements

## 2026-01-16

- Added pagination to the trips table

## 2026-01-15

- Added trip participants, allowing users to share the same trips with family and friends
- Removed support for trips in guest mode
- Some UI updates and fixes

## 2026-01-12

- Added new toggle for sovereign countries
- Updated sort button and menu
- Fixed some bugs

## 2026-01-11

- Added an option to embed maps with an HTML iframe
- Updated some layouts to be more flexible

## 2026-01-09

- Expanded map export to allow sharing maps via an encoded URL
- Added download data as JSON option
- Updated UI to show interactive elements and data based on map mode

## 2026-01-08

- Replaced use of react-simple-maps with updated and improved components for better control and maintainability
- Centralized map state management
- Some other map fixes

## 2026-01-06

- Added a new homepage
- Added a new about page
- Updated layouts for some pages

## 2026-01-05

- Moved auth and settings management to Redux
- Updated loading spinners and error messages across pages
- Reorganized some UI components and layouts in the atlas page

## 2026-01-02

- Renamed games to quizzes
- Redesigned quizzes to allow types, modes and difficulties, and updated logic accordingly
- Added leaderboards to show 25 best results for each category
- Added audio and animation effects in various places
- Redesigned tooltips and removed some unnecessary ones
- Updated all static data fetching to be prebuilt and not cached

## 2025-12-28

- Fixed default selection for core filters
- Updated overlays to support custom filter labels

## 2025-12-27

- Users can now add and manage friends
- Updated activity actions to be based on a number value
- Updated service structures to be consistent
- Redesigned map legend

## 2025-12-23

- User profiles are now public, accessible through dynamic routes
- Added various profile display fields
- Home country and visited countries are now stored in the user profile and in the case of the latter synced automatically

## 2025-12-22

- Fixed a bug with pagination
- Improved text and flag alignment in the display
- Added new options to filter countries in the display by region and subregion

## 2025-12-21

- Added CI workflow on every push and PR
- Updated some types, contexts, providers and hooks to satisfy linting rules

## 2025-12-20

- Reorganized settings into groups
- Moved settings to a dedicated settings page
- Moved account activity and security to settings
- Added account management actions for deactivation and deletion

## 2025-12-18

- Updated layout to be responsive
- Added drawer panels and swipe navigation for mobile screens
- Removed committed .env files and moved values to the gitignored .env
- Added app check handling in production and Firestore rules
- Added local data caching for static data to reduce API calls and cold loading
- Fixed some bugs

## 2025-12-17

- Deployed application

## 2025-12-16

- Trips can now be added without dates, if the "tentative dates" checkbox is selected
- Updated visit logic to show visits chronologically and grouped by categories (past visits, upcoming, planned)
- Added a not found page

## 2025-12-15

- Replaced color classes with defined theme colors
- Improved styling for menus, dropdowns, inputs and other elements
- Dark theme will now be the default theme

## 2025-12-10

- Added the option to rate and favorite trips
- Updated the trips table to use pagination and infinite scrolling

## 2025-12-09

- Added user profile page
- Added logging and displaying actions in the profile page
- Added a security section showing some information
- Implemented pagination for loading lists
- Fixed some bugs

## 2025-12-07

- Added dashboard feature, showing statistics and information
- Moved the old trips statistics from trips to the dashboard
- Added Electron desktop wrapper for cross-platform support
- Implemented UI for login and signup to allow authentication with email/password in addition to Google sign-in
- Added password reset and session persistence support

## 2025-12-02

- Redesigned the main layout
- Updated menu to a sidebar menu, available across all pages
- Fixed some panel and menu bugs

## 2025-12-01

- Connected app with Firebase Authentication and Firestore to support user authentication and data persistence
- IndexedDB now works for guest sessions
- Upon login, current guest session data will be merged with the account's data

## 2025-11-29

- Updated timeline mode with new features: play/pause controls, a timeline bar with years and visited countries, timeline filters
- Visited countries will now be highlighted on the map and in the country list when moving between years
- Updated settings to allow coloring home country and grouped color palettes
- Improved keyboard focus support for accessibility

## 2025-11-18

- Timeline mode can now be navigated with arrow keys
- Added an additional yearly mode
- Added color settings for overlays and timeline modes, which can be chosen from the settings

## 2025-11-16

- Some UI updates

## 2025-11-15

- Added Vitest unit tests for shared and feature hooks and utilities
- Added Cypress E2E tests for various main flows
- Improved component testability
- Added visit status badge next to countries in the details modal
- Improved timeline mode to color countries by visit count
- Expanded map export formats to include JPEG and WebP as well

## 2025-11-06

- Implemented PWA support

## 2025-11-05

- Moved data logic to services

## 2025-11-04

- Added branding

## 2025-11-01

- Added trip management
- Switched data persistence from LocalStorage to IndexedDB
- Various other updates to components, hooks and other shared files

## 2025-10-22

- Non-sovereign countries will now show their sovereign/claimant
- Fixed some UI bugs
- Reorganized and improved components, utility functions and style classes

## 2025-10-19

- Added map markers

## 2025-10-18

- Layers can now be reordered by dragging them
- Modals in the toolbar will now close when clicking outside the modal area
- Fixed some other minor bugs

## 2025-10-17

- Reorganized project and updated some styles

## 2025-10-16

- Updated map UI and styles
- Updated UI, toolbars and other components
- Added option to export map as SVG/PNG
- Added settings for better configuration
- Added key command shortcuts for better accessibility

## 2025-10-08

- Various updates to UI, themes, styles, types and some bugfixes

## 2025-10-05

- Updated UX

## 2025-10-04

- Initial commit
