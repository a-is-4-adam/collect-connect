# Welcome to Collect Connect!

## Features

## V0.1

- Users can sign in using username and password
- Users can sign out
- Users can sign up
- Authenticated users can set a contact link
- Authenticated users can add a card from the Pokemon base set to their library
  - and specify the condition and price of their cards
  - mark which cards in their library they want to sell
- Authenticated users can add a max of 10 cards
- Unauthenticated users can view all cards that are marked as sold
- Unauthenticated users can search a card by name
- Authenticated users can view the contact link of a user selling a card

## V1

- Turn email confirmation back on
- Users can sign in with Facebook SSO
- Authenticated users can add a photo of their cards to the library
- Authenticated users can pay to add unlimited cards to their library

## v1.XX

- Users can edit cards in their library
- Add cache headers for different pages to speed up results

## Database schema

Only need Users, UserItem, Item for < V1. Other tables can be added later on

- Users
  - Contact link
- UserItem
  - itemId string
  - tags json
    - price
    - quality
    - categoryId
- Item
  - Name string
  - tags json
    - categoryId
- Category
  - Name string
  - tags json
    - imageUrl
    - total items
    - brandId
    - etc ...
- Brand
  - Name string
  - tags json
    - imageUrl
    - description
    - etc ...

# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Development

From your terminal:

```sh
bun run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
bun run build
```

Then run the app in production mode:

```sh
bun run start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`
