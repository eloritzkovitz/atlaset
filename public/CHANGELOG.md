# Changelog

## 2026-03-15
- **[feature]** **Countries:** Added property search for countries
- **[feature]** **Dashboard | Currencies:** Added a new section for currencies and a currency exchange widget
- **[feature]** **Search:** Currencies are now searchable

## 2026-03-13
- **[feature]** **Countries:** Related countries are now clickable
- **[feature]** **Dashboard | Exploration:** Updated country pages to match the atlas's country details
- **[feature]** **Search:** Regions and subregions are now searchable

## 2026-03-11
- **[feature]** **Search:** Added global search feature

## 2026-03-08
- **[feature]** **Atlas | Countries:** Updated country details to also show relations for a country (dependencies, regions, disputes)

## 2026-03-07
- **[feature]** **Atlas | Visits:** Updated visits display and linked visits with calendar

## 2026-03-04
- **[feature]** **User | Activity:** Redesigned activity log and updated formatting

## 2026-03-01
- **[feature]** **Countries:** Added aliases to some countries
- **[bugfix]** **General:** Fixed some UI bugs

## 2026-02-26

- **[feature]** **Atlas | Saved Maps:** Added thumbnails to saved maps
- **[feature]** **Atlas:** Added additional actions for maps, layers and markers, including duplicate, download and copy link

## 2026-02-25

- **[feature]** **Calendar:** Added calendar feature with events
- **[feature]** **Trips:** Redesigned the trip modal
- **[breaking]** **Trips:** Trip statuses are now managed automatically only; removed the status field from the trip modal
- **[bugfix]** **General:** Fixed a minor bug with draggable modals
- **[bugfix]** **General:** Dropdown selection inputs with multiple selection will no longer overflow the field when more than two items are selected

## 2026-02-21

- **[feature]** **Dashboard:** Added dashboard overview with information summary
- **[feature]** **Dashboard:** Updated dashboard menu and navigation
- **[chore]** **User | Activity:** Moved activity log to dashboard and added another link from the user profile

## 2026-02-17

- **[feature]** **User | Settings:** Added option to delete activities
- **[feature]** **General:** Some modals are now draggable
- **[bugfix]** **General:** Some minor UI fixes and improvements

## 2026-02-13

- **[feature]** **User | Friends:** Added friend actions in the friends panel
- **[feature]** **User | Profile:** Updated user profiles with more information
- **[bugfix]** **General:** Fixed UI responsiveness for small and medium screens

## 2026-02-10

- **[chore]** **General:** Updated confirmation modal titles and content
- **[bugfix]** **User:** Fixed updating visited countries on trip actions

## 2026-02-09

- **[breaking]** **Atlas | Layers:** Removed visited countries layer and all associated logic and moved it into a map setting
- **[chore]** **Atlas | Export:** Changed map export options to reflect the new change (exporting visited countries will generate a layer in the JSON)
- **[feature]** **Atlas | Map:** Added option to create blank saved maps, moved saved maps panel to map toolbar and expanded importing and exporting layers and markers
- **[feature]** **General:** Redesigned panel list item actions as a menu, and added more options
- **[chore]** **General:** Updated map mode management and included timeline mode in the centralized control
- **[chore]** **General:** Renamed LayerMode to ColorMode for better clarity

## 2026-02-07

- **[chore]** **General:** Reduced app bundle size and added script for bunzle analysis

## 2026-02-06

- **[chore]** **Atlas | Map Settings:** Renamed sections in map settings
- **[docs]** **Docs:** Updated docs for map and map settings

## 2026-02-05

- **[feature]** **Atlas | Saved Maps:** Added saving and managing maps, independently from the main map
- **[feature]** **Dashboard | Achievements:** Added tooltips displaying all available tiers to tier chips
- **[docs]** **Docs:** Updated keyboard shortcuts docs

## 2026-02-01

- **[docs]** **Docs:** Added welcome section and updated navigation
- **[chore]** **General:** Improved dynamic page titles

## 2026-01-31

- **[feature]** **Docs:** Added Help panel and Docs page
- **[docs]** **General:** Expanded documentation
- **[chore]** **General:** Updated markdown formatting

## 2026-01-29

- **[chore]** **Countries:** Replaced 3x2 flags with own package and made some improvements
- **[docs]** **General:** Added changelog page
- **[chore]** **General:** Added dynamic page titles
- **[chore]** **UI:** Updated user menu and some layouts
- **[feature]** **User:** Added menu option for bug reporting

## 2026-01-27

- **[feature]** **Dashboard:** Added personal achievements

## 2026-01-16

