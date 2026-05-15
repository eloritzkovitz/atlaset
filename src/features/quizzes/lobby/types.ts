/** Represents an item in the quizzes lobby. */
export type LobbyCardItem = {
  key: string;
  route: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  muted: boolean;
  group?: "primary" | "secondary";
};
