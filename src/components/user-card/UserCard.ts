export type UserCardProps = {
  uid?: number;
  avatar?: string;
  name?: string;
  fanNum?: number;
  videoNum?: number;
  level?: number;
  isFollowed?: boolean;

  // 是否根据uid自动获取信息
  autoFetch?: boolean
};