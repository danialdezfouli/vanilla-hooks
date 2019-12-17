let buckets = new WeakMap();
let stack = [];

function withHooks(callback) {
    return (...args) => {
        stack.push(callback);
        let bucket = __getCurrentBucket();
        bucket.nextStateSlotId = 0;

        try {
            return callback.apply(this, args);
        } finally {
            stack.pop();
        }
    }
}


function __getCurrentBucket() {
    if (!stack) return;

    let fn = stack[stack.length - 1];
    if (!fn)
        throw new Error('Wrap your callback by using withHooks().');


    if (!buckets.has(fn)) {
        buckets.set(fn, {
            nextStateSlotId: 0,
            stateSlots: [],
        });
    }

    return buckets.get(fn);
}

function useState(initialVal) {
    var bucket = __getCurrentBucket();

    if (bucket) {
        if (!(bucket.nextStateSlotId in bucket.stateSlots)) {
            let slot = [
                initialVal,
                function updateSLot(valueOrFn) {
                    slot[0] = typeof valueOrFn == 'function' ? valueOrFn(slot[0]) : valueOrFn;
                }
            ]
            bucket.stateSlots[bucket.nextStateSlotId] = slot;
        }

        return [...bucket.stateSlots[bucket.nextStateSlotId++]];
    } else {
        throw new Error('useState() only valid inside Hook Function.');
    }

}