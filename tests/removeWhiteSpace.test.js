import removeWhiteSpace from '../lib/removeWhiteSpace';
import { isObjectType } from 'graphql';
import { isTSAnyKeyword } from '@babel/types';
import { experimentCookie } from 'prismic-javascript';

describe("lib/removeWhiteSpace should replace repeated white space characters with a single white space characte", () => {
    it("double space", () => {
        const input = encodeURIComponent("double  space");
        const output = encodeURIComponent("double space");
        const result = removeWhiteSpace(input);
        expect(result).toBe(output);
    });
    xit("double tabs", () => {
        const input = encodeURIComponent("double\t\ttabs");
        const output = encodeURIComponent("double\ttabs");
        const result = removeWhiteSpace(input);
        expect(result).toBe(output);
    });

    xit("double newline", () => {
        const input = encodeURIComponent("double\n\nnewline");
        const output = encodeURIComponent("double\nnewline");
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
        const input = encodeURIComponent("no match");
        const output = input;
        const result = removeWhiteSpace(input);
        expect(result).toBe(input);
    })

    
});