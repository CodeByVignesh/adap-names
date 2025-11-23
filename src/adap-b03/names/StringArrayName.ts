import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        this.components = [...source];
    }

    public clone(): Name {
        return new StringArrayName(this.components, this.delimiter);
    }

    public asString(delimiter: string = this.delimiter): string {
        if (delimiter.length !== 1) throw new Error("Delimiter must be a single character");
        return this.components.join(delimiter);
    }

    public asDataString(): string {
        const esc = (s: string) =>
            s
                .replace(new RegExp(`\\\\`, 'g'), ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                .replace(new RegExp(`[${escapeForCharClass(DEFAULT_DELIMITER)}]`, 'g'), ESCAPE_CHARACTER + DEFAULT_DELIMITER);
        return this.components.map(esc).join(DEFAULT_DELIMITER);
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        if (i < 0 || i >= this.components.length) throw new Error("Index out of bounds");
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        if (i < 0 || i >= this.components.length) throw new Error("Index out of bounds");
        this.components[i] = c;
    }

    public insert(i: number, c: string) {
        if (i < 0 || i > this.components.length) throw new Error("Index out of bounds");
        this.components.splice(i, 0, c);
    }

    public append(c: string) {
        this.components.push(c);
    }

    public remove(i: number) {
        if (i < 0 || i >= this.components.length) throw new Error("Index out of bounds");
        this.components.splice(i, 1);
    }
}

function escapeForCharClass(ch: string): string {
    return ch.replace(/[-\\^\]]/g, '\\$&');
}