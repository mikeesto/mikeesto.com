---
layout: ../../layouts/Post.astro
title: Publishing a Typescript package to NPM in 2023
description: How to publish a TypeScript package to NPM in 2023 using tsup and np
date: 13-12-2023
draft: false
---

Recently I wrote a small Typescript package, [youtube-subtitle-transcript](https://www.npmjs.com/package/youtube-subtitle-transcript), that fetches the transcripts of YouTube videos. I wanted to publish it to npm so that I could import it into some of my other projects and share it with others. However, it had been a while since I had published anything to npm so I had forgotten how it all works. Now that it's published, I've consolidated all of my notes below.

### Packaging for ESM and CJS with tsup

ECMAScript modules (ESM) may be the future but CommonJS (CJS) is still around and I wanted to package my library for both. The tool that I landed on for this is [tsup](https://github.com/egoist/tsup). Install it as a dev dependency (`npm i tsup -D`) . Assuming that the entry file for the library is `index.ts`, in your `package.json` file, specify the main entry points of the package:

```json
"main": "./dist/index.js",
"module": "./dist/index.mjs",
"types": "./dist/index.d.ts",
"exports": {
  ".": {
    "require": "./dist/index.js",
    "import": "./dist/index.mjs",
    "types": "./dist/index.d.ts"
  }
},
"scripts": {
  "build": "tsup index.ts --format cjs,esm --dts --clean"
}
```

Running this build script will generate a `dist` folder with the transpiled code for both ESM and CJS.

### Testing the package

Before publishing, we can validate the package using [publint.dev](https://publint.dev/) . This will give you an idea of how compatible it is across environments. Run it locally with `npx publint`.

Another trick I learned is that you can use the package's path in the `package.json` of another project to test it works locally. In the other project, this would look like:

```json
dependencies: {
  "new-package": "file:/Users/michael/new-package"
}
```

And then do an `npm install`. This links the `dist` directory of the package locally to your project. If you rebuild the package, this will be immediately reflected in the project

### Publishing to npm

After validating the package, it's time to push it to npm. This includes:

- Running the build script to generate distribution files (e.g., `dist` folder) from your source code.
- Ensuring that the GitHub repository only contains the source code, documentation, configuration files, and other necessary files.
- Exclude the build artifacts (e.g., `dist` folder) from version control using a `.gitignore` file.

### Specifying what to publish

In the `package.json`, we can use the `files` field to specify which files should be included in the published package. Generally, you do not need to include source files in the published package.

The `files` field in package.json will look something like this:

```json
"files": ["dist", "README.md", "LICENSE"],
```

### Using np for publishing

To publish we need to:

- Run tests (if there are any)
- Update `version` in `package.json` according to Semver
- Create a git tag according to Semver
- Push the package to Github
- Push the package to npm
- Create release notes for every update

I used to do this all manually and found it to be headache inducing pain. Now I have found [np](https://github.com/sindresorhus/np), which markets itself as a better npm publish and really lives up to its name. I installed it globally with `sudo npm install -g np` and then publish by running `np` in the project folder and following the prompts - it's great.
