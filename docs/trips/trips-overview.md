# Trips overview

In Atlaset, **trips** let you record, organize and analyze your travels. Each trip can include multiple destinations, itineraries, participants categories, tags, photos and notes.

Trip data powers many features - including **visited countries**, **timeline navigation**, **statistics** and **calendar events**.

## Key features

| Feature             | Description                                                                                          |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| **Trip management** | View, filter and organize your trips from a paginated table, including your own and shared trips.    |
| **Trip editor**     | Create and edit trips with destinations, dates, categories, tags, participants and notes.            |
| **Trip details**    | View a trip's destinations, itinerary, map, photos, participants and other information in one place. |
| **Trip sharing**    | Share trips with other users and manage shared-trip access.                                          |
| **Import & export** | Import and export trips using JSON or CSV files.                                                     |
| **Calendar**        | View your trips alongside your calendar events.                                                      |

## How trips are used

| Feature                                                      | Usage                                                        |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [**Visited Countries**](/docs/trips/tracking-your-visits.md) | Trip data is used to determine your visited countries.       |
| [**Timeline**](/docs/atlas/timeline.md)                      | Timeline data is based on your trip and visit history.       |
| [**Statistics**](/docs/dashboard/statistics.md)              | Trip data is used to calculate travel statistics and trends. |
| [**Calendar**](/docs/trips/calendar.md)                      | Trips are displayed as events in the calendar                |

Changes to your trips are automatically reflected in the relevant features.

## Trip fields

| Field            | Type             | Description                                            |
| ---------------- | ---------------- | ------------------------------------------------------ |
| `id`\*           | `string`         | Unique identifier for the trip.                        |
| `name`\*         | `string`         | Name of the trip.                                      |
| `description`    | `string`         | Detailed description of the trip.                      |
| `favorite`       | `boolean`        | Whether the trip is marked as a favorite.              |
| `rating`         | `number \| null` | User rating for the trip, from 1 to 5 stars.           |
| `countryCodes`\* | `string[]`       | ISO 3166-1 country codes associated with the trip.     |
| `locationIds`    | `number[]`       | GeoNames IDs of locations associated with the trip.    |
| `startDate`      | `string`         | Start date of the trip in ISO 8601 format.             |
| `endDate`        | `string`         | End date of the trip in ISO 8601 format.               |
| `fullDays`       | `number`         | Number of full calendar days spent at the destination. |
| `participants`   | `string[]`       | UIDs of participants in the trip.                      |
| `sharedWith`     | `string[]`       | UIDs of users with whom the trip is shared.            |
| `categories`     | `TripCategory[]` | Categories associated with the trip.                   |
| `status`         | `TripStatus`     | Current status of the trip.                            |
| `tags`           | `TripTag[]`      | Tags associated with the trip.                         |
| `notes`          | `string`         | Additional notes about the trip.                       |
| `photos`         | `TripPhoto[]`    | Photos associated with the trip.                       |
| `photoAlbumUrl`  | `string`         | URL of an external photo album for the trip.           |
| `googleMapsUrl`  | `string`         | URL of a Google Maps link for the trip.                |

`*` Required field.

> <icon name="info"></icon> **Note**
>
> A trip must either have `startDate` and `endDate` or be marked as **Tentative** to be valid.

## Next steps

- [Creating and managing trips](/docs/trips/creating-managing-trips.md)
- [Viewing trip details](/docs/trips/viewing-trip-details.md)
- [Trip destinations](/docs/trips/destinations.md)
- [Trip gallery](/docs/trips/gallery.md)
- [Sharing trips](/docs/trips/sharing-trips.md)
