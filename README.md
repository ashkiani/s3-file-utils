# s3-file-utils
List files in an S3 folder and generate signed URLs using AWS SDK v3.


# @ashkiani/s3-file-utils

AWS S3 utility functions for Node.js — list files in a folder and generate pre-signed download URLs using AWS SDK v3.

This module helps backend applications interact with Amazon S3: listing folder contents and securely linking to files via expiring signed URLs.

---

## 📦 Installation

```bash
npm install @ashkiani/s3-file-utils
```

---

## 🛠 Usage

1. Set your environment variables:

```env
AWS_REGION=us-east-1
URL_EXPIRES_IN=3600
```

2. Use the module in your code:

```js
const s3Utils = require('@ashkiani/s3-file-utils');

const bucket = "my-bucket";
const folder = "documents/";

const files = await s3Utils.listFilesInFolder(bucket, folder);
console.log("Files:", files);

const signedUrl = await s3Utils.genSignedUrl(bucket, `${folder}${files[0]}`);
console.log("Download URL:", signedUrl);
```

---

## 📘 API

### `listFilesInFolder(bucketName, folderPath)`

Lists all files (not folders) in a specific S3 folder.

* `bucketName` — Your S3 bucket name.
* `folderPath` — Must end with `/`, e.g., `"reports/2024/"`.
* Returns: `Promise<string[]>` sorted alphabetically.

### `genSignedUrl(bucket, fileKey)`

Generates a signed URL for a specific file in the bucket.

* `bucket` — S3 bucket name.
* `fileKey` — Full key including folder path.
* Returns: `Promise<string>` — A temporary download URL.

---

## 💡 Notes

* Uses AWS SDK v3 (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`).
* Pre-signed URL expiration is controlled via `URL_EXPIRES_IN` environment variable (in seconds).
* Folder names must end with a `/` to properly scope the listing.
* Files are filtered to exclude subfolders and folder markers.

---

## 📄 License

MIT © Siavash Ashkiani