import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class Link extends Node {

    protected targetNode: Node | null = null;

    constructor(bn: string, pn: Directory, tn?: Node) {
        super(bn, pn);
        if (tn !== undefined) {
            this.targetNode = tn;
        }
    }

    public getTargetNode(): Node | null {
        return this.targetNode;
    }

    public setTargetNode(target: Node): void {
        IllegalArgumentException.assert(target !== null && target !== undefined, "Target node cannot be null or undefined");
        this.targetNode = target;
    }

    public getBaseName(): string {
        const target = this.ensureTargetNode(this.targetNode);
        return target.getBaseName();
    }

    public rename(bn: string): void {
        IllegalArgumentException.assert(bn !== null && bn !== undefined, "Base name cannot be null or undefined");
        const target = this.ensureTargetNode(this.targetNode);
        target.rename(bn);
    }

    protected ensureTargetNode(target: Node | null): Node {
        IllegalArgumentException.assert(target !== null && target !== undefined, "Target node must be set before use");
        return target as Node;
    }
}