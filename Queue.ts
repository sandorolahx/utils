interface IQueueItem {
    promise: () => Promise<void>;
    resolve: (value?: void | PromiseLike<void>) => void;
    reject: () => void;
}

export default class Queue {
    private _queue: IQueueItem[] = [];
    private _pendingPromises: number = 0;
    private _maxParallelPromises: number = 1;

    constructor(maxParallelPromises: number = 1) {
        this._maxParallelPromises = maxParallelPromises;
    }

    public add(promise: () => Promise<void>) {
        return new Promise((resolve, reject) => {
            this._queue.push({
                promise,
                resolve,
                reject,
            });
            this.next();
        });
    }

    public addBulk(promises: (() => Promise<void>)[], clearQueue = false) {
        const res: Promise<any>[] = [];

        if (clearQueue) {
            this.clear();
        }

        for (const promise of promises) {
            res.push(this.add(promise));
        }

        return res;
    }

    public clear() {
        this._queue = [];
    }

    private next() {
        if (this._pendingPromises >= this._maxParallelPromises) {
            return false;
        }

        const item = this._queue.shift();
        if (!item?.promise) {
            return false;
        }

        this._pendingPromises++;
        item.promise()
            .then((value) => {
                item.resolve(value);
            })
            .catch(() => {
                item.reject();
            })
            .finally(() => {
                this._pendingPromises--;
                this.next();
            });
        this.next();
    }
}
