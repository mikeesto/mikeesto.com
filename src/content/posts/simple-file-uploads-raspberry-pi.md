---
title: Simple file uploads to a Raspberry Pi (or any headless server)
description: "A quick guide to uploadserver, a Python utility adding a simple web UI for file uploads to headless servers."
date: 26-05-2025
draft: false
---

I often find myself needing to quickly get a file onto a Raspberry Pi or other headless Linux box I'm SSHed into.

For downloading, Python's built-in `python -m http.server` is my go-to. It's brilliant for quickly exposing a directory over HTTP so I can grab files in my browser.

But what about the other direction? Uploading files to the server? That's always been a bit more fiddly. `scp` is the classic solution but remembering the exact syntax and paths, especially for a one-off transfer, can be a minor pain.

I recently stumbled upon [uploadserver](https://github.com/Densaugeo/uploadserver) and it's exactly the kind of simple, effective tool I love. It extends Python's `http.server` to add a straightforward file upload page.

### Installing uploadserver with pipx

The best way to install Python CLI tools like this, in my opinion, is with `pipx`. It installs them into isolated environments and makes them available on your PATH, keeping your global Python environment clean.

If you don't have `pipx` on your Pi (or other Debian-based system), you can install it like this:

```bash
sudo apt update
sudo apt install pipx
pipx ensurepath
```

You might need to open a new terminal session or re-source your shell profile (`source ~/.bashrc`) for the PATH changes from `pipx ensurepath` to take effect.

Installing `uploadserver` is then a one-liner:

```bash
pipx install uploadserver
```

### Running the server

Once installed, navigate to the directory on your Pi where you want the uploaded files to land, and then run:

```bash
uploadserver
```

By default, this starts the server on port 8000. You'll see output like this:

```text
File upload available at /upload
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

If port 8000 is already in use, or you just prefer a different one, you can specify it:

```bash
uploadserver 3000
```

### Uploading files

Now, from another computer on the same network, open your web browser and navigate to your Pi's IP address, followed by the port and `/upload`. For example:

```bash
http://192.168.1.123:8000/upload
```

(Replace `192.168.1.123` with your Pi's actual IP address)

You'll be greeted with a simple "Upload Files" page. You can select multiple files, and they'll be uploaded directly into the directory where you launched `uploadserver`.

If you navigate to the root (e.g., `http://192.168.1.123:8000/`), you'll get the standard Python `http.server` directory listing, so you can still use it for downloads too.

### Why this is so useful

This is incredibly handy for a few reasons:

1.  It's dead simple for those quick, one-off transfers where `scp` feels like overkill.
2.  Anyone with a web browser can use it, without needing to understand `scp` or have SSH set up (beyond the person running uploadserver on the Pi, of course).
3.  This is particularly helpful in workshops or teaching environments. I've seen students struggle with `scp` paths and resort to convoluted methods like emailing files to themselves or using USB sticks. `uploadserver` provides a much more intuitive approach.

One quick note: `uploadserver` by default is open to anyone on your local network. If you need authentication and/or plan on keeping it running for longer periods, definitely check out the project's [README](https://github.com/Densaugeo/uploadserver?tab=readme-ov-file#basic-authentication-downloads-and-uploads) on authentication.
