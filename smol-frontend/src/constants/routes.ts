export const ROUTES = {
  USER: {
    LOGIN: "/login",
    SIGNUP: "/signup",
    LOGOUT: "/logout",
    REFRESH: "/refresh",
    ME: "/me",
  },
  URL: {
    CREATE: "/url",
    FETCH: "/urls",
    UPDATE: (id: string) => `/url/${id}`,
    DELETE: (id: string) => `/url/${id}`,
  },
  SOCIALS: {
    INSTAGRAM: "",
    YOUTUBE: "",
    LINKEDIN: "",
  },
};
