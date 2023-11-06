import type { Preview } from "@storybook/react";
import { Title, Subtitle, Description, Primary, Controls, Stories } from '@storybook/blocks';
import "../src/stories/global.css"
import {ThemeProvider} from "../src/components/providers";
import shadcn from "./shadcn";

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
      theme: shadcn,
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
