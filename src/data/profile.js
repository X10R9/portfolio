export const profile = {
  name: '徐茹',
  latin: 'XU RU',
  monogram: 'XR',
  grade: '2024 级',
  school: '大连民族大学',
  major: '物联网工程',
  location: '大连 · 中国',
  coords: '38.91°N / 121.60°E',
  email: 'X10R9@outlook.com',
  // 留空时关于区显示排版化的占位肖像；放入 public/images/portrait.jpg 后自动替换。
  portrait: '',
  availability: '开放课程合作与项目交流',
  lede: '徐茹，大连民族大学物联网工程 2024 级。从传感器与嵌入式，到平台与界面，把课程里的想法做到能运行。',
  intro: [
    '我在读物联网工程，关心的是「设备如何被理解」：从 LM35 输出的一小段电压、单片机读到的一帧数据，到平台上一条可检索的记录，最后变成别人能看懂的一张界面。',
    '课程项目之外，我在补前端和机器学习的基础。做东西的习惯是先让它跑起来，再回头补原理；留下的每个项目都尽量能演示、能复现，而不只是交一次作业。',
  ],
  focus: ['嵌入式采集', '物联网平台', '端侧智能'],
  current: 'Vue 3 · Element Plus · 小语言模型',
  stats: [
    { value: '04', label: '精选项目', note: 'Selected works' },
    { value: '03', label: '技术方向', note: 'Embedded / IoT / Web' },
    { value: '02', label: '课程设计', note: 'Coursework' },
    { value: '01', label: '浏览器扩展', note: 'Edge · Manifest V3' },
  ],
  timeline: [
    {
      year: '2026',
      title: '云枢 IoT · 智能设备管理平台',
      note: '独立完成 · Vue 3 + Element Plus'
    },
    {
      year: '2026.03',
      title: '数显温度计',
      note: '电子技术课程设计 · 2 人合作'
    },
    {
      year: '2026',
      title: '电商图片提取助手',
      note: '独立完成 · Edge 扩展'
    },
    {
      year: '2026',
      title: '软件实训 · 小语言模型',
      note: '课程实践 · Tokenizer / 预训练 / LoRA'
    }
  ]
}
