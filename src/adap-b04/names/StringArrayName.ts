import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        IllegalArgumentException.assert(source !== null && source !== undefined, "Source cannot be null or undefined");
        super(delimiter);
        this.components = [...source];
    }

    public clone(): Name {
        return new StringArrayName(this.components, this.delimiter);
    }

    public asString(delimiter: string = this.delimiter): string {
        IllegalArgumentException.assert(
            delimiter !== null && delimiter !== undefined && delimiter.length === 1,
            "Delimiter must be a single character"
        );
        return this.components.join(delimiter);
    }

    public asDataString(): string {
        return this.components.map(c =>
            c.replace(/\\/g, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                .replace(new RegExp(DEFAULT_DELIMITER, 'g'), ESCAPE_CHARACTER + DEFAULT_DELIMITER)
        ).join(DEFAULT_DELIMITER);
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assert(i >= 0 && i < this.components.length, "Index out of bounds");
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        IllegalArgumentException.assert(i >= 0 && i < this.components.length, "Index out of bounds");
        IllegalArgumentException.assert(c !== null && c !== undefined, "Component cannot be null or undefined");
        this.components[i] = c;
    }

    public insert(i: number, c: string) {
        IllegalArgumentException.assert(i >= 0 && i <= this.components.length, "Index out of bounds for insert");
        IllegalArgumentException.assert(c !== null && c !== undefined, "Component cannot be null or undefined");
        this.components.splice(i, 0, c);
    }

    public append(c: string) {
        IllegalArgumentException.assert(c !== null && c !== undefined, "Component cannot be null or undefined");
        this.components.push(c);
    }

    public remove(i: number) {
        IllegalArgumentException.assert(i >= 0 && i < this.components.length, "Index out of bounds");
        this.components.splice(i, 1);
    }
}