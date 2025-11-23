import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        if (delimiter !== undefined && delimiter.length !== 1) {
            throw new Error("Delimiter must be a single character");
        }
        this.delimiter = delimiter;
    }

    public abstract clone(): Name;

    public abstract asString(delimiter?: string): string;

    public toString(): string {
        return this.asDataString();
    }

    public abstract asDataString(): string;

    public isEqual(other: Name): boolean {
        if (this.getNoComponents() !== other.getNoComponents()) {
            return false;
        }
        if (this.getDelimiterCharacter() !== other.getDelimiterCharacter()) {
            return false;
        }
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }
        return true;
    }

    public getHashCode(): number {
        let hash = 0;
        const s = this.asDataString();
        for (let i = 0; i < s.length; i++) {
            const chr = s.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public abstract getNoComponents(): number;

    public abstract getComponent(i: number): string;
    public abstract setComponent(i: number, c: string): void;

    public abstract insert(i: number, c: string): void;
    public abstract append(c: string): void;
    public abstract remove(i: number): void;

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

}