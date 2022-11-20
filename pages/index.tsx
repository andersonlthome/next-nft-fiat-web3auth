import type { NextPage } from "next";
import Head from "next/head";

import dynamic from "next/dynamic";
import { Web3Auth } from "../hooks/useWeb3Auth";

const App = dynamic(
  () => {
    return import("./App");
  },
  { ssr: false }
);

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>NFT - FIAT</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Web3Auth>
        <App />
      </Web3Auth>
    </>
  );
};

export default Home;
