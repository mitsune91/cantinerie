import {User} from './User';

export interface Order {
  id: number;
  creationDate: string;
  creationTime: CreationTime; // A voir si on ne doit pas changer en type Date
  status: number; // Status of the order. 0 for Created, 1 for Delivered, 2 for Canceled
  user: User;
  quantity?: Array<number>; // Nullable
}

export class CreationTime {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}
