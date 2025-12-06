import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { Exception } from "../common/Exception";

import { Name } from "../names/Name";
import type { Directory } from "./Directory";
import type { Link } from "./Link";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        this.doSetBaseName(bn);
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public findNodes(bn: string): Set<Node> {
        IllegalArgumentException.assert(bn !== null && bn !== undefined, "basename cannot be null or undefined");

        try {
            const result: Set<Node> = new Set<Node>();
            const visited: Set<Node> = new Set<Node>();

            const validateNode = (n: Node) => {
                const isRoot = n.getParentNode() === n;
                const base = n.getBaseName();
                // For non-root nodes basename must be non-empty
                if (!isRoot) {
                    InvalidStateException.assert(base.length > 0, "node basename must be non-empty");
                }
            };

            const walk = (n: Node) => {
                if (visited.has(n)) return;
                visited.add(n);

                validateNode(n);
                if (n.getBaseName() === bn) {
                    result.add(n);
                }

                const maybeDir = n as unknown as { getChildNodes?: () => Iterable<Node> };
                if (typeof maybeDir.getChildNodes === "function") {
                    for (const child of maybeDir.getChildNodes()) {
                        walk(child);
                    }
                }

                const maybeLink = n as unknown as { getTargetNode?: () => Node | null };
                if (typeof maybeLink.getTargetNode === "function") {
                    const target = maybeLink.getTargetNode();
                    if (target) walk(target);
                }
            };

            walk(this);
            return result;
        } catch (err) {
            if (err instanceof Exception) {
                throw new ServiceFailureException("findNodes failed", err);
            }
            throw err;
        }
    }

}
