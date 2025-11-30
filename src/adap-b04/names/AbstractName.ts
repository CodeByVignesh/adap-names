import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        IllegalArgumentException.assert(
            delimiter !== null && delimiter !== undefined && delimiter.length === 1,
            "Delimiter must be a single character"
        );
        this.delimiter = delimiter;
    }

    public abstract clone(): Name;
    public abstract asString(delimiter?: string): string;
    public abstract asDataString(): string;
    public abstract getNoComponents(): number;
    public abstract getComponent(i: number): string;
    public abstract setComponent(i: number, c: string): void;
    public abstract insert(i: number, c: string): void;
    public abstract append(c: string): void;
    public abstract remove(i: number): void;

    public toString(): string {
        return this.asDataString();
    }

    public isEqual(other: Name): boolean {
        IllegalArgumentException.assert(other !== null && other !== undefined, "Other name cannot be null or undefined");

        if (this.getNoComponents() !== other.getNoComponents()) return false;
        if (this.delimiter !== other.getDelimiterCharacter()) return false;

        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) return false;
        }
        return true;
    }

    public getHashCode(): number {
        let hash = 0;
        const s = this.asDataString();
        for (let i = 0; i < s.length; i++) {
            hash = ((hash << 5) - hash) + s.charCodeAt(i);
            hash |= 0;
        }
        return hash;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public concat(other: Name): void {
        IllegalArgumentException.assert(other !== null && other !== undefined, "Cannot concat null or undefined");

        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

}