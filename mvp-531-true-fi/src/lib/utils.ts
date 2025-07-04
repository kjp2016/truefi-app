import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfigFile from '../../tailwind.config'

export const tailwindConfig = () => {
    return resolveConfig(tailwindConfigFile)
}


export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const hexToRGB = (h: string) => {
    let r: number | string = 0;
    let g: number | string = 0;
    let b: number | string = 0;
    if (h.length === 4) {
        r = `0x${h[1]}${h[1]}`;
        g = `0x${h[2]}${h[2]}`;
        b = `0x${h[3]}${h[3]}`;
    } else if (h.length === 7) {
        r = `0x${h[1]}${h[2]}`;
        g = `0x${h[3]}${h[4]}`;
        b = `0x${h[5]}${h[6]}`;
    }
    return `${+r},${+g},${+b}`;
};

export const formatValue = (value: number) => Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumSignificantDigits: 3,
    notation: 'compact',
}).format(value);