---
title: Integrate With Beyond Identity
sidebar_position: 1
---

This guide describes how to configure Beyond Identity as the primary IdP.

## Prerequisites

 - [Using Beyond Identity for Authentication](../../using-bi-for-auth)
 - [JavaScript SDK Overview](overview)

:::tip NextAuth.js
This guide uses [NextAuth](https://next-auth.js.org/) for all OAuth/OIDC flows. All code snippets are provided in the context of the [NextAuth Example App](https://github.com/nextauthjs/next-auth-example).
:::

## Configuring NextAuth

Under `next-auth-example/pages/api/auth/[...nextauth].ts`, add the following Beyond Identity provider:

```javascript
...
providers: [
  {
    id: "beyondidentity",
    name: "Beyond Identity",
    type: "oauth",
    wellKnown: `https://auth-us.beyondidentity.com/v1/tenants/${<TENANT_ID>}/realms/${<REALM_ID>}/applications/${<APPLICATION_ID>}/.well-known/openid-configuration`,
    authorization: { params: { scope: "openid" } },
    clientId: process.env.APP_CLIENT_ID,
    clientSecret: process.env.APP_CLIENT_SECRET,
    idToken: true,
    checks: ["state"],
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.sub,
        email: profile.sub,
      }
    }
  }
]
...
```

Note that you'll need to fill in the `<TENANT_ID>`, `<REALM_ID>`, `<APPLICATION_ID>`, `<APP_CLIENT_ID>`, and `<APP_CLIENT_SECRET>` with the values you generated when creating your application. See the [following](../../using-bi-for-auth) guide mentioned in the [prerequisites](#prerequisites).

## Wiring up [`embedded.authenticate`](overview#authentication)

Create a `bi-authenticate.tsx` page under `/next-auth-example/pages`. As long as your `invoke_url` is configured properly, this is the page that will be redirected to during an authorization flow. copy the following code snippet into that page.

```javascript
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Credential } from "@beyondidentity/bi-sdk-js";

const BIAuthenticate = () => {
  const [biAuthenticateResult, setBiAuthenticateResult] = useState("");

  useEffect(() => {
    // -- 1
    const authenticate = async () => {
      const BeyondIdentityEmbeddedSdk = await import("@beyondidentity/bi-sdk-js");
      let embedded = await BeyondIdentityEmbeddedSdk.Embedded.initialize();
      if (embedded.isAuthenticateUrl(window.location.href)) {
        // Only authenticate if the URL is a "bi-authenticate" URL
        let biAuthenticateUrl = window.location.href;
        // -- 2
        biAuthenticate(biAuthenticateUrl).then(redirectURL => {
          // -- 4
          window.location.href = redirectURL;
        }).catch(error => {
          setBiAuthenticateResult(error.toString());
        });
      }
    }
    authenticate().catch(console.error);
  }, []);

  // -- 3
  async function biAuthenticate(url: string): Promise<string> {
    const BeyondIdentityEmbeddedSdk = await import("@beyondidentity/bi-sdk-js");
    let embedded = await BeyondIdentityEmbeddedSdk.Embedded.initialize();

    // Display credentials so user can select one
    let credentials = await embedded.getCredentials();
    let promptText = credentials.map((credential, index) => {
      return `${index}: ${credential.identity.username}`;
    }).join("\n");
    let selectedIndex = parseInt(prompt(promptText, "index")!!);
    if (selectedIndex >= 0 && selectedIndex < credentials.length) {
      let selectedId = credentials[selectedIndex].id;
      // Perform authentication using selected id
      let result = await embedded.authenticate(url, selectedId);
      return Promise.resolve(result.redirectURL);
    } else {
      // This will fail in core as it won't match to any id
      return Promise.resolve("unknown_id");
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <div className="container">
        <div className="row">
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="sr-only"></span>
            </div>
          </div>
        </div>
        <div className="row">
          {
            biAuthenticateResult.length > 0 &&
            <div className="row row-cols-1 row-cols-md-1 mt-3">
              <div className="col">
                <code>
                  {JSON.stringify(biAuthenticateResult, null, 2)}
                </code>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default BIAuthenticate;
```

### What's happening here?

1. The `useEffect` is only called once on page load. In this function, we initialize the Beyond Identity SDK and use [`embedded.isAuthenticateUrl`](overview#authenticate-url-validation) to check if the current page that was redirected to is in fact a valid `bi-authenticate` URL.
2. If the URL is valid, we pull the URL using `window.location.href` and pass that directly into `biAuthenticate` in step 3.
3. `biAuthenticate` calls `embedded.authenticate` with a valid `bi-authenticate` URL. This function performs a challenge/response against a credential bound to your browser. Note that the callback in `embedded.authenticate` contains logic in order to prompt a user to select a credential if there is more than one.
4. Finally, the response of `embedded.authenticate` contains a `redirectURL`. Follow this redirectURL to complete the OAuth/OIDC flow.

## What does it look like?

Upon running the next auth example app and clicking on the sign in button, you'll see the provider you just added as shown in the image below. Clicking on that provider will go through an OAuth/OIDC that will result in fetching an id token that will log you in to the example app.

![image](https://user-images.githubusercontent.com/6578679/184046706-3f55f7f5-2484-4fe8-978d-575b66bfa86e.png)

