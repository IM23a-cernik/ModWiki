import { createContentLink } from "../utils/contentLink.js";
import { ItemEntryFake } from "./doubles/ItemEntryFake.js";
import { BlockEntryFake } from "./doubles/BlockEntryFake.js";
import { BrokenEntryFake } from "./doubles/BrokenEntryFake.js";

describe("Integration tests for content links", () => {
    test("creates link for valid item entry", () => {
        const entry = new ItemEntryFake().create();

        const result = createContentLink(entry, "items");

        expect(result).toEqual({
            mod: "test",
            slug: "copper_hammer",
            href: "/test/items/copper_hammer/",
            name: "Copper Hammer",
        });
    });

    test("returns null if the section doesn't match", () => {
        const entry = new BlockEntryFake().create();

        const result = createContentLink(entry, "items");

        expect(result).toBeNull();
    });

    test("returns null for an incomplete id", () => {
        const entry = new BrokenEntryFake().create();

        const result = createContentLink(entry, "items");

        expect(result).toBeNull();
    });
});