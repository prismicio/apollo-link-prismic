import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import Prismic from 'prismic-javascript';

export function PrismicLink({uri, accessToken}) {
  const BaseURIReg = /^(https?:\/\/.+?\..+?\..+?)\/graphql\/?$/;
  const matches = uri.match(BaseURIReg);
  if (matches && matches[1]) {
    const [_, baseURI] = matches;
    const prismicClient = Prismic.client(`${baseURI}/api`, { accessToken });
    const prismicLink = setContext(
      (request, options) => {
        return prismicClient.getApi().then((api) => {
          const authorizationHeader = accessToken ? { Authorization: `Token ${accessToken}` } : {};
          return {
            headers: {
              ...options.headers,
              ...authorizationHeader,
              'Prismic-ref': api.masterRef.ref,
            }
          }
        })
      }
    );

    const httpLink = new HttpLink({
      uri,
      useGETForQueries: true,
    });

    return prismicLink.concat(httpLink);
  } else {
    throw new Error(`${uri} isn't a valid Prismic GraphQL endpoint`)
  }
}

export default {
  PrismicLink,
}
