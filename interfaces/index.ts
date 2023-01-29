import { StaticImageData } from "next/image";

export interface DropNftToBuy {
  id: number;
  name: String;
  image: StaticImageData;
  price: number;
  currency: string;
  // quantity: number;
  description: string;
  preferenceId?: string;
}
