import commonEn from "../i18n/locales/en/common.json";
import commonRu from "../i18n/locales/ru/common.json";

import headerMainEn from "../layouts/MainLayout/i18n/locales/en/headerMain.json";
import headerMainRu from "../layouts/MainLayout/i18n/locales/ru/headerMain.json";

import navigationMenuEn from "../layouts/MainLayout/i18n/locales/en/navigationMenu.json";
import navigationMenuRu from "../layouts/MainLayout/i18n/locales/ru/navigationMenu.json";

import loginFormEn from "../modules/auth/i18n/locales/en/loginForm.json";
import loginFormRu from "../modules/auth/i18n/locales/ru/loginForm.json";

import signUpFormEn from "../modules/auth/i18n/locales/en/signUpForm.json";
import signUpFormRu from "../modules/auth/i18n/locales/ru/signUpForm.json";

import accountPageEn from "../modules/account/i18n/locales/en/accountPage.json";
import accountPageRu from "../modules/account/i18n/locales/ru/accountPage.json";

const resources = {
  en: {
    translation: {
      common: commonEn,
      // MainLayout:
      headerMain: headerMainEn,
      navigationMenu: navigationMenuEn,
      // MODULE auth:
      loginForm: loginFormEn,
      signUpForm: signUpFormEn,
      // MODULE account:
      accountPage: accountPageEn,
    },
  },
  ru: {
    translation: {
      common: commonRu,
      // MainLayout:
      headerMain: headerMainRu,
      navigationMenu: navigationMenuRu,
      // MODULE auth:
      loginForm: loginFormRu,
      signUpForm: signUpFormRu,
      // MODULE account:
      accountPage: accountPageRu,
    },
  },
};

export default resources;
