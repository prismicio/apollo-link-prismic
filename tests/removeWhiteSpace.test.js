import removeWhiteSpace from '../src/lib/removeWhiteSpace';
import { isObjectType } from 'graphql';
import { isTSAnyKeyword } from '@babel/types';
import { experimentCookie } from 'prismic-javascript';

describe("lib/removeWhiteSpace should replace repeated white space characters with a single white space characte", () => {
    it("double space", () => {
        const input = "?query=" + encodeURIComponent("double  space");
        const output = "?query=" + encodeURIComponent("double space");
        const result = removeWhiteSpace(input);
        expect(result).toBe(output);
    });

    it("query as last param", () => {
        const input = "?foo=bar&query=" + encodeURIComponent(`{
            thing
        }`);
        const output = "?foo=bar&query=" + encodeURIComponent("{thing}");
        const result = removeWhiteSpace(input);
        expect(result).toBe(output);
    });

    it("query in the middle", () => {
        const [prefix, query, suffix] = [
            `{
                bar
            }`,
            `{
                africa
            }`,
            `{
                toto
            }`
        ];
        const input = '?first=' + encodeURIComponent(prefix) + '&query=' + encodeURIComponent(query) + '&variables=' + encodeURIComponent(suffix);
        const output = "?first=" + encodeURIComponent(prefix) +
        '&query=' + encodeURIComponent(query.replace(/\s/g, '')) +
        '&variables=' + encodeURIComponent(suffix);

        const result = removeWhiteSpace(input);
        expect(result).toBe(output);
    });

    it("shortens a request", () => {
        const input = 'https://test.cdn.prismic.io/graphql?query=%7B%0A%20%20_allDocuments%20%7B%0A%20%20%20%20edges%20%7B%0A%20%20%20%20%20%20node%20%7B%0A%20%20%20%20%20%20%20%20_meta%20%7B%0A%20%20%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A&variables=%7B%7D';
        const output = "https://test.cdn.prismic.io/graphql?query=%7B_allDocuments%7Bedges%7Bnode%7B_meta%7Bid%7D%7D%7D%7D%7D&variables=%7B%7D"
        const result = removeWhiteSpace(input);
        expect(result).toBe(output);
    });

    it("no match", () => {
        const input = "https://www.example.com/";
        const result = removeWhiteSpace(input);
        expect(result).toBe(input);
    })


});
