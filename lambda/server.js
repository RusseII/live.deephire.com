
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const oneAndHalfHours = 5400
const MAX_ALLOWED_SESSION_DURATION = oneAndHalfHours;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKeySID = process.env.TWILIO_API_KEY_SID;
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;

module.exports.handler = (context, event, callback) => {
  console.log("context", context)
  const { identity, roomName } = context.queryStringParameters;
  const token = new AccessToken(twilioAccountSid, twilioApiKeySID, twilioApiKeySecret, {
    ttl: MAX_ALLOWED_SESSION_DURATION,
  });
  token.identity = identity;
  const videoGrant = new VideoGrant({ room: roomName });
  token.addGrant(videoGrant);
  const res = ({statusCode: 200, body: token.toJwt() });
  callback(null, res);

}
