import { S3Client, CreateBucketCommand, HeadBucketCommand, PutBucketPolicyCommand, PutBucketCorsCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const {
    LOCALSTACK_ENDPOINT = 'http://localhost:4566',
    LOCALSTACK_DEFAULT_REGION = 'us-east-1',
    LOCALSTACK_ACCESS_KEY_ID = 'test',
    LOCALSTACK_SECRET_ACCESS_KEY = 'test'
} = process.env;

export const s3 = new S3Client({
    region: LOCALSTACK_DEFAULT_REGION,
    endpoint: LOCALSTACK_ENDPOINT,
    forcePathStyle: true,
    credentials: {
        accessKeyId: LOCALSTACK_ACCESS_KEY_ID,
        secretAccessKey: LOCALSTACK_SECRET_ACCESS_KEY,
    },
});

export async function ensureBucketExists(bucketName: string) {
    try {
        await s3.send(new HeadBucketCommand({ Bucket: bucketName }));
    } catch (err) {
        await s3.send(new CreateBucketCommand({
            Bucket: bucketName,
            ACL: 'public-read'
        }));

        const bucketPolicy = {
            Version: '2012-10-17',
            Statement: [
                {
                    Sid: 'PublicReadGetObject',
                    Effect: 'Allow',
                    Principal: '*',
                    Action: ['s3:GetObject'],
                    Resource: `arn:aws:s3:::${bucketName}/*`
                }
            ]
        };

        await s3.send(new PutBucketPolicyCommand({
            Bucket: bucketName,
            Policy: JSON.stringify(bucketPolicy)
        }));

        const corsConfig = {
            CORSRules: [
                {
                    AllowedHeaders: ['*'],
                    AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
                    AllowedOrigins: ['*'],
                    ExposeHeaders: ['ETag'],
                    MaxAgeSeconds: 3000
                }
            ]
        };

        await s3.send(new PutBucketCorsCommand({
            Bucket: bucketName,
            CORSConfiguration: corsConfig
        }));
    }
} 