---
layout: ../../layouts/Post.astro
title: Client-side image compression with Supabase Storage
date: 09-12-2022
draft: false
---

One of the projects I have been working on recently allows users to upload and share images. Super novel, I know. The project is using Supabase (a Firebase alternative) for the backend and the images are stored in Supabase Storage - an S3 compatible object store. I’ve used Supabase in a couple of projects now and found it to be a neat product (#notsponsored). However, in this project we ran into an issue from the outset with storage. Users were uploading photos from their phones which had very large resolutions and consequently huge file sizes. This wasn’t good because we have limits on storage and bandwidth, plus the gallery view of the app was becoming increasingly slower to load.

Unfortunately, Supabase does not currently support any kind of image optimization. It’s [commonly](https://github.com/supabase/supabase/discussions/1407) [requested](https://github.com/supabase/storage-api/issues/47), and quite likely on their roadmap, but at least for now there wasn’t a setting I could toggle to solve the problem. I’ve run into a similar issue before using Amazon S3, and in that project we used a lambda function to do image optimisation when an image was uploaded to the bucket. But this didn’t seem particularly straightforward with Supabase, so I went searching for a different solution.

After researching a couple of different options, what I landed on was a package called [compressorjs](https://github.com/fengyuanchen/compressorjs) written by Chen Fengyuan. This library performs compression and resizing of images in the browser - and has very good browser support! Compressorjs uses the HTML5 canvas element to read the original image data and perform lossy transformations to compress and resize the image. Its API provides a whole bunch of options. For my project, what I have found is simply changing the maximum width of the image to 600px and slightly reducing the quality has greatly reduced the file size.

Here is how you might go about using compressorjs with Supabase:

```js
import Compressor from "compressorjs";

document.getElementById("file").addEventListener("change", (e) => {
  const image = e.target.files[0];

  if (!image) {
    return;
  }

  new Compressor(image, {
    quality: 0.9,
    maxWidth: 600,

    success(compressedImage) {
      // compressedImage contains the Blob
      // Upload the compressed image to Supabase storage
      supabase.storage
        .from("images")
        .upload(`public/filename`, compressedImage);
    },
    error(err) {
      console.log(err.message);
    },
  });
});
```