- **[feature]** **Trips:** Added pagination to the trips table

## 2026-01-15

- **[feature]** **Trips:** Added trip participants, allowing users to share the same trips with family and friends
- **[breaking]** **Trips:** Removed support for trips in guest mode
- **[bugfix]** **UI:** Some UI updates and fixes

## 2026-01-12

- **[feature]** **Atlas | Countries:** Updated sort button and menu
- **[feature]** **Countries:** Added new toggle for sovereign countries
- **[bugfix]** **General:** Fixed some bugs

## 2026-01-11

- **[feature]** **Atlas | Export:** Added an option to embed maps with an HTML iframe
- **[chore]** **UI:** Updated some layouts to be more flexible

## 2026-01-09

- **[feature]** **Atlas | Export:** Expanded map export to allow sharing maps via an encoded URL
- **[feature]** **Atlas | Export:** Added download data as JSON option
- **[feature]** **Atlas | Map:** Updated UI to show interactive elements and data based on map mode

## 2026-01-08

- **[chore]** **Atlas | Map:** Replaced use of react-simple-maps with updated and improved components for better control and maintainability
- **[chore]** **Atlas | Map:** Centralized map state management
- **[bugfix]** **Atlas | Map:** Some other map fixes

## 2026-01-06

- **[feature]** **General:** Added a new homepage
- **[feature]** **General:** Added a new about page
- **[chore]** **UI:** Updated layouts for some pages

## 2026-01-05

- **[chore]** **Atlas:** Reorganized some UI components and layouts in the atlas page
- **[chore]** **General:** Moved auth and settings management to Redux
- **[feature]** **UI:** Updated loading spinners and error messages across pages

## 2026-01-02

- **[feature]** **General:** Added audio and animation effects in various places
- **[chore]** **General:** Redesigned tooltips and removed some unnecessary ones
- **[chore]** **General:** Updated all static data fetching to be prebuilt and not cached
- **[chore]** **Quizzes:** Renamed games to quizzes
- **[feature]** **Quizzes:** Redesigned quizzes to allow types, modes and difficulties, and updated logic accordingly
- **[feature]** **Quizzes:** Added leaderboards to show 25 best results for each category

## 2025-12-28

- **[bugfix]** **Atlas | Filters:** Fixed default selection for core filters
- **[feature]** **Atlas | Layers:** Updated layers to support custom filter labels

## 2025-12-27

- **[feature]** **Atlas | UI** Redesigned map legend
- **[chore]** **General:** Updated service structures to be consistent
- **[feature]** **User | Friends:** Users can now add and manage friends
- **[chore]** **User | Activity:** Updated activity actions to be based on a number value

## 2025-12-23

- **[feature]** **User | Profile:** User profiles are now public, accessible through dynamic routes
- **[feature]** **User | Profile:** Added various profile display fields
- **[feature]** **User | Profile:** Home country and visited countries are now stored in the user profile and in the case of the latter synced automatically

## 2025-12-22

- **[bugfix]** **UI:** Fixed a bug with pagination
- **[chore]** **Countries:** Improved text and flag alignment in the display
- **[feature]** **Countries:** Added new options to filter countries in the display by region and subregion

## 2025-12-21

- **[chore]** **General:** Added CI workflow on every push and PR
- **[chore]** **General:** Updated some types, contexts, providers and hooks to satisfy linting rules

## 2025-12-20

- **[chore]** **Settings:** Reorganized settings into groups
- **[feature]** **Settings:** Moved settings to a dedicated settings page
- **[feature]** **Settings:** Moved account activity and security to settings
- **[feature]** **Settings:** Added account management actions for deactivation and deletion

## 2025-12-18

- **[security]** **General:** Removed committed .env files and moved values to the gitignored .env
- **[security]** **General:** Added app check handling in production and Firestore rules
- **[chore]** **General:** Added local data caching for static data to reduce API calls and cold loading
- **[bugfix]** **General:** Fixed some bugs
- **[chore]** **UI:** Updated layout to be responsive
- **[feature]** **UI:** Added drawer panels and swipe navigation for mobile screens

## 2025-12-17

- **[chore]** **General:** Deployed application

## 2025-12-16

- **[feature]** **Trips:** Trips can now be added without dates, if the "tentative dates" checkbox is selected
- **[feature]** **Visits:** Updated visit logic to show visits chronologically and grouped by categories (past visits, upcoming, planned)
- **[feature]** **General:** Added a not found page

## 2025-12-15

- **[chore]** **UI:** Replaced color classes with defined theme colors
- **[chore]** **UI:** Improved styling for menus, dropdowns, inputs and other elements
- **[feature]** **UI:** Dark theme will now be the default theme

