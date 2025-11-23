import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        this.name = source ?? "";
        this.noComponents = this.parseComponents().length;
    }

    public clone(): Name {
        return new StringName(this.name, this.delimiter);
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

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        const comps = this.parseComponents();
        if (i < 0 || i >= comps.length) throw new Error("Index out of bounds");
        return comps[i];
    }

    public setComponent(i: number, c: string) {
        const comps = this.parseComponents();
        if (i < 0 || i >= comps.length) throw new Error("Index out of bounds");
        comps[i] = c;
        this.setFromComponents(comps);
    }

    public insert(i: number, c: string) {
        const comps = this.parseComponents();
        if (i < 0 || i > comps.length) throw new Error("Index out of bounds");
        comps.splice(i, 0, c);
        this.setFromComponents(comps);
    }

    public append(c: string) {
        this.insert(this.getNoComponents(), c);
    }

    public remove(i: number) {
        const comps = this.parseComponents();
        if (i < 0 || i >= comps.length) throw new Error("Index out of bounds");
        comps.splice(i, 1);
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