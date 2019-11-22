# apollo-link-prismic

## Purpose
An Apollo Link that allow you query the Prismic GraphQL API with [apollo-client](https://www.apollographql.com/client/).

## Installation
`npm install apollo-link-prismic --save`

## Usage
```js
import { ApolloClient } from 'apollo-client';
import { PrismicLink } from 'apollo-link-prismic';

const apolloClient = new ApolloClient({
  link: PrismicLink({
    uri: "YOUR_GRAPHQL_ENDPOINT",
    accessToken: "YOUR_ACCESS_TOKEN",
  }),
  cache: new InMemoryCache()
});
```

## Usage With Previews
```js
import { ApolloClient } from 'apollo-client';
import { PrismicLink } from 'apollo-link-prismic';

const apolloClient = new ApolloClient({
  link: PrismicLink({
    uri: "YOUR_GRAPHQL_ENDPOINT",
    // In my-project.prismic.io/settings/apps/ you need to create an Access Token for access to master+releases
    accessToken: "YOUR_ACCESS_TOKEN", 
  }),
  cache: new InMemoryCache()
});

const query = "YOUR_GRAPHQL_QUERY";

// In Node/Express get cookies from the request or client side, you can parse document.cookies
const cookies = request.cookies;

const prismicPreviewCookies = cookies['io.prismic.preview'];
const projectCookies = prismicPreviewCookies['my-project.prismic.io'];
const previewRefURL = projectCookies['preview'];

let queryContext;

if (previewRefURL) {
  queryContext = {
    headers: {
      'Prismic-ref': previewRefURL,
    }
  }
}

const response = await apolloClient.query({
  query: query,
  context: queryContext,
});
```
