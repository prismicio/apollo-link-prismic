import type { ApolloLink, HttpOptions } from "@apollo/client/core";
import { FetchLike, getRepositoryName } from "@prismicio/client";
import { createHttpLink } from "@apollo/client/core";
import {
	getRepositoryEndpoint,
	getGraphQLEndpoint,
	createClient,
} from "@prismicio/client";

/**
 * Configuration for `createPrismicLink`.
 */
export type PrismicLinkConfig = Omit<
	HttpOptions,
	"fetch" | "useGETForQueries"
> &
	(
		| {
				/**
				 * The name of the link's Prismic repository.
				 */
				repositoryName: string;

				/**
				 * The GraphQL API endpoint for the link's Prismic repository. If a
				 * value is not given, the link will use the default Prismic GraphQL API
				 * endpoint for the link's Prismic repository using the `repositoryName`
				 * parameter.
				 */
				uri?: string;
		  }
		| {
				/**
				 * The name of the link's Prismic repository.
				 */
				repositoryName?: string;

				/**
				 * The GraphQL API endpoint for the link's Prismic repository. If a
				 * value is not given, the link will use the default Prismic GraphQL API
				 * endpoint for the link's Prismic repository using the `repositoryName`
				 * parameter.
				 */
				uri: string;
		  }
	) & {
		/**
		 * The access token for the link's Prismic repository.
		 */
		accessToken?: string;

		/**
		 * The Rest API endpoint for the link's Prismic repository. If a value is
		 * not given, the link will use the default Prismic Rest API endpoint for
		 * the link's Prismic repository using the `repositoryName` parameter.
		 */
		apiEndpoint?: string;

		/**
		 * The function used to make network requests to the Prismic API. In
		 * environments where a global `fetch` function does not exist, such as
		 * Node.js, this function must be provided.
		 */
		fetch?: FetchLike;
	};

/**
 * Creates an Apollo Link that sends GraphQL queries to a Prismic repository's
 * GraphQL API.
 *
 * @example
 *
 * ```ts
 * import { ApolloClient, InMemoryCache } from "@apollo/client";
 * import { createPrismicLink } from "apollo-link-prismic";
 *
 * const client = new ApolloClient({
 * 	link: createPrismicLink({
 * 		repositoryName: "your-repo-name",
 * 		// Provide an access token if the repository is secured.
 * 		accessToken: "example-access-token",
 * 	}),
 * 	cache: new InMemoryCache(),
 * });
 * ```
 *
 * @param config - Configuration for the Prismic Link.
 *
 * @returns An Apollo Link for the configured Prismic repository's GraphQL API.
 */
export const createPrismicLink = (config: PrismicLinkConfig): ApolloLink => {
	const {
		repositoryName: providedRepositoryName,
		fetch,
		accessToken,
		apiEndpoint: providedApiEndpoint,
		uri: providedURI,
		...options
	} = config;

	let repositoryName = providedRepositoryName;

	if (!repositoryName && providedURI) {
		repositoryName = getRepositoryName(providedURI);
	}

	if (!repositoryName) {
		throw new Error(
			"At least one of the following options are required for createPrismicLink(): repositoryName, uri. If a repositoryName option is not given, the uri option must be a standard, non-proxied Prismic GraphQL API URL including the repository name.",
		);
	}

	const uri = providedURI || getGraphQLEndpoint(repositoryName);
	const apiEndpoint =
		providedApiEndpoint || getRepositoryEndpoint(repositoryName);

	const client = createClient(apiEndpoint, {
		fetch,
		accessToken,
	});

	return createHttpLink({
		uri,
		fetch: client.graphqlFetch,
		useGETForQueries: true,
		...options,
	});
};
