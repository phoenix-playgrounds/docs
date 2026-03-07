/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    'introduction',
    {
      type: 'category',
      label: 'Core Concepts',
      collapsed: false,
      items: [
        'core-concepts/playroom',
        'core-concepts/playzone',
        'core-concepts/playspec',
        'core-concepts/playground',
      ],
    },
    {
      type: 'category',
      label: 'Launch',
      items: [
        'launch/launch',
        'launch/stargate',
        'launch/my-fleet',
        'launch/templates',
      ],
    },
    {
      type: 'category',
      label: 'Services',
      items: [
        'services/overview',
        'services/environment-variables',
        'services/networking',
        'services/advanced',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/overview',
        'api/playrooms',
        'api/playzones',
        'api/playspecs',
        'api/playgrounds',
        'api/launch',
        'api/templates',
      ],
    },
  ],
};

export default sidebars;
