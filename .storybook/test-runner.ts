
import type { TestRunnerConfig } from '@storybook/test-runner';

// SNAPSHOT TESTS:
// todo - get this working properly later.
// const config: TestRunnerConfig = {
//   async postRender(page, context) {
//     // the #storybook-root element wraps each story
//     const elementHandler = await page.$('#storybook-root');
//     const innerHTML = await elementHandler!.innerHTML();
//     expect(innerHTML).toMatchSnapshot();
//   },
// };

// export default config;