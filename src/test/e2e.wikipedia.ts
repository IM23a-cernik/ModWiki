import { Selector } from "testcafe";
import { saveCoverage } from "../utils/saveCoverage";

fixture`Wiki Philosophy`.page`https://en.wikipedia.org/wiki/Special:Random`.beforeEach(async (t) => {
    await t.setNativeDialogHandler(() => true);
});

test("Zu Philosophy navigieren", async (t) => {
    const seen = new Set<string>();
    let title = (await Selector("h1").textContent) ?? "";
    let i = 0
    while (title !== "Philosophy" && !seen.has(title)) {
        i++
        seen.add(title);
        console.log(title);

        const link = Selector("p").child("a");
        await t.expect(link.exists).ok({ timeout: 10000 });
        await t.click(link);

        title = (await Selector("h1").textContent);
    }
    console.log(i)
});