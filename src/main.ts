import { AvgAnalyzer } from "./Analyzers/AvgAnalyzer";
import { MinMaxAnalyzer } from "./Analyzers/MinMaxAnalyzer";
import { DOMTemplate } from "./DOMTemplate";
import { HTMLPrinter } from "./Printers/HTMLPrinter";
import { PDFPrinter } from "./Printers/PDFPrinter";
import { FlightReader } from "./Readears/FlightReader";
import { Report } from "./Report";
import img from "./assets/flight.svg";

export const analyzerLookup = {
  [AvgAnalyzer.name]: AvgAnalyzer,
  [MinMaxAnalyzer.name]: MinMaxAnalyzer,
};
export const printerLookup = {
  [HTMLPrinter.name]: HTMLPrinter,
  [PDFPrinter.name]: PDFPrinter,
};
const initApp = () => {
  //afficher l'images
  document.querySelector("img")!.src = img;

  //envoie des fichiers
  const form = document.querySelector("form")!;

  form.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();
    try {
      const files = document.querySelector("input")?.files!;
      const file = files[0];

      if (files.length !== 1 || file.type !== "text/csv") {
        throw new Error("Vous devez envoyer un seul fichier au format CSV");
      }

      readFlights(file);
    } catch (error) {
      if (error instanceof Error) {
        DOMTemplate.instance.renderAlert(error.message);
        DOMTemplate.instance.clearTemplate();
      }
    }
  });

  async function readFlights(file: File): Promise<void> {
    const fligtReader = new FlightReader(file);
    try {
      await fligtReader.read();
      const flightList = fligtReader.data;

      const [selectConnexion, selectAnalyzer, selectPrinter] =
        DOMTemplate.instance.renderTemplate(flightList);
      DOMTemplate.instance.btn?.addEventListener("click", () => {
        const connexion = selectConnexion.value;
        const analyzer = selectAnalyzer.value;
        const printer = selectPrinter.value;
        const report = new Report(
          new analyzerLookup[analyzer](connexion, flightList),
          new printerLookup[printer](connexion)
        );
        report.generate();
      });
    } catch (error) {
      if (error instanceof Error) {
        DOMTemplate.instance.renderAlert(error.message);
        DOMTemplate.instance.clearTemplate();
      }
    }
  }
};

document.addEventListener("DOMContentLoaded", initApp);
