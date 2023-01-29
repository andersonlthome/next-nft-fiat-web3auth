import type { NextPage } from "next";
import Head from "next/head";

import dynamic from "next/dynamic";
import { Web3Auth } from "../hooks/useWeb3Auth";
import { ThirdwebContracts } from "../hooks/useThirdwebContracts";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";

/**
 * This is the dynamic import of the App component. 
 * It will be rendered only on the client side.
*/
const App = dynamic(
  () => {
    return import("./App");
  },
  { ssr: false }
);

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Mumbai;

const Home: NextPage = () => {
  return (
    <ThirdwebProvider desiredChainId={activeChainId}>
      <Head>
        <title>NFT - FIAT</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Web3Auth>
        <ThirdwebContracts>
          <App />
        </ThirdwebContracts>
      </Web3Auth>
    </ThirdwebProvider>
  );
};

export default Home;
