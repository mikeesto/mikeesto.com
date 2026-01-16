---
title: Uploading files to Nectar's Object Storage
description: How to upload files to Nectar Research Cloud's Object Storage using OpenStack Swift and application credentials.
date: 16-01-2026
draft: false
---

This is the quick post on uploading files to [Nectar Research Cloud's](https://dashboard.rc.nectar.org.au/) Object Storage, which uses [OpenStack Swift](https://github.com/openstack/swift) under the hood.

I’m writing this down mainly so I don't forget it later!

We are going to generate application credentials in the Nectar dashboard, manually create a container to hold our files, and then write a small Python script to upload a test.txt file.

While there are many ways to authenticate with OpenStack, I prefer using Application Credentials. This avoids embedding your real user password (or SSO token), and makes it easy to revoke access later without changing your login details.

### 1. Create the credentials

In the Nectar dashboard, navigate to your project and select **Identity → Application Credentials**.

Click **Create Application Credential**. You will be given an ID and a Secret. Copy the secret somewhere as you won't be able to view it again.

### 2. Create a container

Swift stores objects in "containers" (roughly equivalent to S3 buckets).

While you can create these programmatically, it’s often easier to do it once via the UI. In the dashboard, find **Object Storage → Containers** and create one. I’ll call mine `wishwell`.

This step is important because if the container doesn’t exist, uploading an object to it will fail with a confusing 404 Not Found.

### 3. The Python dependencies

To use the Swift client with modern Keystone authentication, you need two packages: `python-swiftclient` and `python-keystoneclient`.

That second one is easy to miss because you don't need to explicitly import it. `Swiftclient` can authenticate against Keystone v3, but it implicitly relies on the keystone client library to handle the handshake. Without it, you end up with a bunch of auth errors.

I also use `python-dotenv` to manage secrets.

```bash
pip install python-swiftclient python-keystoneclient python-dotenv
```

### 4. The upload script

Create a file called `upload_test.py` next to a `test.txt` in the same directory.

The trick here is the `os_options` dictionary. Most documentation I found focuses on username/password auth, but for application credentials, we pass the ID and Secret via options and leave the user/key fields empty.

```python
import os
import swiftclient
from dotenv import load_dotenv

load_dotenv()

AUTH_URL = os.environ["OS_AUTH_URL"]
APP_CRED_ID = os.environ["OS_APPLICATION_CREDENTIAL_ID"]
APP_CRED_SECRET = os.environ["OS_APPLICATION_CREDENTIAL_SECRET"]
CONTAINER = os.environ["SWIFT_CONTAINER"]

conn = swiftclient.Connection(
    authurl=AUTH_URL,
    user=None,
    key=None,
    auth_version="3",
    os_options={
        "auth_type": "v3applicationcredential",
        "application_credential_id": APP_CRED_ID,
        "application_credential_secret": APP_CRED_SECRET
    },
)

with open("test.txt", "rb") as f:
    conn.put_object(
        CONTAINER,
        "test.txt",
        contents=f.read(),
        content_type="text/plain"
    )

print(f"Uploaded test.txt to {CONTAINER}")
```

Set your environment variables in an `.env` file. The `OS_AUTH_URL` for Nectar is usually `https://identity.rc.nectar.org.au/v3/`.

```bash
OS_AUTH_URL="https://identity.rc.nectar.org.au/v3/"
OS_APPLICATION_CREDENTIAL_ID="<your_cred_id>"
OS_APPLICATION_CREDENTIAL_SECRET="<your_cred_secret>"
SWIFT_CONTAINER="wishwell"
```

### 5. Run the script

```bash
python upload_test.py
```

If the stars align, you’ll see `Uploaded test.txt to wishwell`. Check the Nectar dashboard under Object Storage → Containers → wishwell to see your uploaded file.

### A few small gotchas

_It authenticated, but PUT returns 404_. If you see a 404 Not Found on the `PUT` request, check that the container actually exists in this project. If you created the container under a different project than the one your credentials are scoped to, it will look like it doesn’t exist to the API.

_Do I need all of the other standard OpenStack env vars?_
No. One benefit of application credentials is that the environment surface area is small. You don't need `OS_USERNAME`, `OS_PROJECT_NAME`, or `OS_USER_DOMAIN_NAME`. The Credential ID implies the user and project scope automatically.

_Debugging with logging_. If the upload fails, Python’s logging module can be your friend. Turning the logging level to `INFO` for the `swiftclient` logger will print the equivalent `curl` commands and response codes, which I've found makes debugging permissions issues easier.
