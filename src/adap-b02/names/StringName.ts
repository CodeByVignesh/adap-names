import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        if (delimiter !== undefined) {
            if (delimiter.length !== 1) throw new Error("Delimiter must be a single character");
            this.delimiter = delimiter;
        }
        this.name = source ?? "";
        this.noComponents = this.parseComponents().length;
    }

    public asString(delimiter: string = this.delimiter): string {
        if (delimiter.length !== 1) throw new Error("Delimiter must be a single character");
        return this.parseComponents().join(delimiter);
    }

    public asDataString(): string {
        const comps = this.parseComponents();
        const esc = (s: string) =>
            s
                .replace(/\\/g, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                .replace(new RegExp(`[${escapeForCharClass(DEFAULT_DELIMITER)}]`, 'g'), ESCAPE_CHARACTER + DEFAULT_DELIMITER);
        return comps.map(esc).join(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(x: number): string {
        const comps = this.parseComponents();
        if (x < 0 || x >= comps.length) throw new Error("Index out of bounds");
        return comps[x];
    }

    public setComponent(n: number, c: string): void {
        const comps = this.parseComponents();
        if (n < 0 || n >= comps.length) throw new Error("Index out of bounds");
        comps[n] = c;
        this.setFromComponents(comps);
    }

    public insert(n: number, c: string): void {
        const comps = this.parseComponents();
        if (n < 0 || n > comps.length) throw new Error("Index out of bounds");
        comps.splice(n, 0, c);
        this.setFromComponents(comps);
    }

    public append(c: string): void {
        this.insert(this.getNoComponents(), c);
    }

    public remove(n: number): void {
        const comps = this.parseComponents();
        if (n < 0 || n >= comps.length) throw new Error("Index out of bounds");
        comps.splice(n, 1);
        this.setFromComponents(comps);
    }

    public concat(other: Name): void {
        const comps = this.parseComponents();
        for (let i = 0; i < other.getNoComponents(); i++) {
            comps.push(other.getComponent(i));
        }
        this.setFromComponents(comps);
    }

    private parseComponents(): string[] {
        const s = this.name;
        const delim = this.delimiter;
        const esc = ESCAPE_CHARACTER;
        if (s.length === 0) return [];
        const out: string[] = [];
        let cur = "";
        let escapeNext = false;
        for (let i = 0; i < s.length; i++) {
            const ch = s[i];
            if (escapeNext) {
                cur += ch;
                escapeNext = false;
            } else if (ch === esc) {
                escapeNext = true;
            } else if (ch === delim) {
                out.push(cur);
                cur = "";
            } else {
                cur += ch;
            }
        }
        out.push(cur);
        return out;
    }

    private setFromComponents(comps: string[]) {
        const delim = this.delimiter;
        const esc = ESCAPE_CHARACTER;
        const mask = (s: string) => s
            .replace(/\\/g, esc + esc)
            .replace(new RegExp(`[${escapeForCharClass(delim)}]`, 'g'), esc + delim);
        this.name = comps.map(mask).join(delim);
        this.noComponents = comps.length;
    }
}

function escapeForCharClass(ch: string): string {
    return ch.replace(/[-\\^\]]/g, '\\$&');
}