
import { create } from '@storybook/theming/create';

export default create({
    base: 'dark',
    brandTitle: 'Custom Storybook Theme',
    brandUrl: 'https://codeallergy.dev',
    brandImage: '/images/logo.png',
    brandTarget: '_self',
    colorPrimary: "hsl(210 40% 98%)",
    colorSecondary: "hsl(217.2 32.6% 17.5%)",
    // textMutedColor: "hsl(217.2 32.6% 17.5%)",
    textColor: "#F8FAFC",
    textMutedColor: "hsl(217, 14%, 41%)",

    appBg: "#020817",
    appContentBg: "#020817",

    textInverseColor: "#e70909",

    appBorderColor: '#1e293b',
    appBorderRadius: 4,

    barTextColor: '#9E9E9E',
    barBg: "#020817",
    barSelectedColor: '#585C6D', //todo

    inputBg: "hsl(217.2 32.6% 17.5%)",
    inputBorder: '#1e293b',
    inputTextColor: '#FFFFFF', //todo
    inputBorderRadius: 4,

    booleanSelectedBg: "", //todo
    booleanBg: "", //todo
    buttonBg: "#1E293B", // todo
    buttonBorder: "#1e293b",
    barHoverColor: "#ef0808",
});