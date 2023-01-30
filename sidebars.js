/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // Generating sidebar manually rather than `autogenerated` because can't
  // find a way to add links to the sidebar with autogeneration.
  mySidebar: [
    'introduction',
    'try-it-out',
    'getting-started',
    'using-bi-for-auth',
    {
      type: 'category',
      label: 'Workflows',
      items: [
        {
          type: 'autogenerated',
          dirName: 'workflows',
        },
      ],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Platform Overview',
      items: [
        {
          type: 'autogenerated',
          dirName: 'platform-overview',
        },
      ],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'SDKs',
      items: [
        'workflows/bind-passkey',
        'workflows/authentication',
        {
          type: 'category',
          label: 'Javascript SDK',
          items: [
            {
              type: 'autogenerated',
              dirName: 'sdks/javascript-sdk',
            },
            {
              type: 'link',
              label: 'Documentation',
              href: 'https://gobeyondidentity.github.io/bi-sdk-js/',
            },
          ],
          collapsed: true,
        },
        {
          type: 'category',
          label: 'Kotlin SDK',
          items: [
            {
              type: 'autogenerated',
              dirName: 'sdks/kotlin-sdk',
            },
            {
              type: 'link',
              label: 'Documentation',
              href: 'https://gobeyondidentity.github.io/bi-sdk-android/',
            },
          ],
          collapsed: true,
        },
        {
          type: 'category',
          label: 'Swift SDK',
          items: [
            {
              type: 'autogenerated',
              dirName: 'sdks/swift-sdk',
            },
            {
              type: 'link',
              label: 'Documentation',
              href: 'https://gobeyondidentity.github.io/bi-sdk-swift/',
            },
          ],
          collapsed: true,
        },
        {
          type: 'category',
          label: 'Flutter SDK',
          items: [
            {
              type: 'autogenerated',
              dirName: 'sdks/flutter-sdk',
            },
            {
              type: 'link',
              label: 'Documentation',
              href: 'https://gobeyondidentity.github.io/bi-sdk-flutter/',
            },
          ],
          collapsed: true,
        },
        {
          type: 'category',
          label: 'React Native SDK',
          items: [
            {
              type: 'autogenerated',
              dirName: 'sdks/react-native-sdk',
            },
            {
              type: 'link',
              label: 'Documentation',
              href: 'https://gobeyondidentity.github.io/bi-sdk-react-native/',
            },
          ],
          collapsed: true,
        },
      ],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Beyond Identity API',
      items: [
        {
          type: 'autogenerated',
          dirName: 'apis',
        },
      ],
    },
    {
      type: 'category',
      label: 'SSO Integration Guides',
      collapsed: false,
      items: [
        {
          type: 'link',
          label: 'Integrate with Auth0 ⧉',
          href: '/guides/sso-integrations/integrate-with-auth0',
        },
        {
          type: 'link',
          label: 'Integrate with Okta ⧉',
          href: '/guides/sso-integrations/integrate-with-okta',
        },
        {
          type: 'link',
          label: 'Integrate with KeyCloak ⧉',
          href: '/guides/sso-integrations/integrate-with-keycloak',
        },
        {
          type: 'link',
          label: 'Integrate with Curity ⧉',
          href: '/guides/sso-integrations/integrate-with-curity',
        },
        {
          type: 'link',
          label: 'Integrate with Azure AD B2C ⧉',
          href: '/guides/sso-integrations/integrate-with-azureb2c',
        },
        {
          type: 'link',
          label: 'Integrate with Beyond Identity Workforce ⧉',
          href: '/guides/sso-integrations/integrate-with-bi-workforce',
        },
        {
          type: 'link',
          label: 'Integrate with AWS Cognito ⧉',
          href: '/guides/sso-integrations/integrate-with-cognito',
        },
      ],
    },
    {
      type: 'category',
      label: 'Other useful links',
      collapsed: false,
      items: [
        {
          type: 'link',
          label: 'Support - Slack',
          href: 'https://join.slack.com/t/byndid/shared_invite/zt-1anns8n83-NQX4JvW7coi9dksADxgeBQ',
        },
        {
          type: 'link',
          label: 'Service Status Page',
          href: 'https://status.beyondidentity.com',
        },
      ],
    },
  ],
};

module.exports = sidebars;
