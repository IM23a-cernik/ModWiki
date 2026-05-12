import type { CollectionEntry } from "astro:content";

export function getThemeStyle(themeColor?: string) {
    if (!themeColor) {
        return undefined;
    }

    return `--mod-accent: ${themeColor};`;
}

export function getModPresentation(modEntry?: CollectionEntry<"mods">) {
    return {
        icon: modEntry?.data.icon,
        themeColor: modEntry?.data.themeColor,
        themeStyle: getThemeStyle(modEntry?.data.themeColor),
    };
}