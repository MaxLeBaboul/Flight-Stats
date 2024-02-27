export type Flight = [Date, string, number, number, number, FlightStatus];

export enum FlightStatus {
  onTime = "O",
  Cancelled = "C",
  Delayed = "D",
}

export interface Analyzer {
  connexion: string;
  flightList: Flight[];
  run(): string[];
}

export interface Printer {
  connexion: string;
  print(analysis: string[]): void;
}
