export default (async () => {
    const tsParser = await import('@typescript-eslint/parser');
    const react = await import('eslint-plugin-react');
    const tsPlugin = await import('@typescript-eslint/eslint-plugin');
    const reactHooks = await import("eslint-plugin-react-hooks");
    const prettierConfig = await import("eslint-config-prettier");

    const astroPlugin = await import("eslint-plugin-astro");
    const astroParser = await import("astro-eslint-parser");

    return [
        {
            ignores: ["node_modules/**", "dist/**"],
        },

        {
            files: ["**/*.{ts,tsx,js,jsx,cjs,mjs}"],
            languageOptions: {
                parser: tsParser.default,
                parserOptions: {
                    ecmaVersion: 2020,
                    sourceType: "module",
                    ecmaFeatures: { jsx: true },
                },
            },
            plugins: {
                react: react.default,
                "@typescript-eslint": tsPlugin.default,
                "react-hooks": reactHooks.default,
            },
            rules: {
                "react/react-in-jsx-scope": "off",
                semi: ["error", "always"],
                quotes: ["error", "double", { avoidEscape: true }],
                "@typescript-eslint/explicit-module-boundary-types": "off",
            },
            settings: {
                react: {
                    version: "detect",
                },
            },
        },

        {
            files: ["**/*.astro"],
            languageOptions: {
                parser: astroParser.default,
                parserOptions: {
                    parser: tsParser.default,
                    extraFileExtensions: [".astro"],
                    ecmaVersion: 2020,
                    sourceType: "module",
                },
            },
            plugins: {
                astro: astroPlugin.default,
                "@typescript-eslint": tsPlugin.default,
            },
            rules: {
                semi: ["error", "always"],
                quotes: ["error", "double", { avoidEscape: true }],
            },
        },

        prettierConfig.default,
    ];
})();