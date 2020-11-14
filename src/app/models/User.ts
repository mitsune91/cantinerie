export interface User {
  id: number;
  address: string;
  wallet: number;
  postalCode: string;
  registrationDate: string;
  email: string;
  isLunchLady: boolean;
  name: string;
  firstname: string;
  phone: string;
  town: string;
  sex: number; // The sex of the user. 0 for man, 1 for woman, 2 for other
  status: number; // The status for the user. 0 for Enabled, 1 for Disabled, 2 for Deleted
  imageId?: Array<number>; // Nullable
}
