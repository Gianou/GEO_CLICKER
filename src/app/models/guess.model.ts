import { Region } from "./region.model";

export type Guess = {
    regionToFind: Region,
    guessedRegion: Region,
    isCorrect: boolean
}