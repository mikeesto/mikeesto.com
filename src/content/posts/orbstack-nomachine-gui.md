---
title: Orbstack Linux machine GUIs with NoMachine
description: Setting up and connecting to a desktop environment (XFCE) on an Orbstack Linux machine using NoMachine for remote desktop access.
date: 02-07-2024
draft: false
---

I've been using [Orbstack Linux machines](https://docs.orbstack.dev/machines/) for some of my personal projects. When a project requires many dependencies that I don't want to install on my host machine, I spin up an Orbstack machine. The speed at which you can create and destroy machines is wild.

While Parallels and VMware are great alternatives, I often reach for Orbstack now because of the way it integrates with the host machine. Automatic port forwarding, access to the host filesystem, and handling of the SSH agent for pushing to Git without additional setup are super convenient features. It reminds me a lot of WSL.

However, there are times when I need access to a GUI, and Orbstack does not currently support running graphical applications. But you can install a desktop environment and use a remote access solution, which is what I did recently after installing XFCE.

Initially, I set up a VNC server on the Orbstack machine and connected to it from my host machine - an M3 Pro. It worked, but the resolution was below 720p. I tried to increase the resolution through the typical display settings, but that failed with an error message: "RandR extension missing". I didn't manage to resolve this, but I found a workaround by setting the resolution when starting the VNC server. `vncserver -geometry 1920x1080` sets the virtual display resolution at 1080p. However, the performance was disappointing. Just moving window panes around was laggy. I could live with it if I had to, but it wasn't ideal.

Next, I tried [NoMachine](https://www.nomachine.com/). I read on Reddit that it was a faster alternative to VNC, albeit a proprietary one. To get it going on the headless Orbstack machine, I used wget to download the installation package and installed it with dpkg. I then installed the NoMachine client on MacOS. However, I encountered an issue when trying to connect because of Orbstack's passwordless authentication setup. It turns out that NoMachine's free version does not support connecting over SSH. At first, I assumed there was something wrong with the way SSH was setup on the VM, until I realised that it was a restriction on NoMachine' side.

To resolve this, I created a new Linux user with a password and successfully connected to the Orbstack machine using NoMachine. The performance at 1080p is very good; it almost feels like a native experience.
