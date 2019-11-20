import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import Prismic from 'prismic-javascript';

const PRISMIC_ENDPOINT_REG = /^https?:\/\/([^.]+)\.(?:cdn\.)?(wroom\.(?:test|io)|prismic\.io)\/graphql\/?/;
//                                        ^                  ^
//                                        1                  2

function parsePrismicEndpoint(endpoint) {
  const tokens = endpoint.match(PRISMIC_ENDPOINT_REG);

  if (tokens !== null && Array.isArray(tokens) && tokens.length === 3) {
    const [/* endpoint */, repository, domain] = tokens;

    return `https://${repository}.cdn.${domain}`; // enforce the cdn
  }

  return null; // not from prismic ? returns null.
}

export function PrismicLink({ uri, accessToken, repositoryName }) {

  const prismicEndpoint = parsePrismicEndpoint(uri); // enforce cdn if it's the prismic endpoint

  if (prismicEndpoint && repositoryName) {
    console.warn('\`repositoryName\` is ignored since the graphql endpoint is valid.');
  }

  if (!prismicEndpoint && !repositoryName) {
    throw Error('Since you are using a custom GraphQL endpoint, you need to provide to PrismicLink your repository name as shown below:\n' +
      'PrismicLink({\n' +
      '  uri: \'https://mycustomdomain.com/graphql\',\n' +
      '  accessToken: \'my_access_token\', // could be undefined\n' +
      '  repositoryName: \'my-prismic-repository\'\n' +
      '})\n'
    );
  }

  let apiEndpoint;
  let gqlEndpoint;

  if (prismicEndpoint) {
    apiEndpoint = `${prismicEndpoint}/api`;
    gqlEndpoint = `${prismicEndpoint}/graphql`;
  } else {
    apiEndpoint = `https://${repositoryName}.cdn.prismic.io/api`;
    gqlEndpoint = uri;
  }

  const prismicClient = Prismic.client(apiEndpoint, { accessToken });

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
    uri: gqlEndpoint,
    useGETForQueries: true
  });

  return prismicLink.concat(httpLink);
}

export default {
  PrismicLink
};
