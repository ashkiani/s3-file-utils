const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const s3Client = new S3Client({ region: process.env.AWS_REGION });
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
/**
 * Lists all the files in a specific folder (prefix) inside an S3 bucket and returns them sorted alphabetically.
 * 
 * @param {string} bucketName - The name of your S3 bucket.
 * @param {string} folderPath - The folder path (prefix) within the bucket. Ensure it ends with a '/'.
 * @returns {Promise<string[]>} - A promise that resolves to an array of file keys sorted alphabetically.
 */
async function listFilesInFolder(bucketName, folderPath) {
    let fileKeys = [];
    let isTruncated = true;
    let continuationToken;

    const params = {
        Bucket: bucketName,
        Prefix: folderPath,
        Delimiter: '/',
    };

    try {
        while (isTruncated) {
            // Copy the parameters and add the ContinuationToken if available
            const commandParams = { ...params };
            if (continuationToken) {
                commandParams.ContinuationToken = continuationToken;
            }

            const command = new ListObjectsV2Command(commandParams);
            const data = await s3Client.send(command);

            if (data.Contents) {
                data.Contents.forEach(item => {
                    // Filter out the folder itself and any subfolder markers (ending with '/')
                    if (item.Key !== folderPath && !item.Key.endsWith('/')) {
                        fileKeys.push(item.Key);
                    }
                });
            }

            isTruncated = data.IsTruncated;
            continuationToken = data.NextContinuationToken;
        }

        // Sort the file keys in alphabetical order
        fileKeys.sort();
        const fileNames = fileKeys
            .map(key => key.substring(folderPath.length))
            .sort();
        return fileNames;

    } catch (error) {
        console.error("Error listing files from S3:", error);
        throw error;
    }
}

async function genSignedUrl(bucket, file) {
    // Generate a pre-signed URL for the S3 object.
    const params = {
        Bucket: bucket,
        Key: file
    };
    const command = new (require('@aws-sdk/client-s3').GetObjectCommand)(params);
    //console.log("Command input:", command.input);
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: process.env.URL_EXPIRES_IN });
    return signedUrl
}
module.exports = {
    listFilesInFolder,
    genSignedUrl
};