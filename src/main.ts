import { FlightReader } from "./Readears/FlightReader";
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
      console.log(fligtReader.data);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }
};

document.addEventListener("DOMContentLoaded", initApp);
