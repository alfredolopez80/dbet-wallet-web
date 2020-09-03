# DBET WALLET WEB

### (http://play.decent.bet/wallet)[http://play.decent.bet/wallet] 

This is an extract of the code of the decent.bet wallet inside (http://play.decent.bet)[http://play.decent.bet]. The decent.bet Wallet version 2 is web wallet that uses XDV wallet technologies wish consists of the following modules:

- ethers js
- pouch db
- node js Jose
- elypthic js 
- others.

## How do we integrate with XDV Wallet module
We use thor-devkit to generate the Vechain key/pair and store that inside the broweser using Pouch DB database: when a user selects a wallet a request is make to XDV to open the wallet using a passphrase, this will tell Pouch db to decrypt the keystore for that specific wallet.

References:
- (https://github.com/xdvplatform/xdvplatform-wallet)[https://github.com/xdvplatform/xdvplatform-wallet]


### __Copyright Decent.bet 2020__
