---
title: Deploying a SvelteKit app with Docker on Fly.io
description: Notes on deploying a SvelteKit app with Docker on Fly.io
date: 22-09-2024
draft: false
---

I often deploy SvelteKit apps with Docker, on platforms such as [Fly.io](https://fly.io/), but I always forget the process. Here are some notes.

### Use node adapter

Install it with npm:

```bash
npm install @sveltejs/adapter-node
```

Add it to `svelte.config.js`:

```javascript
import adapter from "@sveltejs/adapter-node";

export default {
  kit: {
    adapter: adapter(),
  },
};
```

### Add Dockerfile and .dockerignore

```bash
FROM node:lts-slim AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:lts-slim
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
EXPOSE 3000
CMD [ "node", "build" ]
```

```bash
Dockerfile
.dockerignore
.git
.gitignore
.gitattributes
README.md
.npmrc
.prettierrc
.eslintrc.cjs
.graphqlrc
.editorconfig
.svelte-kit
.vscode
node_modules
build
package
**/.env
```

### Use dynamic environment variables instead of static

Change occurrences of:

`import { API_KEY } from '$env/static/private';`

to

`import { env } from '$env/dynamic/private';`

Access the environment variable with `env.API_KEY`

Then, add all environment variables to Fly.io secrets manager via the web console.

### Update body size limit (if needed)

By default, SvelteKit has a small body size limit of 512KB. If the app requires large uploads, update the body size limit by setting [`BODY_SIZE_LIMIT`](https://kit.svelte.dev/docs/adapter-node#environment-variables-bodysizelimit) as an environment variable via Fly.io console.
