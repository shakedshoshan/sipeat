import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'he', 'ru', 'ar'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is a string and is one of the supported locales
  const safeLocale = (locale && locales.includes(locale as Locale)) ? locale : 'en';
  
  return {
    locale: safeLocale,
    messages: (await import(`./messages/${safeLocale}.json`)).default,
  };
}); 