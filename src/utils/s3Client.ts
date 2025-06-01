import { S3Client, CreateBucketCommand, HeadBucketCommand } from '@aws-sdk/client-s3';

export const s3 = new S3Client({
    region: 'us-east-1',
    endpoint: 'http://localhost:4566',
    forcePathStyle: true,
    credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
    },
});

export async function ensureBucketExists(bucketName: string) {
    try {
        await s3.send(new HeadBucketCommand({ Bucket: bucketName }));
    } catch (err) {
        await s3.send(new CreateBucketCommand({ Bucket: bucketName }));
    }
} 