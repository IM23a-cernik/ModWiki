import { ClientFunction, Selector } from "testcafe";

fixture`Stalinium download`
    .page`http://127.0.0.1:4321/`
    .skipJsErrors()
    .beforeEach(async (t) => {
        await t.setNativeDialogHandler(() => true);
    });

const removeModrinthTarget = ClientFunction(() => {
    const modrinthLink = document.querySelector('[data-testid="modrinth-link"]');
    modrinthLink?.removeAttribute("target");
});

const closeCookieDialog = ClientFunction(() => {
    const titleElement = Array.from(document.querySelectorAll("body *")).find(
        (element) => element.textContent?.trim() === "We value your privacy",
    );
    const dialog = titleElement?.closest("div");
    if (!dialog) {
        return false;
    }

    const rect = dialog.getBoundingClientRect();
    const clickX = Math.max(rect.right - 24, 0);
    const clickY = Math.max(rect.top + 24, 0);
    const closeCandidate = document.elementFromPoint(clickX, clickY);
    const clickable = closeCandidate?.closest("button, a, div, span");

    if (!clickable) {
        return false;
    }

    clickable.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, cancelable: true, clientX: clickX, clientY: clickY }));
    clickable.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, cancelable: true, clientX: clickX, clientY: clickY }));
    clickable.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, clientX: clickX, clientY: clickY }));
    return true;
});

const clickDownloadButton = ClientFunction((preferLastVisible = false) => {
    const elements = Array.from(document.querySelectorAll("a, button")).filter((element) => {
        const text = element.textContent?.trim();
        const rect = element.getBoundingClientRect();

        return text === "Download" && rect.width > 0 && rect.height > 0;
    });

    const downloadElement = preferLastVisible ? elements[elements.length - 1] : elements[0];

    if (!downloadElement) {
        return false;
    }

    downloadElement.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    return true;
});

test("Download Stalinium", async (t) => {
    const staliniumLink = Selector('[data-testid="mod-link-stalinium"]');
    const modTitle = Selector("h1");
    const modrinthLink = Selector('[data-testid="modrinth-link"]');
    const cookieDialog = Selector("body").withText("We value your privacy");
    const downloadButtons = Selector("a, button").withText("Download").filterVisible();
    const getHostname = ClientFunction(() => window.location.hostname);

    await t
        .expect(staliniumLink.exists)
        .ok()
        .click(staliniumLink)
        .expect(modTitle.textContent)
        .eql("Stalinium")
        .expect(modrinthLink.exists)
        .ok();

    await removeModrinthTarget();

    await t
        .click(modrinthLink)
        .expect(getHostname())
        .eql("modrinth.com", { timeout: 15000 });

    if (await cookieDialog.exists) {
        await t.expect(closeCookieDialog()).ok({ timeout: 15000 });
        await t.expect(cookieDialog.exists).notOk({ timeout: 15000 });
    }

    await t
        .expect(downloadButtons.exists)
        .ok({ timeout: 15000 });

    await t.expect(clickDownloadButton()).ok({ timeout: 15000 });
    await t.expect(downloadButtons.count).gte(1, { timeout: 15000 });
    await t.expect(clickDownloadButton(true)).ok({ timeout: 15000 });
});
