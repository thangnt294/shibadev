import AWS from "aws-sdk";
import { nanoid } from "nanoid";
import { readFileSync } from "fs";

export const isObjectEmpty = (obj) =>
  obj && // null and undefined check
  Object.keys(obj).length === 0 &&
  Object.getPrototypeOf(obj) === Object.prototype;

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const S3 = new AWS.S3(awsConfig);

export const uploadImageToS3 = async (image) => {
  // prepare the image
  const base64Data = new Buffer.from(
    image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  const type = image.split(";")[0].split("/")[1];

  // image params
  const params = {
    Bucket: "elearn-thangnt294",
    Key: `${nanoid()}.${type}`,
    Body: base64Data,
    ACL: "public-read",
    ContentEncoding: "base64",
    ContentType: `image/${type}`,
  };

  // upload to S3
  const data = await S3.upload(params).promise();
  return data;
};

export const removeImageFromS3 = async (image) => {
  const params = {
    Bucket: image.Bucket,
    Key: image.Key,
  };

  // send remove request to S3
  const data = await S3.deleteObject(params).promise();
  return data;
};

export const uploadVideoToS3 = async (video) => {
  // video params
  const params = {
    Bucket: "elearn-thangnt294",
    Key: `${nanoid()}.${video.type.split("/")[1]}`,
    Body: readFileSync(video.path),
    ACL: "public-read",
    ContentType: video.type,
  };

  // upload to S3
  const data = await S3.upload(params).promise();
  return data;
};

export const removeVideoFromS3 = async (video) => {
  const { Bucket, Key } = video;

  // video params
  const params = {
    Bucket,
    Key,
  };

  // delete from S3
  const data = await S3.deleteObject(params).promise();
  return data;
};
