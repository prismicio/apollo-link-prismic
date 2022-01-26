import type { ApolloLink, HttpOptions } from "@apollo/client/core";
import { createHttpLink } from "@apollo/client/core";
import type { FetchLike } from "@prismicio/client";
import {
	getEndpoint,
	getGraphQLEndpoint,
	createClient,
} from "@prismicio/client";

export type PrismicLinkConfig = Omit<
	HttpOptions,
	"fetch" | "useGETForQueries"
> & {
	repositoryName: string;
	accessToken?: string;
	apiEndpoint?: string;
	graphQLEndpoint?: string;
	fetch?: FetchLike;
};

export const createPrismicLink = ({
	repositoryName,
	fetch,
	accessToken,
	apiEndpoint: providedApiEndpoint,
	graphQLEndpoint: providedGraphQLEndpoint,
	...options
}: PrismicLinkConfig): ApolloLink => {
	const apiEndpoint = providedApiEndpoint || getEndpoint(repositoryName);
	const graphQLEndpoint =
		providedGraphQLEndpoint || getGraphQLEndpoint(repositoryName);

	const client = createClient(apiEndpoint, {
		fetch,
		accessToken,
	});

	return createHttpLink({
		uri: graphQLEndpoint,
		fetch: client.graphqlFetch,
		useGETForQueries: true,
		...options,
	});
};
