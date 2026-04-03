import {
	ApolloLink,
	execute,
	type FetchResult,
	gql,
	type GraphQLRequest,
} from "@apollo/client/core"
import type { Repository } from "@prismicio/client"
import * as prismic from "@prismicio/client"
import { expect, it, vi } from "vitest"

import { createPrismicLink } from "../src"

interface LinkResult<T> {
	result: FetchResult<T>
}

const executeRequest = <T = unknown>(
	link: ApolloLink,
	request: GraphQLRequest,
): Promise<LinkResult<T>> => {
	const linkResult = {} as LinkResult<T>

	return new Promise<LinkResult<T>>((resolve, reject) => {
		execute(link, request).subscribe(
			(result) => {
				linkResult.result = result as FetchResult<T>
			},
			(error) => {
				reject(error)
			},
			() => {
				resolve(linkResult)
			},
		)
	})
}

const repositoryResponse: Partial<Repository> = {
	refs: [
		{
			ref: "master",
			isMasterRef: true,
			id: "master",
			label: "Master",
		},
	],
}
const ref = repositoryResponse.refs?.[0].ref as string

it("creates an HTTP Link from a repositoryName", async () => {
	expect.assertions(2)

	const repositoryName = "qwerty"
	const apiEndpoint = prismic.getRepositoryEndpoint(repositoryName)
	const uri = prismic.getGraphQLEndpoint(repositoryName)

	const query = gql`
		query {
			foo
		}
	`
	const compressedQuery = `{foo}`

	const fetch = vi.fn().mockImplementation(async (url: string) => {
		const instance = new URL(url)

		if (url === apiEndpoint) {
			return new Response(JSON.stringify(repositoryResponse))
		} else if (`${instance.origin}${instance.pathname}` === uri) {
			expect(instance.searchParams.get("query")).toBe(compressedQuery)
			expect(instance.searchParams.get("ref")).toBe(ref)

			return new Response(
				JSON.stringify({
					data: {
						foo: "bar",
					},
				}),
			)
		} else {
			return new Response("{}", { status: 404 })
		}
	})

	const link = createPrismicLink({
		repositoryName,
		fetch,
	})

	await executeRequest(link, { query })
})

it("supports only a uri option", async () => {
	expect.assertions(2)

	const repositoryName = "qwerty"
	const apiEndpoint = prismic.getRepositoryEndpoint(repositoryName)
	const uri = prismic.getGraphQLEndpoint(repositoryName)

	const query = gql`
		query {
			foo
		}
	`
	const compressedQuery = `{foo}`

	const fetch = vi.fn().mockImplementation(async (url: string) => {
		const instance = new URL(url)

		if (url === apiEndpoint) {
			return new Response(JSON.stringify(repositoryResponse))
		} else if (`${instance.origin}${instance.pathname}` === uri) {
			expect(instance.searchParams.get("query")).toBe(compressedQuery)
			expect(instance.searchParams.get("ref")).toBe(ref)

			return new Response(
				JSON.stringify({
					data: {
						foo: "bar",
					},
				}),
			)
		} else {
			return new Response("{}", { status: 404 })
		}
	})

	const link = createPrismicLink({
		uri,
		fetch,
	})

	await executeRequest(link, { query })
})

it("throws if neither a repositoryName or uri option is given", () => {
	expect(() => {
		createPrismicLink(
			// oxlint-disable-next-line typescript/ban-ts-comment
			// @ts-expect-error - Purposely leaving off a repositoryName and uri option to throw the runtime error.
			{
				fetch: vi.fn(),
			},
		)
	}).toThrow(
		/At least one of the following options are required for createPrismicLink\(\): repositoryName, uri/,
	)
})

it("supports custom API endpoint (for Rest API)", async () => {
	expect.assertions(2)

	const repositoryName = "qwerty"
	const apiEndpoint = "https://example.com/"
	const uri = prismic.getGraphQLEndpoint(repositoryName)

	const query = gql`
		query {
			foo
		}
	`
	const compressedQuery = `{foo}`

	const fetch = vi.fn().mockImplementation(async (url: string) => {
		const instance = new URL(url)

		if (url === apiEndpoint) {
			return new Response(JSON.stringify(repositoryResponse))
		} else if (`${instance.origin}${instance.pathname}` === uri) {
			expect(instance.searchParams.get("query")).toBe(compressedQuery)
			expect(instance.searchParams.get("ref")).toBe(ref)

			return new Response(
				JSON.stringify({
					data: {
						foo: "bar",
					},
				}),
			)
		} else {
			return new Response("{}", { status: 404 })
		}
	})

	const link = createPrismicLink({
		repositoryName,
		apiEndpoint,
		fetch,
	})

	await executeRequest(link, { query })
})

it("supports custom GraphQL endpoint", async () => {
	expect.assertions(2)

	const repositoryName = "qwerty"
	const apiEndpoint = prismic.getRepositoryEndpoint(repositoryName)
	const uri = "https://example.com/"

	const query = gql`
		query {
			foo
		}
	`
	const compressedQuery = `{foo}`

	const fetch = vi.fn().mockImplementation(async (url: string) => {
		const instance = new URL(url)

		if (url === apiEndpoint) {
			return new Response(JSON.stringify(repositoryResponse))
		} else if (`${instance.origin}${instance.pathname}` === uri) {
			expect(instance.searchParams.get("query")).toBe(compressedQuery)
			expect(instance.searchParams.get("ref")).toBe(ref)

			return new Response(
				JSON.stringify({
					data: {
						foo: "bar",
					},
				}),
			)
		} else {
			return new Response("{}", { status: 404 })
		}
	})

	const link = createPrismicLink({
		repositoryName,
		uri,
		fetch,
	})

	await executeRequest(link, { query })
})
