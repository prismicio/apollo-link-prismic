# apollo-link-prismic

## Purpose
An Apollo Link that allow you query the Prismic GraphQL API with [apollo-client](https://www.apollographql.com/client/).

## Installation
`npm install apollo-link-prismic --save`

## Usage
```js
import { PrismicLink } from 'apollo-link-prismic';

const apolloClient = new ApolloClient({
  link: PrismicLink({
    uri: "YOUR_GRAPHQL_ENDPOINT",
    accessToken: "YOUR_ACCESS_TOKEN",
  }),
  cache: new InMemoryCache()
});
```
