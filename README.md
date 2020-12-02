# Web interface for triggering Twilio Studio flows

This repo provide you with an interface to trigger Studio Flows in your Twilio account.

# Install

- Clone the repo
- Install dependencies:

```
npm install
```

- Configure your environment:

```
npm run configure
```

- Deploy the project

```
npm run deploy
```

- Once deployed succesfully you should see some addresses printed in the terminal.

```shell
...
Assets:
   https://twilio-studio-trigger-ui-xxxx-dev.twil.io/index.html
   https://twilio-studio-trigger-ui-xxxx-dev.twil.io/scripts/studio.js
   https://twilio-studio-trigger-ui-xxxx-dev.twil.io/style.css
```

Copy the full address of the `index.html`

# Usage

In your browser open the address copied in the previous step. You should see a page loading your Studio flow. Please note that only Studio Flows that can be triggered via API are shown in the dropdown list:

Select the flow from the list, add the To and From number. Optinally you can specify some parameters. This needs to be a valid JSON object, e.g.

```json
{ "foo": "bar" }
```

Now click on the trigger button to execute the flow.
