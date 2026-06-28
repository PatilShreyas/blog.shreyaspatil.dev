export const SITE = {
  website: import.meta.env.SITE_URL || "https://blog.shreyaspatil.dev/",
  author: "Shreyas Patil",
  profile: "https://shreyaspatil.dev/",
  desc: "Senior Android Engineer @ Deliveroo. Google Developer Expert for Android. Writing about Android, Kotlin, and AI.",
  title: "Shreyas Patil's Blog",
  ogImage: "og.png",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 20,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: false,
  showBackButton: false, // show back button in post detail
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/PatilShreyas/blog.shreyaspatil.dev/edit/main/",
  },
  googleAnalyticsId: "G-FNY48L5LDH", // Add your GA Tracking ID here (e.g. G-XXXXXXXXXX)
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Kolkata", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
  themeColors: {
    light: "#f9f8f6",
    dark: "#1c1917",
  },
} as const;
