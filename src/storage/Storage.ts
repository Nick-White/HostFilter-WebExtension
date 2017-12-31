import StorageObject = browser.storage.StorageObject;

export abstract class Storage<M> {

    protected abstract getKey(): string;

    public createDefaultIfNeeded(): Promise<void> {
        return new Promise<void>((resolve: () => void) => {
            this.get().then((model: M | null) => {
                if (model === null) {
                    this.createDefault().then(() => {
                        resolve();
                    });
                } else {
                    resolve();
                }
            });
        });
    }
    
    public get(): Promise<M | null> {
        return new Promise<M | null>((resolve: (model: M | null) => void) => {
            browser.storage.local.get(this.getKey()).then((storage: StorageObject) => {
                let model: M | null = null;
                if (this.getKey() in storage) {
                    model = (storage[this.getKey()] as any) as M;
                }
                resolve(model);
            });
        });
    }

    public set(model: M): Promise<void> {
        return new Promise<void>((resolve: () => void) => {
            let storage = {} as StorageObject;
            storage[this.getKey()] = model as any;

            browser.storage.local.set(storage).then(() => {
                resolve();
            });
        });
    }

    private createDefault(): Promise<void> {
        return new Promise<void>((resolve: () => void) => {
            let defaultModel = this.generateDefault();
            this.set(defaultModel).then(() => {
                resolve();
            });
        });
    }

    protected abstract generateDefault(): M;
}