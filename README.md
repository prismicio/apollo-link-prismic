# apollo-link-prismic

## Purpose

An Apollo Link that allow you query Prismic's GraphQL API with [apollo-client](https://www.apollographql.com/client/).

## Installation

```
npm install apollo-link-prismic
```

## Usage

```javascript
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createPrismicLink } from "apollo-link-prismic";

const apolloClient = new ApolloClient({
	link: createPrismicLink({
		repositoryName: "YOUR_REPOSITORY_NAME",
		// Provide your access token if your repository is secured.
		accessToken: "YOUR_ACCESS_TOKEN",
	}),
	cache: new InMemoryCache(),
});
```
