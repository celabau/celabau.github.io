/*
 * 唯一数据源。以后要加一个学生 / 一篇论文 / 一条 highlight,
 * 只需要在这个文件里对应的数组里加一条,保存后刷新网页即可看到,不用改任何 HTML。
 * 纯 JS 对象数组,双击打开 index.html 也能直接跑(无需构建、无需第三方库)。
 *
 * 数据来源:
 *  - https://researchers.adelaide.edu.au/profile/ivan.lee (官方 profile,2026-09 抓取)
 *  - https://scholar.google.com/citations?user=Pwc4CkgAAAAJ (Google Scholar,2026-09 二次核对)
 *  - materials/research_overview.docx (学者本人提供的 CV/研究概览,2026-09)
 */

const SITE = {
  name: "Ivan Lee",
  labName: "VISA Lab",
  labFullName: "Vision, Intelligent Sensing & Analytics Lab",
  affiliation: "School of Computer Science and Information Technology, Adelaide University",
  email: "ivan.lee@adelaide.edu.au",
  scholarUrl: "https://scholar.google.com/citations?user=Pwc4CkgAAAAJ&hl=en",
  profileUrl: "https://researchers.adelaide.edu.au/profile/ivan.lee",
  // 学者本人 CV 概览文档里的一句话总结(逐字引用,未改写)
  tagline:
    "Combined hardware and software expertise with applied machine learning, to support end-to-end solutions — data collection, networking, processing, and analysis — with applications in agriculture, health, defence, public service, mining, manufacturing and entertainment.",
  applicationDomains: ["Agriculture", "Health", "Defence", "Public Service", "Mining", "Manufacturing", "Entertainment", "Forestry"],
  // h_index / i10_index / citations 已亲自二次核对 Google Scholar (2026-09),可信
  // publications 总数未能独立核实,只是调研估计值,上线前务必自己核对准确数字
  metrics: {
    hIndex: 42,
    i10Index: 107,
    citations: "7,000+",
    publications: "200+", // TODO: 未独立核实
  },
  lastVerified: "September 2026",
};

// Biography 段落(散文体,取代原先结构化的 Education/Career 表格)。
// 事实来源同上(教育背景来自 CV 概览文档,University of Sydney,文档未给出具体毕业年份;
// 职业履历年份来自官方 profile 页面,机构名称与 CV 概览文档交叉印证一致)。
const BIO = [
  "Ivan Lee is a Professor at Adelaide University, where he serves as Academic Lead for the International and Engagement Portfolio. He holds a PhD, Master of Engineering, Master of Commerce and Bachelor of Engineering, all from the University of Sydney.",
  "His career bridges industry and academia. He began as a software engineer at Cisco Systems in Sydney and later at Remotek Corporation in Taipei, before moving into academia as an Assistant Professor at Ryerson University in Toronto. He then spent close to two decades at the University of South Australia as Senior Lecturer and Associate Professor, including a period as REDI Fellow at Ellex Medical, before joining Adelaide University as Professor.",
];

