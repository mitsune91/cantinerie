import {Ingredient} from './Ingredient';

export interface Meal {
  id: number;
  description: string;
  label: string;
  status: number; // The status for this element. 0 for Enabled, 1 for Disabled, 2 for Deleted
  imageId: Array<number>;
  priceDF: number;
  availableForWeeks: Array<number>;
  category: number;
  // The category for this element. unknown(0), appetizers(1), starters(2),
  // main_dishes(3), others(4), desserts(5), brunchs_and_lunches(6),
  // soups(7), sauces(8), drinks(9), sandwiches(10), snacks(11)
  ingredients: Array<Ingredient>;
}
