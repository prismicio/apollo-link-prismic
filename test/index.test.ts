import test from "ava";

import { createPrismicLink, PrismicLink } from "../src";

test("PrismicLink is a temporary alias for createPrismicLink", (t) => {
	t.is(PrismicLink, createPrismicLink);
});
