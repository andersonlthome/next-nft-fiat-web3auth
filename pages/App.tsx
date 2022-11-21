import Image, { StaticImageData } from "next/image";
import { ButtonHTMLAttributes, useEffect, useRef, useState } from "react";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import imgCryptoPunk1 from "../public/assets/1.png";
import imgCryptoPunk2 from "../public/assets/2.png";
import imgCryptoPunk3 from "../public/assets/3.png";
import imgCryptoPunk4 from "../public/assets/4.png";
import { NftToBuyState } from "../interfaces";

function App() {
  const {
    provider,
    login,
    authenticateUser,
    logout,
    getChainId,
    getAccounts,
    sendPreference,
  } = useWeb3Auth();

  // the idea is get from the backend the nft to buy or direct from IPFS
  const allNfts: NftToBuyState[] = [    
    {
      id: 2,
      name: "CryptoPunk 2",
      image: imgCryptoPunk2,
      price: 10,
      description:
        "Is one of a collection of 10,000 unique characters with proof of ownership stored on the Ethereum blockchain.",
      currency: "BRL",
    },
    {
      id: 3,
      name: "CryptoPunk 3",
      image: imgCryptoPunk3,
      price: 10,
      description:
        "Is one of a collection of 10,000 unique characters with proof of ownership stored on the Ethereum blockchain.",
      currency: "BRL",
    },
    {
      id: 4,
      name: "CryptoPunk 4",
      image: imgCryptoPunk4,
      price: 10,
      description:
        "Is one of a collection of 10,000 unique characters with proof of ownership stored on the Ethereum blockchain.",
      currency: "BRL",
    },
  ];

  const loggedInView = (
    <>
      <div className="flex-container">
        {/* <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div> */}
        <div>
          <button onClick={authenticateUser} className="card">
            Get ID Token
          </button>
        </div>
        <div>
          <button onClick={getChainId} className="card">
            Get Chain ID
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        {/* <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div> */}
        {/* <div>
          <button onClick={sendTransaction} className="card">
            Send Transaction
          </button>
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={getPrivateKey} className="card">
            Get Private Key
          </button>
        </div> */}
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  const createCheckoutButton = (preference?: string) => {
    const script = document.createElement("script");
    script.src =
      "https://www.mercadopago.com.br/integrations/v1/web-payment-checkout.js";
    script.type = "text/javascript";
    script.dataset.preferenceId = preference;
    const btnCheckout = document.getElementById("button-checkout");
    if (btnCheckout) {
      btnCheckout.appendChild(script);
      btnCheckout.style.display = "none";

      setTimeout(
        () =>
          (
            document.querySelector(".mercadopago-button") as HTMLButtonElement
          ).click(),
        500
      );
    }
  };

  const CheckoutButton: React.FC<{ nft: NftToBuyState }> = ({ nft }) => {
    const tryToBuy = async () => {
      let { preferenceId } = await sendPreference(nft);

      if (preferenceId) {
        createCheckoutButton(preferenceId);
      }
    };

    return (
      <>
        <button
          className={`bg-blue-500 text-white font-bold py-2 px-4 rounded-full ${
            !provider ? "opacity-50" : "hover:bg-blue-700"
          }`}
          onClick={tryToBuy}
          disabled={!provider ? true : false}
        >
          Comprar NFT
        </button>
        <div id="button-checkout" />
      </>
    );
  };

  const allNftsRender = allNfts.map((nft) => (
    <div key={nft.id} className="bg-black px-4 pt-5 pb-4 sm:p-6 sm:pb-4 rounded-xl w-80 m-4">
      <div className="sm:flex sm:items-start flex-col">
        <div>
          <Image src={nft.image} alt="CryptoPunks" />
        </div>
        <div className="flex flex-col ">
          <span className="text-white mb-2"> {nft.name} </span>
          <p className="text-white mb-4"> {nft.description} </p>
          <CheckoutButton nft={nft} />
        </div>
      </div>
    </div>
  ));

  return (
    <>
      <nav className="flex items-center justify-between flex-row bg-gray-800 p-6">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <span className="font-semibold text-xl tracking-tight">
            NFT Marketplace
          </span>
        </div>

        <button
          onClick={provider ? logout : login}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          {provider ? "Logout" : "Login"}
        </button>
      </nav>

      <div className="container">
        <h1 className="title">Buy now the best NFTs</h1>

        <div className="flex flex-row flex-wrap justify-center">{allNftsRender}</div>

        <footer className="footer"></footer>
      </div>
    </>
  );
}

export default App;
