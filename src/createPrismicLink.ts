import type { ApolloLink, HttpOptions } from "@apollo/client/core";
import type { FetchLike } from "@prismicio/client";
import { createHttpLink } from "@apollo/client/core";
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
	uri?: string;
	fetch?: FetchLike;
};

export const createPrismicLink = ({
	repositoryName,
	fetch,
	accessToken,
	apiEndpoint: providedApiEndpoint,
	uri: providedURI,
	...options
}: PrismicLinkConfig): ApolloLink => {
	const uri = providedURI || getGraphQLEndpoint(repositoryName);
	const apiEndpoint = providedApiEndpoint || getEndpoint(repositoryName);

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
