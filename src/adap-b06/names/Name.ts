import { Equality } from "../common/Equality";
import { Printable } from "../common/Printable";

export interface Name extends Printable, Equality {

    isEmpty(): boolean;
    
    getNoComponents(): number;

    getComponent(i: number): string;

    getDelimiterCharacter(): string;

    setComponent(i: number, c: string): Name;

    insert(i: number, c: string): Name;

    append(c: string): Name;

    remove(i: number): Name;

    concat(other: Name): Name;

}
