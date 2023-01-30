import Image, { StaticImageData } from "next/image";
import { ButtonHTMLAttributes, useEffect, useRef, useState } from "react";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import { useThirdwebContracts } from "../hooks/useThirdwebContracts";
import imgCryptoPunk1 from "../public/assets/1.png";
import imgCryptoPunk2 from "../public/assets/2.png";
import imgCryptoPunk3 from "../public/assets/3.png";
import imgCryptoPunk4 from "../public/assets/4.png";
import { DropNftToBuy } from "../interfaces";
import { Header } from "../components/Header";
import { ProductCard } from "../components/ProductCard";
import { CheckoutButton } from "../components/CheckoutButton";


function App(): JSX.Element {
  const {
    provider,
    login,
    authenticateUser,
    logout,
    getChainId,
    getAccounts,
    sendPreference,
  } = useWeb3Auth();
  const {
    nftMktplaceContract,
    nftDropContract
  } = useThirdwebContracts();

  const [dropNfts, setDropNfts] = useState<DropNftToBuy[]>([] as DropNftToBuy[]);

  useEffect(() => {
    if (!nftMktplaceContract) return

    const getNfts = async () => {
      const nfts = await nftMktplaceContract.getAll();
      const listing = await nftMktplaceContract.getAllListings()
      console.log('NFTS', nfts);
      console.log('listing', listing);
    };

    getNfts();
  }, [nftMktplaceContract])

  useEffect(() => {
    console.log('nftDropContract', nftDropContract);

    if (!nftDropContract) return
    const getNfts = async () => {
      const nfts = await nftDropContract.getAll();
      console.log('NFTS nftDropContract', nfts);
      let dropNftsAux: DropNftToBuy[] = []
      nfts.forEach((nft, index) => {
        let n: DropNftToBuy = {
          id: index,
          name: nft.metadata.name as string,
          image: nft.metadata.image as unknown as StaticImageData,
          description: nft.metadata.description as string,
          currency: "BRL",
          price: 10,
        }
        dropNftsAux.push(n);
      });

      setDropNfts(dropNftsAux);
    };

    getNfts();
  }, [nftDropContract])


  return (
    <>
      <Header />

      <div className="container flex flex-col items-center">
        <h1 className="title">Buy now the best NFTs with Fiat</h1>

        <h2 className="font-bold text-2xl">Our Collection</h2>
        <div className="flex flex-row flex-wrap justify-center">
          {dropNfts.map((nft) => {
            return (
              <ProductCard product={nft}>
                <CheckoutButton nft={nft} />
              </ProductCard>
            )
          })}
        </div>

        <footer className="footer"></footer>
      </div>
    </>
  );
}

export default App;
