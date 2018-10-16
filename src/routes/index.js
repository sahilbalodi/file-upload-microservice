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
        sessionToken: process.env.AWS_SESSION_TOKEN,
      });
      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `${request.params.key}`,
        Body: file
      };

      s3.putObject(params, async (err, data) => {
        if (err) {
          console.log(err.stack);
          return reply.response('Upload failed').code(501);
        }
        console.log('Successfully uploaded image');
        reply.response('Successfully uploaded image').code(200);
      });
    }
  }
];
