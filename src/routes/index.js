const AWS = require('aws-sdk');
const fs = require('fs');
const Joi = require('joi');
const models = require('../../models')

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
    path: '/api/{clientIdNumber}/{imgNumber}/upload',
    config: {
      payload: {
        output: 'file',
        allow: 'multipart/form-data'
      },
      validate: {
        params: {
          clientIdNumber: Joi.number().integer().required(),
          imgNumber: Joi.number().integer().required()
        }
      }
    },
    handler: (request, reply) => {
      const { clientIdNumber, imgNumber } = request.params;
      const image = fs.readFileSync(request.payload.file.path);
      const fileName = request.payload.file.filename.replace(/\s/g, '');
      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN,
      });
      const promise = new Promise((resolve, reject) => {
        request.payload.file.filename = request.payload.file.filename.replace(
          /\s/g,
          ''
        );
        const params = {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: `${process.env.APP_NAME}/${clientIdNumber}/${imgNumber}/${request.payload.file.filename}`,
          Body: image,
          ContentType: 'image/png'
        };

        s3.putObject(params, async (err, data) => {
          if (err) {
            console.log(err.stack);
            return reply.response('Upload failed').code(501);
          }
          console.log('Successfully uploaded image');
          await models.uploads.destroy({
            where: {
              clientIdNumber,
              imgNumber
            }
          });
          models.uploads.create({
            clientIdNumber,
            imgNumber
          })
            .then((insertedData) => {
              if (insertedData) {
                resolve(insertedData);
              }
            })
            .catch(errs => reply.response(errs.stack).code(501));
        });
      });
      return promise;
    }
  }
];
