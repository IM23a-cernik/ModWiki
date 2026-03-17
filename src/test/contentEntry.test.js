import {
    getEntrySlugFromId,
    getModSlugFromId,
    getRouteEntryParams,
} from "../utils/contentEntry.js";

describe("Unit tests with Jest", () => {
    test("checks if copper_hammer is in test", () => {
        expect(getModSlugFromId("test/items/copper_hammer")).toBe("test");
    });

    test("checks if achievement exists", () => {
        expect(getEntrySlugFromId("test/achievements/first_spark")).toBe("first_spark");
    });

    test("Tests if copper_ore has correct params", () => {
        expect(getRouteEntryParams("test/blocks/copper_ore", "blocks")).toEqual({
            mod: "test",
            entrySlug: "copper_ore",
        });
    });

    test("tests wrong section", () => {
        expect(getRouteEntryParams("test/items/copper_hammer", "blocks")).toBeNull();
    });

    test("returns null when the content id is incomplete", () => {
        expect(getRouteEntryParams("test/items", "items")).toBeNull();
    });
});
