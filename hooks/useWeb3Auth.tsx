import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useCallback,
  useState,
  useMemo,
} from "react";
// import axios, { AxiosError, AxiosInstance } from 'axios'

import { Web3Auth as Web3AuthModal } from "@web3auth/modal";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import RPC from "../utils/web3RPC"; // for using web3.js
// import RPC from ".api/ethersRPC"; // for using ethers.js

// Plugins
import { TorusWalletConnectorPlugin } from "@web3auth/torus-wallet-connector-plugin";

// Adapters
import { CoinbaseAdapter } from "@web3auth/coinbase-adapter";
import { WalletConnectV1Adapter } from "@web3auth/wallet-connect-v1-adapter";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import { TorusWalletAdapter } from "@web3auth/torus-evm-adapter";

import { getPublicCompressed } from "@toruslabs/eccrypto";

import { DropNftToBuy } from "../interfaces";

interface Web3AuthContextData {
  provider: SafeEventEmitterProvider | null;
  login: Function;
  authenticateUser: Function;
  logout: Function;
  getChainId: Function;
  getAccounts: Function;
  sendPreference: Function;
}

const Web3AuthContext = createContext<Web3AuthContextData>(
  {} as Web3AuthContextData
);

interface Web3AuthProviderProps {
  children: ReactNode;
}

interface ToVerify {
  appPubKey: string;
  idToken: string;
}

export function Web3Auth({ children }: Web3AuthProviderProps): JSX.Element {
  const [web3auth, setWeb3auth] = useState<Web3AuthModal | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );

  const [toVerify, setToVerify] = useState<ToVerify>({} as ToVerify);
  const [scopes, setScopes] = useState<string[]>([]);

  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID_WEB3AUTH as string; // get from https://dashboard.web3auth.io
  const apiUrl =
    (process.env.NEXT_PUBLIC_BACKEND_URL as string) ||
    "http://localhost:3003/api";

    console.log('clientId',clientId)

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3AuthModal({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x1",
            rpcTarget: "https://rpc.ankr.com/eth", // This is the public RPC we have added, please pass on your own endpoint while creating an app
          },
        });

        // plugins and adapters are optional and can be added as per your requirement
        // read more about plugins here: https://web3auth.io/docs/sdk/web/plugins/

        // adding torus wallet connector plugin

        const torusPlugin = new TorusWalletConnectorPlugin({
          torusWalletOpts: {},
          walletInitOptions: {
            whiteLabel: {
              theme: { isDark: true, colors: { primary: "#00a8ff" } },
              logoDark: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
              logoLight: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
            },
            useWalletConnect: true,
            enableLogging: true,
          },
        });
        await web3auth.addPlugin(torusPlugin);

        // read more about adapters here: https://web3auth.io/docs/sdk/web/adapters/

        // adding coinbase adapter

        const coinbaseAdapter = new CoinbaseAdapter({
          clientId,
        });
        web3auth.configureAdapter(coinbaseAdapter);

        // adding wallet connect v1 adapter

        const walletConnectV1Adapter = new WalletConnectV1Adapter({
          adapterSettings: {
            bridge: "https://bridge.walletconnect.org",
          },
          clientId,
        });

        web3auth.configureAdapter(walletConnectV1Adapter);

        // adding metamask adapter

        const metamaskAdapter = new MetamaskAdapter({
          clientId,
        });

        // it will add/update  the metamask adapter in to web3auth class
        web3auth.configureAdapter(metamaskAdapter);

        const torusWalletAdapter = new TorusWalletAdapter({
          clientId,
        });

        // it will add/update  the torus-evm adapter in to web3auth class
        web3auth.configureAdapter(torusWalletAdapter);

        setWeb3auth(web3auth);

        await web3auth.initModal();
        if (web3auth.provider) {
          setProvider(web3auth.provider);
        }
      } catch (error) {
        console.error('Error on init Web3Auth. ', error);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);

    // log on backend
    // Incase of secp256k1 curve, get the app_pub_key

    const app_scoped_privkey = (await web3auth.provider?.request({
      method: "eth_private_key", // use "private_key" for other non-evm chains
    })) as string;

    const appPubKey = getPublicCompressed(
      Buffer.from(app_scoped_privkey.padStart(64, "0"), "hex")
    ).toString("hex");

    const { idToken } = await web3auth.authenticateUser();

    const user = await web3auth.getUserInfo();
    console.log(user);

    setToVerify({ appPubKey, idToken });
    // TODO: add to localstorage or redux, pq web3auth está usando e salva mesmo encerrando a aplicação

    // Verify idToken at your backend server
    await fetch(apiUrl + "/v1/user/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + idToken,
      },
      body: JSON.stringify({ appPubKey: appPubKey }),
    })
      .then((res) => {
        if (res.status === 200) {
          console.log("User verified");
          return res.json();
        } else {
          console.log("User verification failed");
          return null;
        }
      })
      .then((user) => {
        // TODO: SEND TO NAVBAR TO SHOW MENU ADMIN, WHEN WITH THIS SCOPE
        if (user) setScopes(user.scopes);
      })
      .catch((err) => {
        console.error("error fetch", err);
      });


    console.log("Logged in Successfully!");
  };

  const authenticateUser = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const idToken = await web3auth.authenticateUser();
    console.log(idToken);
  };

  const sendPreference = async (nft: DropNftToBuy) => {
    try {
      const result = await fetch(apiUrl + "/v1/mp/preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + toVerify.idToken,
        },
        body: JSON.stringify({ nft, appPubKey: toVerify.appPubKey }),
      });
      const response = await result.json();

      return { preferenceId: response.id };
    } catch (error) {
      console.error(error);
      alert(JSON.stringify("Unexpected error"));
    }
  };

  // const getUserInfo = async () => {
  //   if (!web3auth) {
  //     console.log("web3auth not initialized yet");
  //     return;
  //   }
  //   const user = await web3auth.getUserInfo();
  //   console.log(user);
  // };

  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
  };

  const getChainId = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const chainId = await rpc.getChainId();
    console.log(chainId);
  };

  const getAccounts = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    console.log(address);
  };

  // const getBalance = async () => {
  //   if (!provider) {
  //     console.log("provider not initialized yet");
  //     return;
  //   }
  //   const rpc = new RPC(provider);
  //   const balance = await rpc.getBalance();
  //   console.log(balance);
  // };

  // const sendTransaction = async () => {
  //   if (!provider) {
  //     console.log("provider not initialized yet");
  //     return;
  //   }
  //   const rpc = new RPC(provider);
  //   const receipt = await rpc.sendTransaction();
  //   console.log(receipt);
  // };

  // const signMessage = async () => {
  //   if (!provider) {
  //     console.log("provider not initialized yet");
  //     return;
  //   }
  //   const rpc = new RPC(provider);
  //   const signedMessage = await rpc.signMessage();
  //   console.log(signedMessage);
  // };

  // const getPrivateKey = async () => {
  //   if (!provider) {
  //     console.log("provider not initialized yet");
  //     return;
  //   }
  //   const rpc = new RPC(provider);
  //   const privateKey = await rpc.getPrivateKey();
  //   console.log(privateKey);
  // };

  return (
    <Web3AuthContext.Provider
      value={{
        provider,
        login,
        authenticateUser,
        logout,
        getChainId,
        getAccounts,
        sendPreference,
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  );
}

export function useWeb3Auth(): Web3AuthContextData {
  return useContext(Web3AuthContext);
}
