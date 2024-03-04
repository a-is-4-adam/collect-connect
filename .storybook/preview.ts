import type { Preview } from "@storybook/react";
import "../app/tailwind.css";
import {
  withRouter,
  reactRouterParameters,
} from "storybook-addon-react-router-v6";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // reactRouter: reactRouterParameters({
    //   routing: { path: "/" },
    // }),
  },
  // decorators: [withRouter],
};

export default preview;
