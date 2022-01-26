import test from "ava";
import {
	ApolloLink,
	execute,
	FetchResult,
	LinkResult,
	gql,
	GraphQLRequest,
	Observable,
} from "@apollo/client/core";
import { Response } from "node-fetch";
import * as sinon from "sinon";
import * as prismic from "@prismicio/client";
import * as prismicT from "@prismicio/types";

import { createPrismicLink } from "../src";

const executeRequest = <T = unknown>(
	link: ApolloLink,
	request: GraphQLRequest,
) => {
	const linkResult = {} as LinkResult<T>;

	return new Promise<LinkResult<T>>((resolve, reject) => {
		const terminatingLink = new ApolloLink((operation) => {
			linkResult.operation = operation;

			return Observable.of({ data: null });
		});

		execute(ApolloLink.from([link, terminatingLink]), request).subscribe(
			(result) => {
				linkResult.result = result as FetchResult<T>;
			},
			(error) => {
				reject(error);
			},
			() => {
				resolve(linkResult);
			},
		);
	});
};

test("creates an HTTP Link", async (t) => {
	const link = createPrismicLink({
		repositoryName: "qwerty",
		fetch: sinon.stub().callsFake((url) => {
			if (
				url === new URL("/api/v2", prismic.getEndpoint("qwerty")).toString()
			) {
				const response: Partial<prismicT.Repository> = {
					refs: [
						{
							ref: "master",
							isMasterRef: true,
							id: "master",
							label: "Master",
						},
					],
				};

				return new Response(JSON.stringify(response));
			} else {
				t.log(url);
			}
		}),
	});

	const query = gql`
		query {
			foo
		}
	`;

	const result = await executeRequest(link, { query });

	t.log(result);
});
