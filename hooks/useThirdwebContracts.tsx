import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useContract } from '@thirdweb-dev/react'
import { Marketplace, NFTDrop } from "@thirdweb-dev/sdk";


interface ThirdwebContractsContextData {
  nftMktplaceContract: Marketplace | null;
  nftDropContract: NFTDrop | null;
  isLoadingContracts: boolean;
  errorLoadingContracts: unknown;
}

const ThirdwebContractsContext = createContext<ThirdwebContractsContextData>(
  {} as ThirdwebContractsContextData
);

interface ThirdwebContractsProviderProps {
  children: ReactNode;
}


export function ThirdwebContracts({ children }: ThirdwebContractsProviderProps): JSX.Element {
  const [nftMktplaceContract, setNftMktplaceContract] = useState<Marketplace | null>(null);
  const [nftDropContract, setNftDropContract] = useState<NFTDrop | null>(null);
  const [isLoadingContracts, setIsLoadingContracts] = useState<boolean>(false);
  const [errorLoadingContracts, setErrorLoadingContracts] = useState<unknown>(false);

  const nftMktpContractAddress = process.env.NEXT_PUBLIC_NFT_MKTPLACE_CONTRACT
  const nftDropContractAddress = process.env.NEXT_PUBLIC_NFT_DROP_CONTRACT
  
  // can be used only in the body of a function component
  const { contract: mktplaceContract, isLoading: mktpIsLoading, error: mktpError } = useContract(nftMktpContractAddress,"marketplace")
  const { contract: dropContract, isLoading: dropIsLoading, error: dropError } = useContract(nftDropContractAddress,"nft-drop")

  useEffect(() => {
    mktplaceContract && setNftMktplaceContract(mktplaceContract)      
  }, [mktplaceContract]) 

  useEffect(() => {
    dropContract && setNftDropContract(dropContract)      
  }, [dropContract]) 
  
  useEffect(() => {
    (mktpIsLoading && dropIsLoading) ?  
      setIsLoadingContracts(false) :
      setIsLoadingContracts(false)      
  }, [mktpIsLoading, dropIsLoading]) 

  useEffect(() => {
    (mktpError || dropError) ? 
      setErrorLoadingContracts(mktpError ?? dropError) : 
      setErrorLoadingContracts(null)      
  }, [mktpError, dropError])

  return (
    <ThirdwebContractsContext.Provider
      value={{
        nftMktplaceContract,
        nftDropContract,
        isLoadingContracts,
        errorLoadingContracts
      }}
    >
      {children}
      {/* can put a loading component */}
    </ThirdwebContractsContext.Provider>
  );
}

export function useThirdwebContracts(): ThirdwebContractsContextData {
  return useContext(ThirdwebContractsContext);
}