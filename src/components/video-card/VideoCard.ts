export type VideoCardInfo = {
  /* 必要信息 */
  vid: number; // 视频ID
  coverUrl?: string; // 封面URL
  title?: string; // 视频标题
  upId?: number; // 视频作者用户ID
  upName?: string; // 视频作者昵称
  playNum?: number; // 播放量
  dmNum?: number; // 弹幕量
  createTime?: string; // 视频上传时间
  duration?: number | string; // 视频时长（hh:mm:ss格式或秒数）
}

export type VideoCardProps = VideoCardInfo & {
  /* 自动刷新 */
  autoFetch?: boolean; // 若为空，将智能判定传值并自动获取视频信息

  /* 样式相关 */
  shadowed?: boolean;
}