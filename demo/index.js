const apolloboost = require('apollo-boost');
const apolloLinkPrismic = require('../dist/apollo-link-prismic.min.js');
const apolloCacheInMemory = require('apollo-cache-inmemory');
const gql = require('graphql-tag');

const apolloClient = new apolloboost.ApolloClient({
  link: apolloLinkPrismic.PrismicLink({
    uri: "https://srenault.prismic.io/graphql",
  }),
  cache: new apolloCacheInMemory.InMemoryCache(),
});


apolloClient.query({
  query: gql`
{
  _allDocuments {
    edges {
      node {
        _meta {
          id
        }
      }
    }
  }
}
  `,
}).then(console.log);
