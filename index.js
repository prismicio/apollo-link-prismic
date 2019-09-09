import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import Prismic from 'prismic-javascript';

const PRISMIC_ENDPOINT_REG = /^(https?):\/\/([^.]+)\.(cdn.)?([^.]+\.[^.]+)\/graphql\/?$/;

function parseURI(endpoint) {
  const [, protocol, repository, cdn, domain] = endpoint.match(PRISMIC_ENDPOINT_REG);

  if (protocol && repository && domain) {
    return {
      protocol,
      repository,
      domain,
    };
  }

  return null;
}

export function PrismicLink({uri, accessToken}) {
  const parsedURI = parseURI(uri);

  if (parseURI) {
    const { protocol, repository, domain } = parsedURI;
    const baseURI = `${protocol}://${repository}.cdn.${domain}`;
    const prismicClient = Prismic.client(`${baseURI}/api`, { accessToken });
    const prismicLink = setContext(
      (request, options) => {
        return prismicClient.getApi().then((api) => {
          const authorizationHeader = accessToken ? { Authorization: `Token ${accessToken}` } : {};
          return {
            headers: {
              'Prismic-ref': api.masterRef.ref,
              ...options.headers,
              ...authorizationHeader
            }
          };
        });
      }
    );

    const httpLink = new HttpLink({
      uri: `${baseURI}/graphql`,
      useGETForQueries: true,
    });

    return prismicLink.concat(httpLink);
  } else {
    throw new Error(`${uri} isn't a valid Prismic GraphQL endpoint`);
  }
}

export default {
  PrismicLink,
};
