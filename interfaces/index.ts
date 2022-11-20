import { StaticImageData } from "next/image";

export interface NftToBuyState {
  id: number;
  name: String;
  image: StaticImageData;
  price: number;
  currency: string;
  // quantity: number;
  description: string;
  preferenceId?: string;
}
