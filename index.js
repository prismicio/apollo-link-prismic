import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import Prismic from 'prismic-javascript';

const PRISMIC_ENDPOINT_REG = /^https?:\/\/([^.]+)\.(?:cdn.)?prismic.io\/graphql\/?/;

function parseURI(endpointGraphQL) {
  const tokens = endpointGraphQL.match(PRISMIC_ENDPOINT_REG);

  if (tokens !== null && Array.isArray(tokens) && tokens.length === 2) {
    const [/* endpoint */, repository] = tokens;

    return {
      isFromPrismicApi: true,
      repository
    };
  }

  return {
    isFromPrismicApi: false,
    endpointGraphQL
  };
}

export function PrismicLink({ uri, accessToken, repositoryName }) {
  const {
    isFromPrismicApi,
    endpointGraphQL,
    repository
  } = parseURI(uri);

  if (!isFromPrismicApi && !repositoryName) {
    throw Error('Since you are using a custom GraphQL endpoint, you need to provide to PrismicLink your repository name as shown below:\n' +
      'PrismicLink({\n' +
      '  uri: \'https://mycustomdomain.com/graphql\',\n' +
      '  accessToken: \'my_access_token\', // could be undefined\n' +
      '  repositoryName: \'my-prismic-repository\'\n' +
      '})\n'
    );
  }

  const prismicClient = Prismic.client(`https://${isFromPrismicApi ? repository : repositoryName}.cdn.prismic.io/api`, { accessToken })

  const prismicLink = setContext(
    (request, options) => {
      return prismicClient
        .getApi()
        .then(
          (api) => ({
            headers: {
              'Prismic-ref': api.masterRef.ref,
              ...options.headers,
              ...(accessToken ? { Authorization: `Token ${accessToken}` } : {})
            }
          })
        );
    });

  const httpLink = new HttpLink({
    uri: isFromPrismicApi ? `https://${repository}.cdn.prismic.io/graphql` : endpointGraphQL,
    useGETForQueries: true
  });

  return prismicLink.concat(httpLink);
}

export default {
  PrismicLink
};
