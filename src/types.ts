export type Flight = [Date, string, number, number, number];

export enum FlightStatus {
  onTime = "O",
  Cancelled = "C",
  Delayed = "D",
}
