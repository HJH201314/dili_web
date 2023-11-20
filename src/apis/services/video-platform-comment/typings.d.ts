declare namespace API {
  type Comment = {
    /** 子评论 */
    children?: Comment[];
    /** 评论内容 */
    content?: string;
    /** 评论时间 */
    createTime?: string;
    /** 评论对象的id */
    foreignId?: number;
    /** id，主键 */
    id?: string;
    /** 点赞数量 */
    likeNum?: number;
    /** 回复数量 */
    replyNum?: number;
    /** 回复的用户 */
    targetUsername?: string;
    /** 用户id */
    userId?: number;
    /** 用户名 */
    username?: string;
  };

  type CommonResultListResultComment_ = {
    code?: number;
    data?: ListResultComment_;
    message?: string;
  };

  type CommonResultLong_ = {
    code?: number;
    data?: number;
    message?: string;
  };

  type CommonResultString_ = {
    code?: number;
    data?: 'FAILED' | 'FORBIDDEN' | 'SUCCESS' | 'UNAUTHORIZED' | 'VALIDATE_FAILED';
    message?: string;
  };

  type countCommentsByForeignIdUsingGETParams = {
    /** foreignId */
    foreignId?: number;
  };

  type deleteChildCommentUsingDELETEParams = {
    /** 要删除的子评论的id */
    cid: string;
    /** 要删除的子评论的根评论的id */
    pid: string;
  };

  type deleteRootCommentUsingDELETEParams = {
    /** 要删除的根评论的id */
    pid: string;
  };

  type likeChildrenCommentUsingPOSTParams = {
    /** 点赞的子评论id */
    cid: string;
    /** 点赞或取消点赞（1：点赞  -1：取消点赞） */
    flag: number;
    /** 点赞的对应的根评论id */
    pid: string;
  };

  type likeRootCommentUsingPOSTParams = {
    /** 点赞或取消点赞（1：点赞  -1：取消点赞） */
    flag: number;
    /** 点赞的根评论的id */
    pid: string;
  };

  type listChildrenCommentByPagesUsingGETParams = {
    /** 当前页 */
    page: number;
    /** 要获取子评论的根评论id */
    pid: string;
    /** 每页大小 */
    size: number;
  };

  type listCommentByPagesUsingGETParams = {
    /** 要获取评论的动态id */
    foreignId: number;
    /** 当前页 */
    page: number;
    /** 每页大小 */
    size: number;
    /** 排序字段 */
    sortBy: string;
  };

  type ListResultComment_ = {
    list?: Comment[];
    total?: number;
  };

  type replyCommentUsingPOSTParams = {
    /** 回复的根评论的id */
    pid: string;
  };
}
