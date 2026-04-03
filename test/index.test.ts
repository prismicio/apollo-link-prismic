import { expect, it } from "vitest"

import { createPrismicLink, PrismicLink } from "../src"

it("PrismicLink is a temporary alias for createPrismicLink", () => {
	expect(PrismicLink).toBe(createPrismicLink)
})