// 三大研究支柱,按学者本人 CV 概览文档的原始分类整理(未做重新归纳)
// pubThemes: 关联到 PUBLICATIONS 里 theme 字段的映射,用于在本页展示代表性论文
const RESEARCH_THEMES = [
  {
    key: "sensors",
    title: "Intelligent Sensors",
    summary: "Computational imaging and functional materials that turn physical signals into data. This is the perception layer underlying the lab's other work.",
    pubThemes: ["sensing"],
    subareas: [
      {
        title: "Computational Imaging",
        items: [
          "Digital inline holographic microscopy",
          "Pinhole imaging & hologram reconstruction",
          "OCT-guided transscleral selective laser trabeculoplasty (TSLT) for glaucoma treatment",
          "Metalens fabrication with 2-photon polymerisation (2PP)",
        ],
      },
    ],
  },
  {
    key: "multimedia",
    title: "Multimedia Systems",
    summary: "Tracking, imaging and robotics, spanning low-latency multi-object tracking to hyperspectral imaging for food safety and clinical diagnosis.",
    pubThemes: ["vision", "hyperspectral"],
    subareas: [
      {
        title: "Multi-Object Tracking",
        items: [
          "Low-latency multiple object tracking",
          "Synchrotron XCT for in-vivo diagnosis of cystic fibrosis",
          "Snail and slug detection & tracking for pest control",
          "360° human subject detection, tracking & posture recognition",
        ],
      },
      {
        title: "Image Analysis",
        items: [
          "Synchrotron XCT/XFM for plant phenotyping & micronutrient analysis (with Prof. Enzo Lombi, Prof. Peter Kopittke, UQ)",
          "Almond quality grading & aflatoxin detection (with Prof. Chandra Singh, A/Prof. Sang-Heon Lee)",
        ],
      },
      {
        title: "Intelligent Robots",
        items: ["Pathology lab automation", "Yield forecasting", "Underwater ecosystem analysis", "Robot-based in-situ fall assistance"],
      },
      {
        title: "Machine Learning",
        items: ["Saliency prediction", "Neural architecture search", "Explainable AI"],
      },
    ],
  },
  {
    key: "data",
    title: "Data Analytics",
    summary: "General-purpose methodology in graph learning, complexity science and scholarly analytics, applied to trade networks, citation graphs and research collaboration.",
    pubThemes: ["data"],
    subareas: [
      {
        title: "Complexity Models",
        items: [
          "Economic complexity & revealed comparative advantage in trade networks",
          "Ubiquity vs diversity analysis",
          "Motif similarity between research institutes",
        ],
      },
      {
        title: "Scholarly Data Analytics",
        items: [
          "Altmetrics-based bibliographic analysis (Twitter/Facebook)",
          "Identifying anomalous citations for objective article impact evaluation",
          "Scientific article recommendation via author relations & preferences",
          "Collaborative team recognition",
        ],
      },
    ],
  },
];

