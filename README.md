
<h1 align="center">Omnichain Fungible Token (OFT)</h1>



## Developing Contracts

#### Installing dependencies

We recommend using `pnpm` as a package manager (but you can of course use a package manager of your choice):

```bash
pnpm install
```

#### Compiling your contracts

This project supports both `hardhat` and `forge` compilation. By default, the `compile` command will execute both:

```bash
pnpm compile
```

If you prefer one over the other, you can use the tooling-specific commands:

```bash
pnpm compile:forge
pnpm compile:hardhat
```





## Deploying Contracts

Set up deployer wallet/account:

- Rename `.env.example` -> `.env`
- Choose your preferred means of setting up your deployer wallet/account:

```


- Fund this address with the corresponding chain's native tokens you want to deploy to.

To deploy your contracts to your desired blockchains, run the following command in your project's folder:

```bash
npx hardhat lz:deploy
```

More information about available CLI arguments can be found using the `--help` flag:

```bash
npx hardhat lz:deploy --help
```

By following these steps, you can focus more on creating innovative omnichain solutions and less on the complexities of cross-chain communication.

<br></br>

## Connecting Contracts

### Ethereum Configurations

Fill out your `layerzero.config.ts` with the contracts you want to connect. You can generate the default config file for your declared hardhat networks by running:

```bash
npx hardhat lz:oapp:config:init --contract-name [YOUR_CONTRACT_NAME] --oapp-config [CONFIG_NAME]
```

> [!NOTE]
> You may need to change the contract name if you're deploying multiple OApp contracts on different chains (e.g., OFT and OFT Adapter).

<br>




```bash
npx hardhat lz:oapp:wire --oapp-config layerzero.config.ts
```

<p align="center">
  Join our community on <a href="https://discord-layerzero.netlify.app/discord" style="color: #a77dff">Discord</a> | Follow us on <a href="https://twitter.com/LayerZero_Labs" style="color: #a77dff">Twitter</a>
</p>
