import { Analyzer, Flight, FlightStatus } from "../types";
export class AvgAnalyzer implements Analyzer {
  static description: string = "Moyenne";
  constructor(public connexion: string, public flightList: Flight[]) {}

  private avg(array: Flight[], col: 2 | 3 | 4): number {
    const sums = array.reduce(
      (acc, curr) => {
        if (curr[1] === this.connexion) {
          acc.total += curr[col];
          acc.count++;
        }
        return acc;
      },
      {
        total: 0,
        count: 0,
      }
    );
    return Math.round(sums.total / sums.count);
  }

  private getPercentageOnTime(): number {
    const sums = this.flightList.reduce(
      (acc, curr) => {
        if (curr[1] === this.connexion) {
          if (curr[5] === FlightStatus.onTime) {
            acc.total++;
          }
          acc.count++;
        }
        return acc;
      },
      {
        total: 0,
        count: 0,
      }
    );
    return Math.round((sums.total / sums.count) * 100);
  }

  private getLastThreeFlight(): Flight[] {
    return this.flightList
      .filter((flight) => flight[1] === this.connexion)
      .sort((flightA, flightB) => flightB[0].getTime() - flightA[0].getTime())
      .slice(0, 3);
  }

  run(): string[] {
    return [
      `${this.connexion} a eu en moyenne ${this.avg(
        this.flightList,
        2
      )} passagers`,
      `${this.connexion} a duré en moyenne ${this.avg(
        this.flightList,
        3
      )} minutes`,
      `${this.connexion} a eu en moyenne une altitude ${this.avg(
        this.flightList,
        4
      )} mètres`,
      `Sur les trois derniers vols ${this.connexion} a eu en moyenne ${this.avg(
        this.getLastThreeFlight(),
        2
      )} passagers`,
      `Sur les trois derniers vols ${
        this.connexion
      } a duré en moyenne ${this.avg(this.getLastThreeFlight(), 3)} minutes`,
      `Sur les trois derniers vols ${
        this.connexion
      } a eu en moyenne une altitude ${this.avg(
        this.getLastThreeFlight(),
        4
      )} mètres`,
      `${
        this.connexion
      } est arrivé à l'heure ${this.getPercentageOnTime()} % du temps`,
    ];
  }
}
