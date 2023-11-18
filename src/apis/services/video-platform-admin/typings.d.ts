declare namespace API {
  type CommonResultArrayByte_ = {
    code?: number;
    data?: string;
    message?: string;
  };

  type CommonResultListUpdate_ = {
    code?: number;
    data?: Update[];
    message?: string;
  };

  type CommonResultString_ = {
    code?: number;
    data?: string;
    message?: string;
  };

  type deleteByIdUsingDELETEParams = {
    /** id */
    id: number;
  };

  type getImagesUsingGETParams = {
    /** url */
    url: string;
  };

  type getUpdatesByTypeUsingGETParams = {
    /** pid */
    pid: number;
  };

  type publishUsingPOSTParams = {
    /** 动态的正文，长度1~1024 */
    content: string;
    /** 动态的分区，未分区的动态的pid=1 */
    pid: number;
    /** 动态的标题,长度1~40 */
    title: string;
    /** 动态的类型，截至11.13日，只有图文，类型编号为0 */
    type: number;
    /** 发布动态的用户id */
    uid: number;
  };

  type Update = {
    /** 正文 */
    content?: string;
    /** 时间 */
    datetime?: string;
    /** 动态id */
    id?: number;
    /** 分区id */
    pid?: number;
    /** 状态码 */
    status?: number;
    /** 标题 */
    title?: string;
    /** 动态类型 */
    type?: number;
    /** 发布者的用户id */
    uid?: number;
    /** 多媒体urls的json */
    urls?: string;
  };

  type updateUsingPOSTParams = {
    /** 动态的正文，长度1~1024 */
    content?: string;
    /** 目标修改动态的id */
    id: number;
    /** 动态的分区，未分区的动态的pid=1 */
    pid?: number;
    /** 动态的标题,长度1~40 */
    title?: string;
  };
}
