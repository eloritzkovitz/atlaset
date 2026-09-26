# Migrating guest data

Atlaset supports **guest mode** on the Atlas page, allowing you to use certain features without creating an account. Guest data is stored locally on your device.

When you create an account or sign in while local guest data is present, you will be given a prompt asking you whether you'd like to import the data to your account.

## What can be migrated?

The following local data can be migrated to your account:

| Data              | Description                                                                        |
| ----------------- | ---------------------------------------------------------------------------------- |
| **Country lists** | Custom country lists created while using guest mode.                               |
| **Layers**        | Custom map layers created while using guest mode.                                  |
| **Markers**       | Custom map markers created while using guest mode.                                 |
| **Settings**      | Your local Atlaset settings, if your account does not already have saved settings. |

> <icon name="info"></icon> **Note**
>
> Your account's existing settings are preserved and will not be overwritten. Local settings are only saved to the account when no account settings already exist.

## When migration is offered

After you sign in or create an account, Atlaset checks whether local guest data is available.

If local data is found, you will be prompted to choose what to do:

- **Migrate**: Transfer your supported guest data to your account.
- **Discard**: Permanently remove the local guest data instead.

If no local data is found, no migration prompt is shown.

## After migration

Once migration is completed, any local data that was migrated is removed, and will be associated with your Atlaset account.

## If you choose to discard your data

Choosing **Discard** permanently removes the available local guest data from the device.

> <icon name="warning"></icon> **Warning**
>
> **Discarding local data will permanently remove it from your local storage. This action cannot be reversed. Make sure you export any data that you want to keep if you choose to not migrate it.**

## Important

Guest data is stored locally on the device where it was created. If you use Atlaset as a guest on another device, that device has its own local data.

Creating an account allows your supported data to be associated with your account rather than remaining only in local guest storage.

## Further reading

- [Creating an account](/docs/getstarted/creating-an-account)
- [Exporting map data](/docs/atlas/layers-markers#importingexporting-map-data)
