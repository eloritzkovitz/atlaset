# Trip destinations

Trips can include specific **destinations** in addition to their selected countries, allowing you to track your visited locations in a detailed and interactive way.

Destinations rely on the [GeoNames API](https://www.geonames.org/).

## Selecting destinations

- Open the **Destinations** tab when creating or editing a trip.
- Search for **locations** within the trip's selected countries.
- A trip stores selected locations by their **GeoNames IDs** in `locationIds`.
- Countries and locations are managed separately, so adding a location does not automatically add its country to the trip.

## Viewing destinations

On the trip details page, locations are grouped by country and administrative region. Locations without an administrative region are listed directly under their country.

The destinations list and map are connected:

- Select a **location** from the list to highlight its **marker** on the map.
- Select a **map marker** to highlight the corresponding **location** in the list.
