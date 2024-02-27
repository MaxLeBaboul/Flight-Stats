import { AvgAnalyzer } from "./Analyzers/AvgAnalyzer";
import { MinMaxAnalyzer } from "./Analyzers/MinMaxAnalyzer";
import { HTMLPrinter } from "./Printers/HTMLPrinter";
import { PDFPrinter } from "./Printers/PDFPrinter";
import { FlightReader } from "./Readears/FlightReader";
import { Report } from "./Report";
import img from "./assets/flight.svg";

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
        console.log(error.message);
      }
    }
  });

  async function readFlights(file: File): Promise<void> {
    const fligtReader = new FlightReader(file);
    try {
      await fligtReader.read();
      const flightList = fligtReader.data;
      const avgAnalyzer = new AvgAnalyzer("Paris-Madrid", flightList);
      const minMaxAnalyzer = new MinMaxAnalyzer("Paris-Madrid", flightList);

      const htmlPrinter = new HTMLPrinter("Paris-Madrid");
      const pdfPrinter = new PDFPrinter("Paris-Madrid");

      const report1 = new Report(avgAnalyzer, htmlPrinter);
      const report2 = new Report(minMaxAnalyzer, pdfPrinter);
      report1.generate();
      report2.generate();
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }
};

document.addEventListener("DOMContentLoaded", initApp);