## 2025-12-10

- **[feature]** **Trips:** Added the option to rate and favorite trips
- **[feature]** **Trips:** Updated the trips table to use pagination and infinite scrolling

## 2025-12-09

- **[feature]** **General:** Implemented pagination for loading lists
- **[bugfix]** **General:** Fixed some bugs
- **[feature]** **User | Profile:** Added user profile page
- **[feature]** **User | Profile:** Added logging and displaying actions in the profile page
- **[feature]** **User | Profile:** Added a security section showing some information

## 2025-12-07

- **[feature]** **Dashboard:** Added dashboard feature, showing statistics and information
- **[chore]** **Dashboard:** Moved the old trips statistics from trips to the dashboard
- **[feature]** **General:** Added Electron desktop wrapper for cross-platform support
- **[feature]** **User | Auth:** Implemented UI for login and signup to allow authentication with email/password in addition to Google sign-in
- **[feature]** **User | Auth:** Added password reset and session persistence support

## 2025-12-02

- **[chore]** **UI:** Redesigned the main layout
- **[feature]** **UI:** Updated menu to a sidebar menu, available across all pages
- **[bugfix]** **UI:** Fixed some panel and menu bugs

## 2025-12-01

- **[feature]** **User | Auth:** Connected app with Firebase Authentication and Firestore to support user authentication and data persistence
- **[feature]** **User | Auth:** IndexedDB now works for guest sessions
- **[feature]** **User | Auth:** Upon login, current guest session data will be merged with the account's data

## 2025-11-29

- **[feature]** **Atlas | Timeline:** Updated timeline mode with new features: play/pause controls, a timeline bar with years and visited countries, timeline filters
- **[feature]** **Atlas | Timeline:** Visited countries will now be highlighted on the map and in the country list when moving between years
- **[feature]** **General:** Improved keyboard focus support for accessibility
- **[feature]** **Settings:** Updated settings to allow coloring home country and grouped color palettes

## 2025-11-18

- **[feature]** **Atlas | Timeline:** Timeline mode can now be navigated with arrow keys
- **[feature]** **Atlas | Timeline:** Added an additional yearly mode
- **[feature]** **Settings:** Added color settings for overlays and timeline modes, which can be chosen from the settings

## 2025-11-16

- **[chore]** **UI:** Some UI updates

## 2025-11-15

- **[feature]** **Atlas | Countries:** Added visit status badge next to countries in the details modal
- **[feature]** **Atlas | Export:** Expanded map export formats to include JPEG and WebP as well
- **[feature]** **Atlas | Timeline:** Improved timeline mode to color countries by visit count
- **[test]** **Test:** Added Vitest unit tests for shared and feature hooks and utilities
- **[test]** **Test:** Added Cypress E2E tests for various main flows
- **[test]** **Test:** Improved component testability

## 2025-11-06

- **[feature]** **General:** Implemented PWA support

## 2025-11-05

- **[chore]** **General:** Moved data logic to services

## 2025-11-04

- **[feature]** **UI:** Added branding

## 2025-11-01

- **[feature]** **Trips:** Added trip management
- **[chore]** **General:** Switched data persistence from LocalStorage to IndexedDB
- **[chore]** **General:** Various other updates to components, hooks and other shared files

## 2025-10-22

- **[feature]** **Atlas | Countries:** Non-sovereign countries will now show their sovereign/claimant
- **[chore]** **General:** Reorganized and improved components, utility functions and style classes
- **[bugfix]** **UI:** Fixed some UI bugs

## 2025-10-19

- **[feature]** **Atlas | Markers:** Added map markers

## 2025-10-18

- **[feature]** **Atlas | Layers:** Layers can now be reordered by dragging them
- **[feature]** **General:** Modals in the toolbar will now close when clicking outside the modal area
- **[bugfix]** **General:** Fixed some other minor bugs

## 2025-10-17

- **[chore]** **General:** Reorganized project and updated some styles

## 2025-10-16

- **[feature]** **Atlas | Export:** Added option to export map as SVG/PNG
- **[chore]** **Atlas | Map:** Updated map UI and styles
- **[feature]** **General:** Added key command shortcuts for better feature
- **[feature]** **Settings:** Added settings for better configuration
- **[chore]** **UI:** Updated UI, toolbars and other components

## 2025-10-08

- **[chore]** **UI:** Various updates to UI, themes, styles, types and some bugfixes

## 2025-10-05

- **[chore]** **UI:** Updated UX

## 2025-10-04

- Initial commit
