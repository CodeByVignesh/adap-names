import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        IllegalArgumentException.assert(source !== null && source !== undefined, "Source cannot be null or undefined");
        super(delimiter);
        this.name = source;
        this.noComponents = this.parseComponents().length;
    }

    public clone(): Name {
        return new StringName(this.name, this.delimiter);
    }

    public asString(delimiter: string = this.delimiter): string {
        IllegalArgumentException.assert(
            delimiter !== null && delimiter !== undefined && delimiter.length === 1,
            "Delimiter must be a single character"
        );
        return this.parseComponents().join(delimiter);
    }

    public asDataString(): string {
        return this.parseComponents().map(c =>
            c.replace(/\\/g, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                .replace(new RegExp(DEFAULT_DELIMITER, 'g'), ESCAPE_CHARACTER + DEFAULT_DELIMITER)
        ).join(DEFAULT_DELIMITER);
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), "Index out of bounds");
        return this.parseComponents()[i];
    }

    public setComponent(i: number, c: string) {
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), "Index out of bounds");
        IllegalArgumentException.assert(c !== null && c !== undefined, "Component cannot be null or undefined");

        const comps = this.parseComponents();
        comps[i] = c;
        this.setFromComponents(comps);
    }

    public insert(i: number, c: string) {
        IllegalArgumentException.assert(i >= 0 && i <= this.getNoComponents(), "Index out of bounds for insert");
        IllegalArgumentException.assert(c !== null && c !== undefined, "Component cannot be null or undefined");

        const comps = this.parseComponents();
        comps.splice(i, 0, c);
        this.setFromComponents(comps);
    }

    public append(c: string) {
        IllegalArgumentException.assert(c !== null && c !== undefined, "Component cannot be null or undefined");
        this.insert(this.getNoComponents(), c);
    }

    public remove(i: number) {
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), "Index out of bounds");

        const comps = this.parseComponents();
        comps.splice(i, 1);
        this.setFromComponents(comps);
    }

    private parseComponents(): string[] {
        if (!this.name) return [];
        const result: string[] = [];
        let current = "";
        let escaped = false;

        for (const char of this.name) {
            if (escaped) {
                current += char;
                escaped = false;
            } else if (char === ESCAPE_CHARACTER) {
                escaped = true;
            } else if (char === this.delimiter) {
                result.push(current);
                current = "";
            } else {
                current += char;
            }
        }
        result.push(current);
        return result;
    }

    private setFromComponents(comps: string[]) {
        this.name = comps.map(c =>
            c.replace(/\\/g, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                .replace(new RegExp(`[${this.delimiter.replace(/[-\\^\]]/g, '\\$&')}]`, 'g'),
                    ESCAPE_CHARACTER + this.delimiter)
        ).join(this.delimiter);
        this.noComponents = comps.length;
    }
}