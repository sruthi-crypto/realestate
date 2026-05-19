export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  area: string;
  category: string;
}

export const AREAS = ["Hyderabad", "Vizag", "Bangalore", "Chennai", "Mumbai"] as const;
export const CATEGORIES = ["Open Plots", "Apartments", "Gated Villas", "Gated Communities"] as const;

export const WHATSAPP_NUMBER = "917032716188";
