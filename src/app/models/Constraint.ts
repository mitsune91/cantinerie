export interface Constraint {
  id: number;
  orderTimeLimit: OrderTimeLimit; // A voir si on ne doit pas changer en type Date
  maximumOrderPerDay: number;
  rateVAT: number;
}

export interface OrderTimeLimit {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}
