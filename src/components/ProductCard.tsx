import Image, { StaticImageData } from "next/image";


export function ProductCard({ product, children }: any): JSX.Element {

  return (
    <div key={product.id} className="bg-black px-4 pt-5 pb-4 sm:p-6 sm:pb-4 rounded-xl w-80 m-4">
      <div className="sm:flex  flex-col">
        <div className="flex flex-col ">
          <Image src={product.image} height="280px" width="220px" alt={product.name as string} />
        </div>
        <div className="flex flex-col sm:items-start">
          <span className="text-white my-2 font-bold"> {product.name} </span>
          <p className="text-white mb-4"> {product.description} </p>
          <p className="text-white mb-4"> {product.price} </p>
          {/* <CheckoutButton nft={nft} /> */}
          {children}
        </div>
      </div>
    </div>
  )

}