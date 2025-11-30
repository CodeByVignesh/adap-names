import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        IllegalArgumentException.assert(this.state === FileState.CLOSED, "File must be closed before opening");
        this.state = FileState.OPEN;
    }

    public read(noBytes: number): Int8Array {
        IllegalArgumentException.assert(noBytes >= 0, "Number of bytes cannot be negative");
        IllegalArgumentException.assert(this.state === FileState.OPEN, "File must be open for reading");
        return new Int8Array(noBytes);
    }

    public close(): void {
        IllegalArgumentException.assert(this.state === FileState.OPEN, "File must be open before closing");
        this.state = FileState.CLOSED;
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}