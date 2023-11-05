import type { Preview } from "@storybook/react";
import { Title, Subtitle, Description, Primary, Controls, Stories } from '@storybook/blocks';
import {themes} from "@storybook/theming";
import {ThemeProvider} from "../src/components/providers";

const preview: Preview = {
  decorators: [
    (Story) => (
        <ThemeProvider defaultTheme={"dark"}>
          <Story/>
        </ThemeProvider>
    )
  ],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: themes.dark,
      page: () => (
       <>
          <Title/>
          <Subtitle/>
          <Description/>
          <Primary/>
          <Controls/>
          <Stories/>
        </>
      ),
    },
  },
};

export default preview;
