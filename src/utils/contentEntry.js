export function getModSlugFromId(id) {
    return id.split("/")[0] ?? id;
}

export function getEntrySlugFromId(id) {
    return id.split("/").at(-1) ?? id;
}

export function getRouteEntryParams(id, expectedSection) {
    const [mod, section, entrySlug] = id.split("/");

    if (!mod || section !== expectedSection || !entrySlug) {
        return null;
    }

    return { mod, entrySlug };
}