// 数据来源: https://researchers.adelaide.edu.au/profile/ivan.lee (2026-09 抓取,标题/年份/期刊)
// 完整引用(作者/卷期/页码/DOI)来自 Google Scholar + Crossref + 各出版商页面交叉核对 (2026-09)
// 仅收录该官方页面列出的代表性成果,未包含千人级合著的 Global Burden of Disease 系列论文
// (那些论文他只是数百/数千合著者之一,不代表其独立研究方向,故不作为代表作展示)
// ⚠️ 第3条(Toxins 2026)MDPI 页面标注 Ivan Lee 所属机构为 University of South Australia 而非
// Adelaide——与第4/6条同一批合著者(Kabir + Sang-Heon Lee),大概率是同一人,但未独立核实身份,上线前请确认
const PUBLICATIONS = [
  { year: 2026, title: "Multi-modal multi-objective firefly algorithm with multi-stage niches and route planning application", authors: ["Li Lv", "Wen-Lai Xing", "Jeng-Shyang Pan", "Hui Wang", "Run-Xiu Wu", "Ivan Lee"], venue: "Expert Systems with Applications", volume: "296", pages: "art. 129264", doi: "10.1016/j.eswa.2025.129264", theme: "data" },
  { year: 2026, title: "RMTrans: Robust Multimodal Transformers for Patient Prognosis under Backdoor Threats", authors: ["Tao Tang", "Guoqing Han", "Renqiang Luo", "Feng Ding", "Shuo Yu", "Ivan Lee"], venue: "ACM Transactions on Intelligent Systems and Technology", volume: "17", issue: "3", pages: "1–25", doi: "10.1145/3749989", theme: "hyperspectral" },
  { year: 2025, title: "Correlation Awareness Evolutionary Sparse Hybrid Spectral Band Selection Algorithm to Detect Aflatoxin B1 Contaminated Almonds Using Hyperspectral Images", authors: ["Md Ahasan Kabir", "Ivan Lee", "Chandra B. Singh", "Gayatri Mishra", "Brajesh Kumar Panda", "Sang-Heon Lee"], venue: "Food Chemistry", volume: "476", pages: "art. 143381", doi: "10.1016/j.foodchem.2025.143381", theme: "hyperspectral" },
  { year: 2025, title: "Detection of Mycotoxins in Cereal Grains and Nuts Using Machine Learning Integrated Hyperspectral Imaging: A Review", authors: ["Md Ahasan Kabir", "Ivan Lee", "Chandra B. Singh", "Gayatri Mishra", "Brajesh Kumar Panda", "Sang-Heon Lee"], venue: "Toxins", volume: "17", issue: "5", pages: "art. 219", doi: "10.3390/toxins17050219", theme: "hyperspectral" },
  { year: 2024, title: "Heterogeneous Network Motif Coding, Counting, and Profiling", authors: ["Shuo Yu", "Feng Xia", "Honglong Chen", "Ivan Lee", "Lianhua Chi", "Hanghang Tong"], venue: "ACM Transactions on Knowledge Discovery from Data", volume: "18", issue: "9", pages: "1–21", doi: "10.1145/3687465", theme: "data" },
  { year: 2023, title: "Graph Learning for Anomaly Analytics: Algorithms, Applications, and Challenges", authors: ["Jing Ren", "Feng Xia", "Ivan Lee", "Azadeh Noori Hoshyar", "Charu Aggarwal"], venue: "ACM Transactions on Intelligent Systems and Technology", volume: "14", issue: "2", pages: "1–29", doi: "10.1145/3570906", theme: "data" },
  { year: 2023, title: "Density Peaks Clustering Algorithm Based on Fuzzy and Weighted Shared Neighbor for Uneven Density Datasets", authors: ["Jia Zhao", "Gang Wang", "Jeng-Shyang Pan", "Tanghuai Fan", "Ivan Lee"], venue: "Pattern Recognition", volume: "139", pages: "art. 109406", doi: "10.1016/j.patcog.2023.109406", theme: "data" },
  { year: 2022, title: "NEAR: Named Entity and Attribute Recognition of Clinical Concepts", authors: ["Namrata Nath", "Sang-Heon Lee", "Ivan Lee"], venue: "Journal of Biomedical Informatics", volume: "130", pages: "art. 104092", doi: "10.1016/j.jbi.2022.104092", theme: "hyperspectral" },
  { year: 2022, title: "CHIEF: Clustering With Higher-Order Motifs in Big Networks", authors: ["Feng Xia", "Shuo Yu", "Chengfei Liu", "Jianxin Li", "Ivan Lee"], venue: "IEEE Transactions on Network Science and Engineering", volume: "9", issue: "3", pages: "990–1005", doi: "10.1109/TNSE.2021.3108974", theme: "data" },
  { year: 2022, title: "On-Device Saliency Prediction Based on Pseudoknowledge Distillation", authors: ["Ayaz Umer", "Chakkrit Termritthikun", "Tie Qiu", "Philip H. W. Leong", "Ivan Lee"], venue: "IEEE Transactions on Industrial Informatics", volume: "18", issue: "9", pages: "6317–6325", doi: "10.1109/TII.2022.3153365", theme: "vision" },
  { year: 2021, title: "The Quest for Better Clinical Word Vectors: Ontology Based and Lexical Vector Augmentation Versus Clinical Contextual Embeddings", authors: ["Namrata Nath", "Sang-Heon Lee", "Mark D. McDonnell", "Ivan Lee"], venue: "Computers in Biology and Medicine", volume: "134", pages: "art. 104433", doi: "10.1016/j.compbiomed.2021.104433", theme: "hyperspectral" },
  { year: 2019, title: "A Path Beyond Metal and Silicon: Polymer/Nanomaterial Composites for Stretchable Strain Sensors", authors: ["Aidong Qiu", "Peilin Li", "Zhaokun Yang", "Yu Yao", "Ivan Lee", "Jun Ma"], venue: "Advanced Functional Materials", volume: "29", issue: "17", pages: "art. 1806306", doi: "10.1002/adfm.201806306", theme: "sensing" },
];

// 以下均为官方 profile 页面 (https://researchers.adelaide.edu.au/profile/ivan.lee, 2026-09 抓取) 列出的
// 可核实事实,未做推测或润色
const AWARDS = [
  { year: "2024", text: "Named to The Australian's \"Research Field Leaders\" list." },
  { year: "2022–2023", text: "REDI Fellow, Ellex Medical." },
  { year: "2020", text: "Vannevar Bush Best Paper Honorable Mention, Joint Conference on Digital Libraries (JCDL)." },
  { year: "2015", text: "Best Paper Award (Lockheed Martin), SPIE Defense + Security." },
  { year: "2007", text: "Best Paper Award, Pacific-Rim Conference on Multimedia." },
];

