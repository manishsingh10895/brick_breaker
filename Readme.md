# Brick breaker

### Simple brick breaker like game
---
#### Requirements

* Install parcel bundler globally
    > yarn add -global parcel
* Metamask extension installed in browser
    > [Install metamask for chrome](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)

#### Install Dependendencies
> `yarn`

#### Pre run 
Change Owner account address in config.ts

#### Configure Brick Token
* Compile Smart Contracts in token/contracts (yarn compile contracts)
* deploy or local ganache 
    > `cd token && node deploy -network local`

### Post Deploy
Server will automatically work with the newly created contract, you need to copy  and replace **abi** and **address** from migrations.json to src/game-components/config.ts


#### How to run
> `yarn start`

> `yarn server` 

#### Build
> `yarn build`


