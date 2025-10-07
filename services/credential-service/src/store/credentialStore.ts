interface Credential {
    id: string;
    data: any;
    issuedBy: string;
    issuedAt: Date;
}

class CredentialStore {
    private static instance: CredentialStore;
    private credentials: Map<string, Credential>;

    private constructor() {
        this.credentials = new Map();
    }

    public static getInstance(): CredentialStore {
        if (!CredentialStore.instance) {
            CredentialStore.instance = new CredentialStore();
        }
        return CredentialStore.instance;
    }

    public addCredential(credential: Credential): void {
        const key = JSON.stringify(credential.data);
        this.credentials.set(key, credential);
    }

    public findCredential(data: any): Credential | undefined {
        const key = JSON.stringify(data);
        return this.credentials.get(key);
    }

    public hasCredential(data: any): boolean {
        const key = JSON.stringify(data);
        return this.credentials.has(key);
    }
}

export { Credential, CredentialStore };