const SERVICE = [
  { text: "Associate Editor, IEEE Transactions on Multimedia (current)." },
  { text: "Associate Editor / Editorial Board Member (former), IEEE Communications Surveys & Tutorials." },
  { text: "Associate Editor (former), IEEE Transactions on Neural Networks and Learning Systems." },
  { text: "General Co-Chair, IEEE MIPR 2026." },
  { text: "General Co-Chair, IIH-MSP 2015." },
  { text: "General Chair, Australasian Computer Science Week (ACSW) 2013." },
  { text: "Program Co-Chair, ACM CIVR 2008." },
];

// 科研经费概况(官方 profile 页面汇总数字,非逐条列出的项目清单)
const FUNDING_NOTE =
  "Chief Investigator on 37 funded research projects (19 as sole or lead CI), including 6 nationally competitive grants (3 as sole or lead CI), from funding bodies in Australia and Canada.";

// 合作者(来自 CV 概览文档 research_overview.docx,按具体课题标注;文档未给出机构隶属,已注明的除外)
const COLLABORATORS = [
  { name: "Prof. Jun Ma", note: "Strain sensors & stretchable conductors (graphene/silicon rubber composites)" },
  { name: "Prof. Yan Zhuge", note: "Self-sensing concrete" },
  { name: "Dr. Bruce Wedding", note: "Transparent wood" },
  { name: "Prof. Enzo Lombi", note: "Synchrotron XCT/XFM for plant phenotyping & micronutrient analysis" },
  { name: "Prof. Peter Kopittke", affiliation: "University of Queensland", note: "Synchrotron XCT/XFM for plant phenotyping & micronutrient analysis" },
  { name: "Prof. Chandra Singh", note: "Almond quality grading & aflatoxin detection" },
  { name: "A/Prof. Sang-Heon Lee", note: "Almond quality grading & aflatoxin detection, and hyperspectral imaging (co-author on multiple 2025–2026 publications)" },
];

// 合作机构/资助方 logo(裁自 CV 概览文档 research_overview.docx 里"Collaborators and Sponsors"页,
// 按学者本人原始分组保留;图片存于 assets/img/sponsors/,与文中 applicationDomains 标签呼应)
const SPONSOR_GROUPS = [
  { key: "health", label: "Health", img: "assets/img/sponsors/health.png" },
  { key: "agriculture-forestry", label: "Agriculture & Forestry", img: "assets/img/sponsors/agriculture-forestry.png" },
  { key: "manufacturing", label: "Manufacturing", img: "assets/img/sponsors/manufacturing.png" },
  { key: "defence", label: "Defence", img: "assets/img/sponsors/defence.png" },
  { key: "research-computing", label: "Research Infrastructure & Computing", img: "assets/img/sponsors/research-computing.png" },
  { key: "universities", label: "Universities", img: "assets/img/sponsors/universities.png" },
];

// 在研 PhD 课题方向(来自 CV 概览文档;文档未给出具体学生姓名,故按课题而非人名展示)
// 这是"实验室目前在做什么"的宽泛叙事,和下面 OPEN_PROJECTS(官网当前正式招生项目)是两回事,都保留
const CURRENT_PROJECTS = [
  "CT image segmentation for root structure analysis",
  "Robot-assisted clinical lab automation",
  "AR-supported training",
  "AI-assisted QC in hospital management",
  "LM-based medical report generation",
];

