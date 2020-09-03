export interface IWallet {
    address: string;
    name: string;
    balances: {
        dbet: IWalletBalance;
        vtho: IWalletBalance;
    }
    created?: Date;
}

export interface IWalletBalance {
    amount: string;
    loading: boolean;
}
