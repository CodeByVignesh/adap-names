import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        this.components = [...source];
        if (delimiter !== undefined) {
            if (delimiter.length !== 1) throw new Error("Delimiter must be a single character");
            this.delimiter = delimiter;
        }
    }

    public asString(delimiter: string = this.delimiter): string {
        if (delimiter.length !== 1) throw new Error("Delimiter must be a single character");
        return this.components.join(delimiter);
    }

    public asDataString(): string {
        // Machine-readable string using default special characters
        const esc = (s: string) =>
            s
                .replace(new RegExp(`\\\\`, 'g'), ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                .replace(new RegExp(`[${escapeForCharClass(DEFAULT_DELIMITER)}]`, 'g'), ESCAPE_CHARACTER + DEFAULT_DELIMITER);
        return this.components.map(esc).join(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        if (i < 0 || i >= this.components.length) throw new Error("Index out of bounds");
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        if (i < 0 || i >= this.components.length) throw new Error("Index out of bounds");
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        if (i < 0 || i > this.components.length) throw new Error("Index out of bounds");
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        if (i < 0 || i >= this.components.length) throw new Error("Index out of bounds");
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.components.push(other.getComponent(i));
        }
    }

}

function escapeForCharClass(ch: string): string {
    return ch.replace(/[-\\^\]]/g, '\\$&');
}