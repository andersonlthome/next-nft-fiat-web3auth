import { useWeb3Auth } from "../hooks/useWeb3Auth";


export function Header(): JSX.Element {
  const {
    provider,
    login,
    authenticateUser,
    logout,
    getChainId,
    getAccounts,
    sendPreference,
  } = useWeb3Auth();

  

  return (
    <nav className="flex items-center justify-between flex-row bg-gray-800 p-6">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <span className="font-semibold text-xl tracking-tight">
            NFT Marketplace
          </span>
        </div>

        <button
          onClick={() => provider ? logout : login}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          {provider ? "Logout" : "Login"}
        </button>
      </nav>
  )
}