export function withBaseUrl(path, baseUrl = import.meta.env?.BASE_URL ?? "/") {
    if (!path) {
        return path;
    }

    if (/^(?:[a-z]+:)?\/\//iu.test(path) || path.startsWith("data:")) {
        return path;
    }

    const normalizedBaseUrl = !baseUrl || baseUrl === "/"
        ? "/"
        : (baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;

    return `${normalizedBaseUrl}${normalizedPath}`;
}
