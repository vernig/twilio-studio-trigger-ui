exports.handler = function (context, event, callback) {
  const TwilioClient = context.getTwilioClient();

  executionOptions = { to: event.to, from: event.from };
  if (event.parameters) {
    executionOptions.parameters = JSON.parse(event.parameters);
  }
  TwilioClient.studio
    .flows(event.flowSid)
    .executions.create(executionOptions)
    .then((execution) => {
      console.log(execution.sid);
      callback(null, execution.sid);
    })
    .catch((err) => {
      console.log(err);
      callback(500, null);
    });
};
