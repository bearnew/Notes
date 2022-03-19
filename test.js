Promise.any = (promises) => {
    let index = 0;
    return new Promise((resolve, reject) => {
        if (promises.length === 0) return;
        promises.forEach((p, i) => {
            Promise.resolve(p).then(
                (val) => {
                    resolve(val);
                },
                (err) => {
                    index++;
                    if (index === promises.length) {
                        reject(
                            new AggregateError("All promises were rejected")
                        );
                    }
                }
            );
        });
    });
};
