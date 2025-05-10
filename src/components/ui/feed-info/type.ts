export type FeedInfoUIProps = {
  readyOrders: number[];
  pendingOrders: number[];
  total: number;
  totalToday: number;
};

export type HalfColumnProps = {
  orders: number[];
  title: string;
  textColor?: string;
};

export type TColumnProps = {
  title: string;
  content: number;
};
