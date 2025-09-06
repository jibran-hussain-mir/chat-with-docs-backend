import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import 'dotenv/config'
const s3Client = new S3Client();

const defaultBucket = process.env.AWS_BUCKET_NAME;

async function getSignedUrl(action, bucket, key, params) {
    try {
        let bucketName = null;
        let command = null;
        if (!bucket) bucketName = defaultBucket;
        if (action === 'upload') {
            const uploadParams = {
                bucket: bucketName,
                Key: key,
                mimeType: params.mimeType
            }
            command = new PutObjectCommand(uploadParams);
        } else if (action === 'initiateMultipartUpload') {
            const uploadParams = {
                bucket: bucketName,
                Key: key,
                ChecksumAlgorithm: 'crc32'
            }

            command = createMultipartUploadCommand(uploadParams);
        } else if (action === 'uploadPart') {
            const uploadParams = {
                Body: params.partBody,
                Key: key,
                PartNumber: params.partNumber,
                UploadId: params.uploadId
            }
            command = new UploadPartCommand(uploadParams);
        } else if (action === 'completeMultipartUpload') {
            const uploadParams = {
                Bucket: bucketName,
                Key: key,
                UploadId: params.uploadId,
                MultipartUpload: {
                    Parts: params.parts
                }
            }
            command = createCompleteMultipartUploadCommand(uploadParams);
        }
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: process.env.AWS_SIGNED_URL_EXPIRATION });
        return signedUrl;
    } catch (error) {
        console.error("Error getting signed URL:", error);
        throw error;
    }
}

const storageApi = {
    getSignedUrl
}

export default storageApi;