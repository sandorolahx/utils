export class ExpansionModel<T = any>{
    private _isAllExpanded = false;
    private _exceptItems = new Set<T | T[keyof T]>();
    private _dataCount: number = null;
    private mappedItem: (item: T) => T | T[keyof T];

    constructor(expansionKey: keyof T = null) {
        this.mappedItem = (item: T) => expansionKey ? item?.[expansionKey] : item;
    }

    public get isAllExpanded(): boolean {
        return this._isAllExpanded && !this._exceptItems.size;
    }

    public get isAllCollapsed(): boolean {
        return !this._isAllExpanded && !this._exceptItems.size;
    }

    public get isPartialExpanded(): boolean {
        return !!this._exceptItems.size;
    }

    public isItemExpanded(item: T): boolean {
        const mappedItem = this.mappedItem(item);

        return this._isAllExpanded && !this._exceptItems.has(mappedItem) ||
            !this._isAllExpanded && this._exceptItems.has(mappedItem);
    }

    public toggleAll(): void {
        if (this.isAllExpanded || this.isPartialExpanded) {
            this.collapseAll();
        } else {
            this.expandAll();
        }
    }

    public expandAll(): void {
        this._isAllExpanded = true;
        this._exceptItems.clear();
    }

    public collapseAll(): void {
        this._isAllExpanded = false;
        this._exceptItems.clear();
    }

    public toggleItem(item: T): void {
        if (this.isItemExpanded(item)) {
            this.collapseItem(item);
        } else {
            this.expandItem(item);
        }
    }

    public expandItem(item: T): void {
        const mappedItem = this.mappedItem(item);

        if (this._isAllExpanded) {
            this._exceptItems.delete(mappedItem);
        } else {
            this._exceptItems.add(mappedItem);
        }
    }

    public expandItems(items: T[]): void {
        (items || []).forEach((item) => this.expandItem(item));
    }

    public collapseItem(item: T): void {
        const mappedItem = this.mappedItem(item);

        if (this._isAllExpanded) {
            this._exceptItems.add(mappedItem);
        } else {
            this._exceptItems.delete(mappedItem);
        }

        if (this._isAllExpanded && this._exceptItems.size === this._dataCount) {
            this.collapseAll();
        }
    }

    public collapseItems(items: T[]): void {
        (items || []).forEach((item) => this.collapseItem(item));
    }

    public setDataCount(value: number): void {
        this._dataCount = value;
    }
}
