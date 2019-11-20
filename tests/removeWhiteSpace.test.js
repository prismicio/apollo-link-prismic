import removeWhiteSpace from '../lib/removeWhiteSpace';
import { isObjectType } from 'graphql';
import { isTSAnyKeyword } from '@babel/types';
import { experimentCookie } from 'prismic-javascript';

describe("lib/removeWhiteSpace should replace repeated white space characters with a single white space characte", () => {
    it("double space", () => {
        const input = "double  space";
        const output = "double space";
        const result = removeWhiteSpace(input);
        expect(result).toBe(output);
    });
    it("double tabs", () => {
        const input = "double\t\ttabs";
        const output = "double tabs";
        const result = removeWhiteSpace(input);
        expect(result).toBe(output);
    });

    it("double newline", () => {
        const input = "double\n\nnewline";
        const output = "double newline";
        const result = removeWhiteSpace(input);
        expect(result).toBe(output);
    });
});