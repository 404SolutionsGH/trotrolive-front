import { atom } from "jotai";

export const stationsAtom = atom<StationsApiResponse['results']>([]);
