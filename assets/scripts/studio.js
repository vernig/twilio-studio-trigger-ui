function generateTwilioSignature(key, url, bodyData) {
  var hmacObj = new jsSHA('SHA-1', 'TEXT');
  hmacObj.setHMACKey(key, 'TEXT');

  let data = Object.keys(bodyData)
    .sort()
    .reduce((acc, key) => acc + key + bodyData[key], url);

  hmacObj.update(data);

  return hmacObj.getHMAC('B64');
}

function error(message) {
  console.log(message);
}

fetch('fetch-triggerable-flows')
  .then((res) => res.json())
  .then((resJson) => {
    $('.ui.dropdown').dropdown({
      values: resJson.map((flow) => {
        return { name: flow.friendlyName, value: flow.sid };
      }),
    });
    document.getElementById('flows-menu-placeholder').textContent =
      'Select Studio Flow';
    document.querySelector('.ui.form').classList.toggle('loading');
  });

function executeFlow() {
  const selectedFlowSid = $('.dropdown').dropdown('get value');
  const toNumber = $('.ui.form').form('get value', 'to');
  const fromNumber = $('.ui.form').form('get value', 'from');
  const parameters = $('.ui.form').form('get value', 'parameters');
  if (!selectedFlowSid || !toNumber || !fromNumber) {
    error('Form validation');
    swal.fire({
      title: 'Missing input',
      icon: 'error',
      text:
        'Make sure you select the studio flow and fill-up From and To number',
    });
    return;
  }

  body = {
    flowSid: selectedFlowSid,
    from: fromNumber,
    to: toNumber,
  };

  if (parameters) {
    try {
      JSON.parse(parameters);
      body.parameters = parameters;
    } catch {
      error('Paramters is not a valid JSON');
      swal.fire({
        title: 'Error with parameters',
        icon: 'error',
        text: 'Parameters is not a valid JSON',
      });
      return;
    }
  }

  swal
    .fire({
      title: 'Enter your auth token',
      input: 'password',
      showCancelButton: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        swal.fire('Executing flow');
        swal.showLoading();
        fetch('/trigger-flow', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-twilio-signature': generateTwilioSignature(
              result.value,
              `${window.location.origin}/trigger-flow`,
              body
            ),
          },
          body: jQuery.param(body),
        })
          .then((res) => {
            if (res.ok) {
              swal.fire({ icon: 'success', title: 'Flow triggered' });
            } else {
              swal.fire({
                icon: 'error',
                title: 'Error triggering flow',
                text: `API returned with a status ${res.status}`,
              });
            }
          })
          .catch((err) => {
            swal.close();
            swal.fire({
              icon: 'error',
              title: 'Error triggering flow',
              text: err.toString(),
            });
          });
      }
    });
}
