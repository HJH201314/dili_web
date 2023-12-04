declare namespace API {
  type addStarUsingPOSTParams = {
    /** 收藏夹名称 */
    starName: string;
    /** 当前登录用户id */
    uid: number;
  };

  type AuthDto = {
    auth?: string;
    type?: number;
  };

  type CommonResultListHistory_ = {
    code?: number;
    data?: History[];
    message?: string;
  };

  type CommonResultListPartition_ = {
    code?: number;
    data?: Partition[];
    message?: string;
  };

  type CommonResultListResult_ = {
    code?: number;
    data?: ListResult;
    message?: string;
  };

  type CommonResultListResultStar_ = {
    code?: number;
    data?: ListResultStar_;
    message?: string;
  };

  type CommonResultListResultStarVo_ = {
    code?: number;
    data?: ListResultStarVo_;
    message?: string;
  };

  type CommonResultListResultString_ = {
    code?: number;
    data?: ListResultString_;
    message?: string;
  };

  type CommonResultListResultVo_ = {
    code?: number;
    data?: ListResultVo_;
    message?: string;
  };

  type CommonResultListUpdate_ = {
    code?: number;
    data?: Update[];
    message?: string;
  };

  type CommonResultListVo_ = {
    code?: number;
    data?: Vo[];
    message?: string;
  };

  type CommonResultListVo2 = {
    code?: number;
    data?: Vo3[];
    message?: string;
  };

  type CommonResultString_ = {
    code?: number;
    data?: string;
    message?: string;
  };

  type CommonResultUpdate_ = {
    code?: number;
    data?: Update;
    message?: string;
  };

  type CommonResultUser_ = {
    code?: number;
    data?: User;
    message?: string;
  };

  type CommonResultUserInfo_ = {
    code?: number;
    data?: UserInfo;
    message?: string;
  };

  type CommonResultVo_ = {
    code?: number;
    data?: Vo2;
    message?: string;
  };

  type deleteEssayByIdUsingDELETEParams = {
    /** id */
    id: number;
  };

  type deleteVideoByIdUsingDELETEParams = {
    /** id */
    id: number;
  };

  type getEssayByIdUsingGETParams = {
    /** id */
    id: number;
  };

  type getHomePageUsingGETParams = {
    /** 推送多少个视频 */
    pageSize: number;
  };

  type getImagesUsingGETParams = {
    /** 图片的url */
    url: string;
  };

  type getInPageUsingGETParams = {
    /** 页码 */
    pageNum: number;
    /** 每页大小 */
    pageSize: number;
  };

  type getRecentHistoryUsingGETParams = {
    /** 结束条数 */
    cntEnd: number;
    /** 开始条数 */
    cntStart: number;
  };

  type getUserInfoByUidUsingGETParams = {
    /** uid */
    uid: number;
  };

  type getUserVideoUsingGETParams = {
    /** 第几页，默认1 */
    page?: number;
    /** 每页数量，默认10 */
    size?: number;
    /** 指定排列方式，0最新、1最多播放、2最多收藏，默认为0 */
    sort?: number;
    /** 指定uid */
    uid: number;
  };

  type getVideoDetailUsingGETParams = {
    /** 动态id */
    id: number;
  };

  type HisQueryDto = {
    mediaType?: number;
    userId?: number;
  };

  type History = {
    hisTime?: Timestamp;
    id?: number;
    mediaId?: number;
    mediaType?: number;
    userId?: number;
    watchedAt?: TimeRes;
  };

  type HistoryDto = {
    mediaId?: number;
    mediaType?: number;
    userId?: number;
    watchedAt?: TimeReq;
  };

  type ListResult = {
    list?: Record<string, any>[];
    total?: string;
  };

  type ListResultStar_ = {
    list?: Star[];
    total?: string;
  };

  type ListResultStarVo_ = {
    list?: StarVo[];
    total?: string;
  };

  type ListResultString_ = {
    list?: string[];
    total?: string;
  };

  type ListResultVo_ = {
    list?: Vo3[];
    total?: string;
  };

  type listStarByUidUsingGETParams = {
    /** 当前登录的用户的id */
    uid: number;
  };

  type listStarContentBySidByPageUsingGETParams = {
    /** 当前页 */
    page: number;
    /** 收藏夹id */
    sid: string;
    /** 每页大小 */
    size: number;
  };

  type listStaredUsingGETParams = {
    /** 当前登录的用户的id */
    uid: number;
    /** 当前观看视频的动态id */
    updateId: number;
  };

  type LoginDto = {
    email?: string;
    phone?: string;
    pin?: string;
    pswd?: string;
    type?: number;
  };

  type Partition = {
    /** 分区id */
    id?: number;
    /** 分区名 */
    name?: string;
  };

  type publishUsingPOSTParams = {
    /** 动态的正文，长度1~1024 */
    content: string;
  };

  type publishVideoUsingPOSTParams = {
    /** 动态的正文，长度1~1024 */
    content: string;
    /** 视频分区id */
    pid: number;
    /** 视频标题 */
    title: string;
  };

  type RegisterDto = {
    email?: string;
    name?: string;
    phone?: string;
    pin?: string;
    pswd?: string;
    type?: number;
  };

  type removeStarUsingDELETEParams = {
    /** 收藏夹id */
    sid: string;
  };

  type removeStarVideoUsingDELETEParams = {
    /** 收藏夹id */
    sid: string;
    /** 要删除的视频的动态id */
    updateId: number;
  };

  type searchUsingGETParams = {
    /** classificationId，0表示搜索视频，1表示搜索用户，默认0 */
    classificationId?: number;
    /** key，不能为空，搜索关键字 */
    key: string;
    /** page，页码，默认1 */
    page?: number;
    /** pid，分区id，默认为0，不作区分 */
    pid?: number;
    /** size，每页大小，默认30 */
    size?: number;
    /** sortBy，排序方式，默认0不排序，1-最多播放、2-最新发布、3-最多弹幕、4-最多收藏如果分类id为1表示搜索用户，此时1-粉丝数高到低、2-粉丝数低到高、3-等级高到低，4-等级低到高 */
    sortBy?: number;
    /** time，默认0，不作区分，1-10分钟以内，2-10到30分钟，3-30到60分钟，4-60分钟以上 */
    time?: number;
  };

  type Star = {
    /** 主键id */
    id?: string;
    /** 收藏夹名称 */
    starName?: string;
    /** 收藏数量 */
    starNum?: number;
    /** 收藏的视频的id列表 */
    starVideos?: StarVideo[];
    /** 用户id */
    uid?: number;
  };

  type StarVideo = {
    starDate?: string;
    updateId?: number;
  };

  type starVideoUsingPOSTParams = {
    /** 要收藏的视频id */
    updateId: number;
  };

  type StarVo = {
    /** 视频播放量 */
    playNum?: number;
    /** 收藏时间 */
    starDate?: string;
    /** 视频收藏数量 */
    starNum?: number;
    /** 视频标题 */
    title?: string;
    /** 视频作者名称 */
    upName?: string;
    /** 视频上传时间 */
    uploadTime?: string;
    /** 视频id */
    vid?: number;
  };

  type suggestUsingGETParams = {
    /** 传入string类型的key，返回补全的list列表 */
    key: string;
  };

  type TimeReq = {
    date?: number;
    hours?: number;
    minutes?: number;
    month?: number;
    seconds?: number;
    time?: string;
    year?: number;
  };

  type TimeRes = {
    date?: number;
    day?: number;
    hours?: number;
    minutes?: number;
    month?: number;
    seconds?: number;
    time?: string;
    timezoneOffset?: number;
    year?: number;
  };

  type Timestamp = {
    date?: number;
    day?: number;
    hours?: number;
    minutes?: number;
    month?: number;
    nanos?: number;
    seconds?: number;
    time?: string;
    timezoneOffset?: number;
    year?: number;
  };

  type Update = {
    /** 正文 */
    content?: string;
    /** 动态id */
    id?: number;
    /** 状态码 */
    status?: number;
    /** 发布者的用户id */
    uid?: number;
    /** 时间 */
    uploadTime?: string;
    /** 多媒体urls的json */
    urls?: string;
    /** 视频id */
    vid?: number;
  };

  type updateUsingPUTParams = {
    /** 动态的正文，长度1~1024 */
    content: string;
    /** 目标修改动态的id */
    id: number;
  };

  type User = {
    /** 邮箱 */
    email?: string;
    /** uid */
    id?: number;
    /** 等级 */
    level?: number;
    /** 昵称 */
    name?: string;
    /** 密码 */
    password?: string;
    /** 手机号 */
    phone?: string;
    /** 用户状态 */
    status?: number;
  };

  type UserInfo = {
    /** 粉丝数量 */
    fan?: number;
    /** 关注数量 */
    follow?: number;
    /** 性别 */
    gender?: string;
    /** uid */
    id?: number;
    /** 自我介绍 */
    info?: string;
    /** ip属地 */
    ip?: string;
    /** 等级 */
    level?: number;
    /** 获赞数量 */
    like?: number;
    /** 昵称 */
    name?: string;
  };

  type Vo = {
    /** 视频的封面 */
    coverUrl?: string;
    /** 历史记录的时间 */
    hisTime?: string;
    /** 视频的标题 */
    title?: string;
    /** 视频对应的id */
    uid?: number;
    /** up主的名字 */
    upName?: string;
    /** 观看到的时间 */
    watchedAt?: string;
  };

  type Vo2 = {
    /** 投币数量 */
    coin?: number;
    /** 弹幕数量 */
    dmNUm?: number;
    /** 视频作者关注数 */
    follow?: number;
    /** 视频id */
    id?: number;
    /** 点赞数量 */
    like?: number;
    /** 视频播放量 */
    playNum?: number;
    /** 转发数量 */
    share?: number;
    /** 收藏 */
    star?: number;
    /** 视频标题 */
    title?: string;
    /** 视频作者名字 */
    upName?: string;
    /** 视频上传时间 */
    uploadTime?: string;
  };

  type Vo3 = {
    /** 弹幕数量 */
    dmNum?: number;
    /** 动态id */
    id?: number;
    /** 视频播放量 */
    playNum?: number;
    /** 视频标题 */
    title?: string;
    /** 总时长 */
    totalTime?: string;
    /** 视频作者名字 */
    upName?: string;
    /** 视频上传时间 */
    uploadTime?: string;
    /** 视频封面url */
    url?: string;
  };
}
