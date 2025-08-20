// shared/layouts/main-layout/config.ts

export type PagePath = "/" | "/trade" | "/store" | "/p2p" | "/about";

export interface PageConfig {
  useContainer: boolean;
  headerVariant: "default" | "compact" | "full";
  footerVariant?: "default" | "compact" | "full";
}

export const PAGE_CONFIGS: Record<PagePath, PageConfig> = {
  "/": {
    useContainer: true,
    headerVariant: "default",
    footerVariant: "default",
  },
  "/trade": {
    useContainer: false,
    headerVariant: "full",
    footerVariant: "full",
  },
  "/store": {
    useContainer: false,
    headerVariant: "full",
    footerVariant: "full",
  },
  "/p2p": {
    useContainer: true,
    headerVariant: "compact",
    footerVariant: "compact",
  },
  "/about": {
    useContainer: true,
    headerVariant: "default",
    footerVariant: "default",
  },
} as const;

// Функція для знаходження найкращого співпадіння
export const getPageConfig = (pathname: string): PageConfig => {
  // Спочатку перевіряємо точне співпадіння
  if (PAGE_CONFIGS[pathname as PagePath]) {
    return PAGE_CONFIGS[pathname as PagePath];
  }

  // Потім шукаємо по префіксу (для /trade/something -> /trade)
  const matchingPath = Object.keys(PAGE_CONFIGS).find((path) => {
    if (path === "/") return false; // Головну не враховуємо для префіксів
    return pathname.startsWith(path);
  });

  if (matchingPath) {
    return PAGE_CONFIGS[matchingPath as PagePath];
  }

  // Якщо нічого не знайшли - дефолт
  return PAGE_CONFIGS["/"];
};