// 官方"Find a research project"页面上当前正式挂出的招生项目(2026-09 抓取,逐字摘录未改写)。
// ⚠️ 该页面会随时变动/下架,这里是静态快照,不会自动更新——上线后请定期回官网核对,过期了就整段删掉或替换。
// 来源: https://www.adelaide.edu.au/research/research-degrees/research-projects/ (搜索 "Ivan Lee")
const OPEN_PROJECTS = [
  {
    title: "SRTSR0271 Automated Root Segmentation in Complex Soils: Analysing Root Responses to Soil Amendments",
    area: "Information and Computing Sciences",
    theme: "Food, Agriculture and Wine",
    supervisorTitle: "Professor Ivan Lee",
    description:
      "Food security is increasingly threatened by drought and nutrient volatility. Biochar, a carbon-rich soil amendment produced from agricultural waste, has emerged as a promising solution. However, the mechanisms driving biochar's influence to root growth remain unclear. This research bridges the gap between soil science and computer vision by using X-ray and neutron CT scanning to examine the root structure in biochar-treated soil. This project will develop an imaging pipeline, using AI to assist volumetric root annotation and segmentation directly from X-ray or neutron projections.",
    note: "Signature Research Theme (SRT) Scholarship round. Expression of Interest due 30 September 2026. Citizenship requirement applies (Australian citizens and eligible foreign countries only).",
    applyNow: true,
  },
  {
    title: "AI-enabled Human-Robot Teaming with Heterogeneous Multi-Robot Systems",
    area: "Agricultural, Veterinary and Food Sciences, Environmental Sciences, Information and Computing Sciences",
    theme: "Food, Agriculture and Wine",
    supervisorTitle: "Associate Professor Ivan Lee",
    description:
      "This project aims to design an interface that leverages machine learning, augmented reality (AR), and haptic feedback technologies to enable more natural and responsive control of robotic systems, advancing collaborative robotics with intuitive interfaces for directing robotic swarms. The student will join a research group equipped with quadcopters, collaborative robots, mobile platforms, and underwater remotely operated vehicles (ROVs). Students are welcome to propose alternative research topics aligned with the lab's broader goals.",
    note: null,
    applyNow: false,
  },
  {
    title: "Physics-informed neural networks (PINNs) to model and characterise transparent wood",
    area: "Physical Sciences, Chemical Sciences, Information and Computing Sciences",
    theme: "Sustainable Green Transition",
    supervisorTitle: "Associate Professor Ivan Lee",
    description:
      "This project applies Physics-Informed Neural Networks to model the 3D structure of wood from CT scans, simulate the delignification and infiltration process, and characterize the optical properties of transparent wood. This interdisciplinary project can be divided into multiple sub-topics within AI/computer science, physics, or chemistry. Potential research areas include, but are not limited to, battery materials, concrete science, and wood composites.",
    note: null,
    applyNow: false,
  },
  {
    title: "Efficient AI Agent Architectures for Medical Image Analysis",
    area: "Biomedical and Clinical Sciences, Information and Computing Sciences",
    theme: "Personal and Societal Health",
    supervisorTitle: "Associate Professor Ivan Lee",
    description:
      "AI agents are autonomous systems capable of perceiving their environment, making decisions, and taking actions to achieve specific goals. This research focuses on developing scalable AI agent architectures designed to operate effectively in resource-constrained healthcare settings. Potential research areas include, but are not limited to, image/video generation, multi-object tracking, computational imaging, and robotics vision.",
    note: null,
    applyNow: false,
  },
];

const TEAM = {
  pi: {
    name: "Prof Ivan Lee",
    title: "Professor · Academic Lead · International and Engagement Portfolio Lead",
    affiliation: "School of Computer Science and Information Technology, Adelaide University",
    photo: "", // TODO: 放真实照片到 assets/img/team/ivan-lee.jpg 后填 "assets/img/team/ivan-lee.jpg"
    bioShort: "Prof Ivan Lee works across intelligent sensors, multimedia systems, and data analytics, combining hardware and software expertise with applied machine learning. He is an Associate Editor of IEEE Transactions on Multimedia and General Co-Chair of IEEE MIPR 2026.",
    links: [
      { label: "Google Scholar", url: "https://scholar.google.com/citations?user=Pwc4CkgAAAAJ&hl=en" },
      { label: "University Profile", url: "https://researchers.adelaide.edu.au/profile/ivan.lee" },
      { label: "Email", url: "mailto:ivan.lee@adelaide.edu.au" },
    ],
  },
  // TODO(需要补充真实名单后再上线): 目前公开资料中未包含具体在读学生姓名(CV 只列了课题方向,见 CURRENT_PROJECTS)。
  // 按下面格式逐条加,保存刷新即可看到:
  // { name: "Jane Doe", level: "PhD Candidate", topic: "Hyperspectral imaging for food contaminant detection", photo: "assets/img/students/jane-doe.jpg" }
  students: [],
  // TODO: 同上,暂无公开可核实的毕业生名单。格式:
  // { name: "John Smith", level: "PhD", year: 2024, destination: "Postdoc, XYZ University" }
  alumni: [],
};
