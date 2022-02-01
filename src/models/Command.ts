export interface Command {
  command: string;
  title: string;
  category?: string;
  icon?: {
    light: string;
    dark: string;
  }
}