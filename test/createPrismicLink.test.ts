import test from "ava";
import {
	ApolloLink,
	execute,
	FetchResult,
	gql,
	GraphQLRequest,
} from "@apollo/client/core";
import { Response } from "node-fetch";
import * as sinon from "sinon";
import * as prismic from "@prismicio/client";
import * as prismicT from "@prismicio/types";

import { createPrismicLink } from "../src";

interface LinkResult<T> {
	result: FetchResult<T>;
}

const executeRequest = <T = unknown>(
	link: ApolloLink,
	request: GraphQLRequest,
) => {
	const linkResult = {} as LinkResult<T>;

	return new Promise<LinkResult<T>>((resolve, reject) => {
		execute(link, request).subscribe(
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

const repositoryResponse: Partial<prismicT.Repository> = {
	refs: [
		{
			ref: "master",
			isMasterRef: true,
			id: "master",
			label: "Master",
		},
	],
};
const ref = repositoryResponse.refs?.[0].ref as string;

test("creates an HTTP Link from a repositoryName", async (t) => {
	const repositoryName = "qwerty";
	const apiEndpoint = prismic.getEndpoint(repositoryName);
	const uri = prismic.getGraphQLEndpoint(repositoryName);

	const query = gql`
		query {
			foo
		}
	`;
	const compressedQuery = `{foo}`;

	const fetch = sinon.stub().callsFake((url) => {
		const instance = new URL(url);

		if (url === apiEndpoint) {
			return new Response(JSON.stringify(repositoryResponse));
		} else if (`${instance.origin}${instance.pathname}` === uri) {
			t.is(instance.searchParams.get("query"), compressedQuery);
			t.is(instance.searchParams.get("ref"), ref);

			return new Response(
				JSON.stringify({
					data: {
						foo: "bar",
					},
				}),
			);
		} else {
			return new Response("{}", { status: 404 });
		}
	});

	const link = createPrismicLink({
		repositoryName,
		fetch,
	});

	await executeRequest(link, { query });

	t.plan(2);
});

test("supports only a uri option", async (t) => {
	const repositoryName = "qwerty";
	const apiEndpoint = prismic.getEndpoint(repositoryName);
	const uri = prismic.getGraphQLEndpoint(repositoryName);

	const query = gql`
		query {
			foo
		}
	`;
	const compressedQuery = `{foo}`;

	const fetch = sinon.stub().callsFake((url) => {
		const instance = new URL(url);

		if (url === apiEndpoint) {
			return new Response(JSON.stringify(repositoryResponse));
		} else if (`${instance.origin}${instance.pathname}` === uri) {
			t.is(instance.searchParams.get("query"), compressedQuery);
			t.is(instance.searchParams.get("ref"), ref);

			return new Response(
				JSON.stringify({
					data: {
						foo: "bar",
					},
				}),
			);
		} else {
			return new Response("{}", { status: 404 });
		}
	});

	const link = createPrismicLink({
		uri,
		fetch,
	});

	await executeRequest(link, { query });

	t.plan(2);
});

test("throws if neither a repositoryName or uri option is given", (t) => {
	t.throws(
		() => {
			createPrismicLink(
				// @ts-expect-error - Purposely leaving off a repositoryName and uri option to throw the runtime error.
				{
					fetch: sinon.stub(),
				},
			);
		},
		{
			message:
				/At least one of the following options are required for createPrismicLink\(\): repositoryName, uri/,
		},
	);
});

test("supports custom API endpoint (for Rest API)", async (t) => {
	const repositoryName = "qwerty";
	const apiEndpoint = "https://example.com/";
	const uri = prismic.getGraphQLEndpoint(repositoryName);

	const query = gql`
		query {
			foo
		}
	`;
	const compressedQuery = `{foo}`;

	const fetch = sinon.stub().callsFake((url) => {
		const instance = new URL(url);

		if (url === apiEndpoint) {
			return new Response(JSON.stringify(repositoryResponse));
		} else if (`${instance.origin}${instance.pathname}` === uri) {
			t.is(instance.searchParams.get("query"), compressedQuery);
			t.is(instance.searchParams.get("ref"), ref);

			return new Response(
				JSON.stringify({
					data: {
						foo: "bar",
					},
				}),
			);
		} else {
			return new Response("{}", { status: 404 });
		}
	});

	const link = createPrismicLink({
		repositoryName,
		apiEndpoint,
		fetch,
	});

	await executeRequest(link, { query });

	t.plan(2);
});

test("supports custom GraphQL endpoint", async (t) => {
	const repositoryName = "qwerty";
	const apiEndpoint = prismic.getEndpoint(repositoryName);
	const uri = "https://example.com/";

	const query = gql`
		query {
			foo
		}
	`;
	const compressedQuery = `{foo}`;

	const fetch = sinon.stub().callsFake((url) => {
		const instance = new URL(url);

		if (url === apiEndpoint) {
			return new Response(JSON.stringify(repositoryResponse));
		} else if (`${instance.origin}${instance.pathname}` === uri) {
			t.is(instance.searchParams.get("query"), compressedQuery);
			t.is(instance.searchParams.get("ref"), ref);

			return new Response(
				JSON.stringify({
					data: {
						foo: "bar",
					},
				}),
			);
		} else {
			return new Response("{}", { status: 404 });
		}
	});

	const link = createPrismicLink({
		repositoryName,
		uri,
		fetch,
	});

	await executeRequest(link, { query });

	t.plan(2);
});
