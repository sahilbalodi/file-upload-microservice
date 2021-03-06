const AWS = require('aws-sdk');
const fs = require('fs');
const Joi = require('joi');

module.exports = [
  {
    method: 'GET',
    path: '/ping',
    handler: (request, response) => {
      response({ statusCode: 200, message: 'pong' });
    },
  },
  {
    method: 'POST',
    path: '/api/upload/{key}',
    config: {
      payload: {
        output: 'file',
        allow: 'multipart/form-data'
      },
      validate: {
        params: {
          key: Joi.string().required()
        }
      }
    },
    handler: (request, reply) => {
      const file = fs.readFileSync(request.payload.file.path);
      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        signatureVersion: 'v4',
        region: process.env.AWS_REGION
      });
      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `${request.params.key}`,
        Body: file
      };

      s3.putObject(params, async (err) => {
        if (err) {
          console.log(err.stack);
          return reply.response('Upload failed').code(501);
        }
        console.log('Successfully uploaded file');
        reply.response('Successfully uploaded file').code(200);
      });
    }
  },
  {
    method: 'GET',
    path: '/api/download/{key}',
    config: {
      validate: {
        params: {
          key: Joi.string().required()
        }
      }
    },
    handler: async (request, reply) => {
      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        signatureVersion: 'v4',
        region: process.env.AWS_REGION
      });
      const urlParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `${request.params.key}`
      };
      s3.getSignedUrl('getObject', urlParams, (error, url) => {
        if (error) {
          console.log('Url sigining error: ', error.stack);
          console.log(error.stack);
          return reply.response('Url error').code(501);
        }
        console.log('the url of the file is', url);
        reply({
          statusCode: 200,
          url
        })
      });
    }
  }
];
