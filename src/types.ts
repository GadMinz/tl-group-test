export interface IUser {
  place: number;
  login: string;
  orders: number;
  status: string;
}

export type TSort = {
  value: string;
  reversed: boolean;
};

export type TInterval = {
  start: number;
  end: number;
};

export type TSearch = Omit<IUser, "place" | "orders">;
