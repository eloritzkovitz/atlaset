# Sharing Trips

Atlaset allows `trips` to be shared with other users. Whether participants, collaborators or just friends looking for inspiration, sharing provides controlled access to a trip without creating duplicate copies of the trip data.

A shared trip can be either a **participant trip**, where the recipient is associated with the trip and can customize personal values, or a regular **shared trip**, where the recipient only receives access according to their assigned permission.

## Sharing a trip

A `trip` can be shared with another user by granting the person **access permissions** through the trip editor's `People` tab.

From there, you can control the `sharing type` and the user's `permissions`.

## Ownership & Permissions

Every trip has a single owner, to which the trip object belongs to.

The owner has full control over the trip, including:

- Editing the trip
- Managing participants
- Managing people the trip is shared with
- Changing sharing permissions
- Removing access
- Deleting the trip

The owner is represented by the `ownerUid` stored in a shared trip reference.

## Shared trips

- By default, any user granted access to your trip will have the `shared` sharing type.
- Shared trips will show on the `Shared with Me` tab, independently of the user's trips.
- If given `editor` permissions, the user can edit the trip and collaborate with the trip's owner. Otherwise, it will be readonly.
- Shared trips can be copied, in which a brand new trip will be added to the user's list, unrelated to the shared one.

## Participants

- `Participant` is a sharing type representing other people who also took part in the trip.
- Trips where a user is considered a participant will show on the `My Trips` list, along with the user's own trips.
- Shared trips will have an icon which represent the fact that they are shared and not owned.
- The trip owner is automatically considered a participant when a trip is created.

### Customizing trips

`Participants` can customize various trip fields independently of the owner's data. These customizations are stored as **overrides** on the participant's shared trip reference.

Currently, the following fields are customizable:

- `countryCodes`
- `locationIds`
- `startDate`
- `endDate`
- `fullDays`
- `rating`
- `favorite`
