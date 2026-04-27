export type AppRole = "medical-officer" | "student" | "admin";

export interface AppSession {
  role: AppRole;
  userId: string;
  displayName: string;
  email?: string | null;
  uniqueStudentId?: string | null;
  sessionToken?: string | null;
}

const SESSION_KEY = "student-health-session";

export const getSession = (): AppSession | null => {
  const raw = localStorage.getItem(SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AppSession;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
};

export const setSession = (session: AppSession) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};
