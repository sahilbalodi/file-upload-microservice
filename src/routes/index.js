module.exports = {
  method: 'GET',
  path: '/ping',
  handler: (request, response) => {
    console.log(process.env.AWS_ACCESS_KEY_ID)
    response({ statusCode: 200, message: 'pong' });
  },
}
