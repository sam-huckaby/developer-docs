---
title: Integrate With Auth0
sidebar_position: 2
---

This guide describes how to configure Auth0 to delegate to Beyond Identity for authentication during an OAuth2 authorization flow.

## Prerequisites

- [Integrate With Auth0](/guides/sso-integrations/integrate-with-auth0)
- [React Native SDK Overview](overview)

Before calling [`Embedded.authenticate`](overview#authentication), we must [Authorize With Auth0](#authorize-with-auth0).

## Authorize With Auth0

![Integrate With Auth0 Flowchart](../screenshots/Integrate%20With%20Auth0%20Flowchart.png)

### Using an SDK

See Auth0's [Developer Site](https://auth0.com/docs/quickstart/native) for the latest React Native SDKs or Widgets.

Note: At this time, there is no way to intercept the first URL to authenticate with Beyond Identity, so we recommend [using the Web](#using-the-web).

### Using the Web

Pick a webview library that follows the best practices set out in [RFC 8252 - OAuth 2.0 for Native Apps](https://tools.ietf.org/html/rfc8252). The library should use `SFAuthenticationSession` and `SFSafariViewController` on iOS and [Custom Tabs](https://developer.chrome.com/multidevice/android/customtabs) on Android for authorization requests. `UIWebView` and `WKWebView` on iOS and `WebView` on Android are explicitly _not_ supported due to the security and usability reasons explained in [Section 8.12 of RFC 8252](https://tools.ietf.org/html/rfc8252#section-8.12). For these reasons, unfortunately, the [react-native-community/react-native-webview](https://github.com/react-native-community/react-native-webview) is _not_ recommended. The below examples will use [InAppBrowser](https://github.com/proyecto26/react-native-inappbrowser):

- Step 1: Configuring the Authenticator Config

Make sure the [Authenticator Config](/docs/v1/platform-overview/authenticator-config#embedded) in the Beyond Identity Console is set to type `Embedded` and that the Invoke URL points to your application with either an App Scheme or a Universal Link.

- Step 2: Auth0 Authorize URL

To start the authorization flow, build a `CustomTabsIntent` or `ASWebAuthenticationSession`, and load the OAuth2 authorization request URL provided by [Auth0](https://auth0.com/docs/api/authentication#authorization-code-flow-with-pkce). Make sure whichever webview you use shares cookies and other browsing data between the authentication session. The below example sets `ephemeralWebSession` to false to enable cookie re-use on iOS.

```javascript
if (await InAppBrowser.isAvailable()) {
  let response = await InAppBrowser.openAuth(auth0AuthUrl, 'yourScheme://', {
    ephemeralWebSession: false,
  });
}
```

- Step 3: Invoke URL

During the first web session, a URL with the invoke URL scheme should be returned from Auth0.
Call `Embedded.authenticate` with this url. You can confirm the validity of the URL with `Embedded.isAuthenticateUrl`.

```javascript
if (await InAppBrowser.isAvailable()) {
  const response = await InAppBrowser.openAuth(auth0AuthUrl, 'yourScheme://', {
    ephemeralWebSession: false,
  });

  if (await Embedded.isAuthenticateUrl(response.url)) {
    const authResponse = await Embedded.authenticate(
      response.url,
      selectedCredentialId
    );
  }
}
```

- Step 4: Redirect URL

A `redirectURL` is returned from a successful authenticate response that needs to be resolved by launching another web session to complete the initial OAuth flow. On completion of the second web session, another `redirectURL` will be returned that contains an authorization code that can be used to exchange for an ID token.

```javascript
if (await Embedded.isAuthenticateUrl(response.url)) {
  const authResponse = await Embedded.authenticate(
    response.url,
    selectedCredentialId
  );
  if (await InAppBrowser.isAvailable()) {
    const secondWebResponse = await InAppBrowser.openAuth(
      authResponse.redirectURL,
      'yourScheme://',
      { ephemeralWebSession: false }
    );

    // This URL contains authorization code and state parameters
    // Exchange the authorization code for an id_token using Auth0's token endpoint.
    const url = secondWebResponse.url;
  }
}
```

#### Full Example

```javascript
if (await InAppBrowser.isAvailable()) {
  const response = await InAppBrowser.openAuth(auth0AuthUrl, 'yourScheme://', {
    ephemeralWebSession: false,
  });

  if (await Embedded.isAuthenticateUrl(response.url)) {
    const selectedCredentialId = await presentCredentialSelection();
    const authResponse = await Embedded.authenticate(
      response.url,
      selectedCredentialId
    );
    if (await InAppBrowser.isAvailable()) {
      const secondWebResponse = await InAppBrowser.openAuth(
        authResponse.redirectURL,
        'yourScheme://',
        { ephemeralWebSession: false }
      );

      // This URL contains authorization code and state parameters
      // Exchange the authorization code for an id_token using Auth0's token endpoint.
      const url = secondWebResponse.url;
    }
  }
}

function presentCredentialSelection(): selectedCredentialId {
  // Where you can perform some logic here to select a credential, or
  // present UI to a user to enable them to select a credential.
}
```
