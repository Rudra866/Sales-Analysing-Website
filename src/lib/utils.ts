import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const mediaRatios = {
    video: 16 / 9,
    image: 4 / 3,
    classicFilm: 3 / 2,
    square: 1,
    portrait: 2 / 3,
    instagram: 4 / 5,
    cinema: 21 / 9,
}
