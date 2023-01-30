
// import { DropNftToBuy } from "../types";

import { useWeb3Auth } from "../hooks/useWeb3Auth";

export function CheckoutButton(nft: any) {
  const {
    provider,
    login,
    authenticateUser,
    logout,
    getChainId,
    getAccounts,
    sendPreference,
  } = useWeb3Auth();

  const createCheckoutButtonMP = (preference?: string) => {
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

  const tryToBuy = async () => {
    let { preferenceId } = await sendPreference(nft);

    if (preferenceId) {
      createCheckoutButtonMP(preferenceId);
    }
  };

  return (
    <>
      <button
        className={`bg-blue-500 text-white font-bold py-2 px-4 rounded-full ${!provider ? "opacity-50" : "hover:bg-blue-700"
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

