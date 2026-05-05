import {
    getModSlugFromId,
    getEntrySlugFromId,
    getRouteEntryParams,
} from "./contentEntry.js";
import { withBaseUrl } from "./url.js";

export function createContentLink(entry, section) {
    const routeParams = getRouteEntryParams(entry.id, section);

    if (!routeParams) {
        return null;
    }

    return {
        mod: getModSlugFromId(entry.id),
        slug: getEntrySlugFromId(entry.id),
        href: withBaseUrl(`/${routeParams.mod}/${section}/${routeParams.entrySlug}/`),
        name: entry.data.name,
    };
}
