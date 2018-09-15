export interface Actionable {
  doAction(): void;
  getActionLabel(): string;
}
