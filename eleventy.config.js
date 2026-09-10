// markdown-it: a parser that converts Markdown text into HTML
// katex: a plugin that adds math rendering support to markdown-it
import markdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import { katex } from "@mdit/plugin-katex";

// exports a function that Eleventy automatically calls when building the site
export default function (eleventyConfig) {
  // Shortcode for blue medium weight emphasis
  eleventyConfig.addShortcode("bemph", function(text) {
    return `<span class="text-emphasis-blue">${text}</span>`;
  });
  // Shortcode for Hayghin Daedric
  eleventyConfig.addShortcode("daedric", function(text) {
    return `<span class="daedric">${text}</span>`;
  });
  // Shortcode (Paired) for Sidenotes - Numbered and Unnumbered
  let ncounter = 1;
  eleventyConfig.addPairedShortcode("sidenum", function(content, id) {
    // if an explicit ID is passed use it, otherwise auto-increment
    const numberID = id || ncounter++;
    
    return `<label for="sn-${numberID}" class="sidenote-toggle sidenote-number"></label>` +
           `<input type="checkbox" id="sn-${numberID}" class="sidenote-toggle" />` +
           `<span class="sidenote">${content.trim()}</span>`;
  });
  let scounter = 1;
  eleventyConfig.addPairedShortcode("sidesym", function(content, id) {
    // if an explicit ID is passed use it, otherwise auto-increment
    const symbolID = id || scounter++;
    
    return `<label for="${symbolID}" class="sidenote-toggle">&ast;</label>` +
           `<input type="checkbox" id="${symbolID}" class="sidenote-toggle" />` +
           `<span class="sidenote">${content.trim()}</span>`;
  });

  // Vendor the CSS straight from node_modules - no CDN dependency, works
  // offline, and it is trivial to bump versions later with npm update.
  eleventyConfig.addPassthroughCopy({
    // copy files into the output folder _site without processing them
    "src/css/ledger-theme.css": "css/ledger-theme.css",
    "src/css/navi-sidebar.css": "css/navi-sidebar.css",
    "src/css/sidenotes.css": "css/sidenotes.css",
    "node_modules/latex.css/style.css": "css/vendor/latex.css",
    "node_modules/katex/dist/katex.min.css": "css/vendor/katex.min.css",
    "node_modules/katex/dist/fonts": "css/vendor/fonts",
    "src/assets/images": "images",
    "src/assets/fonts": "fonts",
    "src/js": "js",
  });

  // Render $...$ and $$...$$ to real math at build time - no client-side JS,
  // no flash of unrendered TeX. htmlAndMathml keeps KaTeX's visual output
  // and a semantic MathML fallback for screen readers.
  const md = markdownIt({ html: true })
    .use(katex, {
      output: "htmlAndMathml",
    })
    .use(anchor, {
      permalink: anchor.permalink.headerLink(),
    });
  eleventyConfig.setLibrary("md", md);

  const isProd = process.env.ELEVENTY_ENV === "production";

  // search for source files in src write the built website in _site
  return {
    pathPrefix: isProd ? "/ttrpg/" : "/", // GitHub Pages deployment
    dir: {
      input: "src",
      output: "_site",
    },
  };
}