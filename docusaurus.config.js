import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Playgrounds.dev Docs',
  tagline: 'Documentation for Playgrounds.dev',
  favicon: 'img/favicon.ico',

  headTags: [
    { tagName: 'link', attributes: { rel: 'apple-touch-icon', sizes: '180x180', href: '/img/apple-touch-icon.png' } },
    { tagName: 'link', attributes: { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/img/icon-192.png' } },
    { tagName: 'link', attributes: { rel: 'manifest', href: '/site.webmanifest' } },
  ],

  future: {
    v4: true,
  },

  url: 'https://docs.playgrounds.dev',
  baseUrl: '/',

  organizationName: 'phoenix-playgrounds',
  projectName: 'docs',

  onBrokenLinks: 'throw',
  trailingSlash: true,

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'uk'],
    localeConfigs: {
      en: { label: 'English' },
      uk: { label: 'Українська' },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],




  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      metadata: [
        { name: 'description', content: 'Official documentation for Playgrounds.dev — instant cloud environments powered by Docker.' },
        { name: 'keywords', content: 'playgrounds.dev, documentation, docs, cloud environments, docker' },
      ],
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'Playgrounds.dev',
        logo: {
          alt: 'Playgrounds.dev',
          src: 'img/logo.png',
        },
        items: [
          {
            href: 'https://playgrounds.dev',
            label: 'Home',
            position: 'left',
          },
          {
            to: '/',
            label: 'Docs',
            position: 'left',
            activeBaseRegex: '^/$|^/(?!blog)',
          },
          {
            href: 'https://blog.playgrounds.dev',
            label: 'Blog',
            position: 'left',
          },
          {
            href: 'https://github.com/phoenix-playgrounds',
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `© ${new Date().getFullYear()} Playgrounds.dev — All rights reserved.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
