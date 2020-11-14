import {Meal} from './Meal';


export interface Menu {
  id: number;
  description: string;
  label: string;
  status: number; // The status for this element. 0 for Enabled, 1 for Disabled, 2 for Deleted
  imageId: Array<number>;
  priceDF: number; // Prix Hors taxe
  availableForWeeks: Array<number>;
  meals: Array<Meal>;
}
