function isFlowTriggerable(flow) {
  if (!flow.definition) {
    return null;
  }
  const trigger = flow.definition.states[0];
  if (trigger.name !== 'Trigger') {
    console.error(`The first state of flow ${flow.sid} is not the trigger :-(`);
    return;
  }
  if (
    trigger.transitions.find(
      (transition) => transition.event === 'incomingRequest' && transition.next
    )
  ) {
    return { sid: flow.sid, friendlyName: flow.friendlyName };
  } else {
    return null;
  }
}

exports.handler = function (context, event, callback) {
  const twilioClient = context.getTwilioClient();
  twilioClient.studio.flows
    .list({ limit: 50 })
    .then((flows) => {
      return Promise.all(
        flows.map((flow) =>
          twilioClient.studio
            .flows(flow.sid)
            .fetch()
            .then((flowInfo) => Promise.resolve(isFlowTriggerable(flowInfo)))
        )
      );
    })
    .then((flows) => {
      callback(
        null,
        flows.filter((flow) => flow)
      );
    })
    .catch((err) => {
      console.log(err);
      callback(500, null);
    });
};
