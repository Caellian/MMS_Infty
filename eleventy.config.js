const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

/**
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 */
module.exports = function(eleventyConfig) {
	eleventyConfig.addPassthroughCopy({
		"./public/": "/"
	});
	eleventyConfig.setBrowserSyncConfig({
		files: './_site/css/**/*.css'
	});

	eleventyConfig.addWatchTarget("src/**/*.{svg,webp,png,jpeg}");
	
	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

	return {
		templateFormats: [
			"html",
			"njk",
			"md"
		],
		markdownTemplateEngine: "njk",
		htmlTemplateEngine: "njk",

		dir: {
			input: "src",
			includes: "../_includes",
			data: "../_data",
			output: "_site",
		},
		pathPrefix: "/MMS_Infty/",
	}
};