import { Time } from "@sapphire/time-utilities";

export function seconds(seconds: number): number {
	return seconds * Time.Second;
}

export function minutes(minutes: number): number {
	return minutes * Time.Minute;
}

export function hours(hours: number): number {
	return hours * Time.Hour;
}

export function days(days: number): number {
	return days * Time.Day;
}

export function months(months: number): number {
	return months * Time.Month;
}

export function years(years: number): number {
	return years * Time.Year;
}
