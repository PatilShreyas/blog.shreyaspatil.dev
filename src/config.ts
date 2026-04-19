export const SITE = {
  website: "https://blog.shreyaspatil.dev/",
  author: "Shreyas Patil",
  profile: "https://shreyaspatil.dev/",
  desc: "Senior Android Engineer @ Deliveroo. Google Developer Expert for Android. Writing about Android, Kotlin, and AI.",
  title: "Shreyas Patil's Blog",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 50,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/shreyaspatil/blogsite/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Kolkata", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
