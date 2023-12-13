---
layout: ../../layouts/Post.astro
title: Publishing an NPM package in 2023
description: How to publish an NPM package in 2023 using tsup and np
date: 13-12-2023
draft: false
---

I recently went through the process of publishing [youtube-subtitle-transcript](https://www.npmjs.com/package/youtube-subtitle-transcript) . I've consolidated all of my notes below so that I can revisit this post... probably in a year from now.

### Packaging for ESM and CJS with tsup

ESM may be the future, but for now, I still feel the need to package for both ECMAScript modules (ESM) and CommonJS (CJS). The tool I've landed on for this is [tsup](https://github.com/egoist/tsup). Install it as a dev dependency `npm i tsup -D` . Then, in your package.json file, specify the main entry points of the package:

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
  "build": "tsup src/index.ts --format cjs,esm --dts --clean"
}
```

Running the build script will generate a `dist` folder with the transpiled code for both ESM and CJS.

### Testing the package

Before publishing, we can validate the package by using [publint.dev](https://publint.dev/) . This will give you an idea of how compatible it is across environments (at the moment I'm still failing some...). Run it locally with `npx publint`.

Another trick I learned is to use the package's path in the `package.json` of another project to test it works locally. In the other project, this would look like:

```json
dependencies: {
  "new-package": "file:/Users/michael/new-package"
}
```

And then do a typical `npm install`.

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

Actually doing the publishing part is headache-inducing. It's a process of:

- Run tests (if there are any)
- Update `version` in `package.json` according to Semver
- Create a git tag according to Semver
- Push the package to Github
- Push the package to npm
- Create release notes for every update

I now use [np](https://github.com/sindresorhus/np) , which markets itself as a better npm publish and actually lives up to its name. I installed it globally with `sudo npm install -g np` and then publish by running `np` in the project folder and following the prompts. It's a lifesaver.
