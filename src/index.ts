import { createPrismicLink } from "./createPrismicLink";
export { createPrismicLink };
export type { PrismicLinkConfig } from "./createPrismicLink";

/**
 * @deprecated Use `createPrismicLink()` instead. It has the same API; only the
 *   name is different.
 */
export const PrismicLink = createPrismicLink;
