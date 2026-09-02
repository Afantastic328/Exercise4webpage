// 模拟需求数据
const mockData = [
  { id: 1, title: '丢失黑色钱包', category: '失物招领', description: '在图书馆三楼遗失，内有校园卡和身份证', time: '周三 14:00', location: '图书馆三楼', publisher: '系统 251256767' },
  { id: 2, title: '捡到蓝色雨伞', category: '失物招领', description: '在食堂门口捡到一把蓝色折叠伞', time: '周二 12:30', location: '第一食堂', publisher: '系统 251256767' },
  { id: 3, title: '出售高数教材', category: '二手交易', description: '高等数学第七版，九成新，附赠笔记', time: '随时', location: '宿舍楼A区', publisher: '系统 251256767' },
  { id: 4, title: '转让自行车', category: '二手交易', description: '捷安特山地车，骑了一年，车况良好', time: '周末', location: '校门口', publisher: '系统 251256767' },
  { id: 5, title: '咖啡店招兼职', category: '兼职招聘', description: '校内咖啡店招周末兼职，15元/小时', time: '周末 9:00-17:00', location: '学生活动中心一楼', publisher: '系统 251256767' },
  { id: 6, title: '招家教', category: '兼职招聘', description: '辅导初二数学，每周两次，待遇优厚', time: '工作日晚', location: '校外（可公交直达）', publisher: '系统 251256767' },
  { id: 7, title: '校园歌手大赛', category: '校园活动', description: '第十届校园歌手大赛报名开始，奖金丰厚', time: '下周五 19:00', location: '大礼堂', publisher: '系统 251256767' },
  { id: 8, title: '编程马拉松', category: '校园活动', description: '48小时编程马拉松，组队参赛，免费餐饮', time: '下周末', location: '计算机学院报告厅', publisher: '系统 251256767' },
]

// 模拟网络请求，800ms 延迟后返回数据
export function fetchDemands() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockData])
    }, 800)
  })
}
