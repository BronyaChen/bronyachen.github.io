document.addEventListener('DOMContentLoaded', function() {
    // ==================== 全局数据定义 ====================
    
    // 主体数据 - 不同主体有不同行业
    const entities = [
        { id: 'huanan', name: '华南分公司', industry: '本地生活' },
        { id: 'dongnan', name: '东南分公司', industry: '本地生活' },
        { id: 'xinan', name: '西南分公司', industry: '教育培训' },
    ];

    // 不同行业的漏斗阶段定义
    const industryStages = {
        '本地生活': ['曝光', '点击', '加粉', '开口', '留资', '到店', '下单'],
        '教育培训': ['曝光', '点击', '加粉', '开口', '留资', '课程签到', '下单'],
    };

    // 转化率名称映射
    const rateNames = {
        '曝光-点击': '点击率',
        '点击-加粉': '加粉率',
        '加粉-开口': '开口率',
        '开口-留资': '留资率',
        '留资-到店': '到店率',
        '留资-课程签到': '签到率',
        '到店-下单': '下单率',
        '课程签到-下单': '下单率',
    };

    // 各主体的客户漏斗数据
    const entityFunnelData = {
        huanan: {
            stages: [
                { name: '曝光', value: 186520, trend: 8.42 },
                { name: '点击', value: 12840, trend: 2.17 },
                { name: '加粉', value: 4000, trend: 24.90 },
                { name: '开口', value: 2032, trend: 28.49 },
                { name: '留资', value: 1800, trend: 32.87 },
                { name: '到店', value: 1200, trend: 17.43 },
                { name: '下单', value: 800, trend: 21.76 },
            ],
            rates: [
                { name: '点击率', value: 6.88, trend: 2.31, up: true },
                { name: '加粉率', value: 31.15, trend: 6.25, up: true },
                { name: '开口率', value: 50.80, trend: 31.00, up: true },
                { name: '留资率', value: 88.58, trend: 28.48, up: false },
                { name: '到店率', value: 66.67, trend: 12.46, up: false },
                { name: '下单率', value: 66.67, trend: 18.34, up: true },
            ],
            portraits: {
                '曝光': { region: [{n:'广东',p:35},{n:'湖南',p:22},{n:'广西',p:18},{n:'福建',p:15},{n:'其他',p:10}], gender: [{n:'男',p:45},{n:'女',p:55}], age: [{n:'18-24',p:18},{n:'25-34',p:38},{n:'35-44',p:28},{n:'45+',p:16}], education: [{n:'高中',p:22},{n:'大专',p:32},{n:'本科',p:38},{n:'硕士+',p:8}], marriage: [{n:'未婚',p:40},{n:'已婚',p:52},{n:'其他',p:8}], consumption: [{n:'高',p:12},{n:'中高',p:28},{n:'中等',p:38},{n:'中低',p:15},{n:'低',p:7}], phone: [{n:'iPhone',p:35},{n:'华为',p:28},{n:'小米',p:15},{n:'OPPO',p:10},{n:'其他',p:12}] },
                '点击': { region: [{n:'广东',p:38},{n:'湖南',p:20},{n:'广西',p:17},{n:'福建',p:16},{n:'其他',p:9}], gender: [{n:'男',p:42},{n:'女',p:58}], age: [{n:'18-24',p:20},{n:'25-34',p:40},{n:'35-44',p:26},{n:'45+',p:14}], education: [{n:'高中',p:18},{n:'大专',p:30},{n:'本科',p:42},{n:'硕士+',p:10}], marriage: [{n:'未婚',p:38},{n:'已婚',p:54},{n:'其他',p:8}], consumption: [{n:'高',p:14},{n:'中高',p:30},{n:'中等',p:36},{n:'中低',p:13},{n:'低',p:7}], phone: [{n:'iPhone',p:38},{n:'华为',p:26},{n:'小米',p:14},{n:'OPPO',p:10},{n:'其他',p:12}] },
                '加粉': { region: [{n:'广东',p:40},{n:'湖南',p:19},{n:'广西',p:16},{n:'福建',p:17},{n:'其他',p:8}], gender: [{n:'男',p:38},{n:'女',p:62}], age: [{n:'18-24',p:22},{n:'25-34',p:42},{n:'35-44',p:24},{n:'45+',p:12}], education: [{n:'高中',p:15},{n:'大专',p:28},{n:'本科',p:45},{n:'硕士+',p:12}], marriage: [{n:'未婚',p:35},{n:'已婚',p:56},{n:'其他',p:9}], consumption: [{n:'高',p:16},{n:'中高',p:32},{n:'中等',p:34},{n:'中低',p:12},{n:'低',p:6}], phone: [{n:'iPhone',p:42},{n:'华为',p:24},{n:'小米',p:13},{n:'OPPO',p:9},{n:'其他',p:12}] },
                '开口': { region: [{n:'广东',p:42},{n:'湖南',p:18},{n:'广西',p:15},{n:'福建',p:18},{n:'其他',p:7}], gender: [{n:'男',p:35},{n:'女',p:65}], age: [{n:'18-24',p:24},{n:'25-34',p:44},{n:'35-44',p:22},{n:'45+',p:10}], education: [{n:'高中',p:12},{n:'大专',p:26},{n:'本科',p:48},{n:'硕士+',p:14}], marriage: [{n:'未婚',p:32},{n:'已婚',p:58},{n:'其他',p:10}], consumption: [{n:'高',p:18},{n:'中高',p:34},{n:'中等',p:32},{n:'中低',p:10},{n:'低',p:6}], phone: [{n:'iPhone',p:46},{n:'华为',p:22},{n:'小米',p:12},{n:'OPPO',p:8},{n:'其他',p:12}] },
                '留资': { region: [{n:'广东',p:44},{n:'湖南',p:17},{n:'广西',p:14},{n:'福建',p:19},{n:'其他',p:6}], gender: [{n:'男',p:32},{n:'女',p:68}], age: [{n:'18-24',p:25},{n:'25-34',p:46},{n:'35-44',p:20},{n:'45+',p:9}], education: [{n:'高中',p:10},{n:'大专',p:24},{n:'本科',p:50},{n:'硕士+',p:16}], marriage: [{n:'未婚',p:30},{n:'已婚',p:60},{n:'其他',p:10}], consumption: [{n:'高',p:20},{n:'中高',p:36},{n:'中等',p:30},{n:'中低',p:9},{n:'低',p:5}], phone: [{n:'iPhone',p:50},{n:'华为',p:20},{n:'小米',p:12},{n:'OPPO',p:7},{n:'其他',p:11}] },
                '到店': { region: [{n:'广东',p:48},{n:'湖南',p:16},{n:'广西',p:12},{n:'福建',p:18},{n:'其他',p:6}], gender: [{n:'男',p:30},{n:'女',p:70}], age: [{n:'18-24',p:28},{n:'25-34',p:48},{n:'35-44',p:18},{n:'45+',p:6}], education: [{n:'高中',p:8},{n:'大专',p:22},{n:'本科',p:52},{n:'硕士+',p:18}], marriage: [{n:'未婚',p:28},{n:'已婚',p:62},{n:'其他',p:10}], consumption: [{n:'高',p:22},{n:'中高',p:38},{n:'中等',p:28},{n:'中低',p:8},{n:'低',p:4}], phone: [{n:'iPhone',p:54},{n:'华为',p:18},{n:'小米',p:11},{n:'OPPO',p:7},{n:'其他',p:10}] },
                '下单': { region: [{n:'广东',p:50},{n:'湖南',p:15},{n:'广西',p:10},{n:'福建',p:19},{n:'其他',p:6}], gender: [{n:'男',p:28},{n:'女',p:72}], age: [{n:'18-24',p:30},{n:'25-34',p:50},{n:'35-44',p:15},{n:'45+',p:5}], education: [{n:'高中',p:6},{n:'大专',p:20},{n:'本科',p:54},{n:'硕士+',p:20}], marriage: [{n:'未婚',p:25},{n:'已婚',p:65},{n:'其他',p:10}], consumption: [{n:'高',p:25},{n:'中高',p:40},{n:'中等',p:25},{n:'中低',p:6},{n:'低',p:4}], phone: [{n:'iPhone',p:58},{n:'华为',p:16},{n:'小米',p:10},{n:'OPPO',p:7},{n:'其他',p:9}] },
            }
        },
        dongnan: {
            stages: [
                { name: '曝光', value: 152300, trend: 5.20 },
                { name: '点击', value: 9860, trend: -1.30 },
                { name: '加粉', value: 3200, trend: 18.50 },
                { name: '开口', value: 1650, trend: 22.10 },
                { name: '留资', value: 1450, trend: 28.30 },
                { name: '到店', value: 980, trend: 14.20 },
                { name: '下单', value: 650, trend: 19.50 },
            ],
            rates: [
                { name: '点击率', value: 6.47, trend: 1.80, up: true },
                { name: '加粉率', value: 32.45, trend: 5.10, up: true },
                { name: '开口率', value: 51.56, trend: 28.00, up: true },
                { name: '留资率', value: 87.88, trend: 26.50, up: false },
                { name: '到店率', value: 67.59, trend: 10.30, up: false },
                { name: '下单率', value: 66.33, trend: 16.80, up: true },
            ],
            portraits: {
                '曝光': { region: [{n:'浙江',p:40},{n:'江苏',p:28},{n:'上海',p:18},{n:'安徽',p:8},{n:'其他',p:6}], gender: [{n:'男',p:48},{n:'女',p:52}], age: [{n:'18-24',p:22},{n:'25-34',p:36},{n:'35-44',p:26},{n:'45+',p:16}], education: [{n:'高中',p:20},{n:'大专',p:34},{n:'本科',p:38},{n:'硕士+',p:8}], marriage: [{n:'未婚',p:42},{n:'已婚',p:50},{n:'其他',p:8}], consumption: [{n:'高',p:14},{n:'中高',p:30},{n:'中等',p:36},{n:'中低',p:13},{n:'低',p:7}], phone: [{n:'iPhone',p:38},{n:'华为',p:26},{n:'小米',p:14},{n:'OPPO',p:11},{n:'其他',p:11}] },
                '点击': { region: [{n:'浙江',p:42},{n:'江苏',p:27},{n:'上海',p:19},{n:'安徽',p:7},{n:'其他',p:5}], gender: [{n:'男',p:44},{n:'女',p:56}], age: [{n:'18-24',p:24},{n:'25-34',p:38},{n:'35-44',p:24},{n:'45+',p:14}], education: [{n:'高中',p:17},{n:'大专',p:31},{n:'本科',p:42},{n:'硕士+',p:10}], marriage: [{n:'未婚',p:40},{n:'已婚',p:52},{n:'其他',p:8}], consumption: [{n:'高',p:16},{n:'中高',p:32},{n:'中等',p:34},{n:'中低',p:12},{n:'低',p:6}], phone: [{n:'iPhone',p:40},{n:'华为',p:24},{n:'小米',p:14},{n:'OPPO',p:10},{n:'其他',p:12}] },
                '加粉': { region: [{n:'浙江',p:44},{n:'江苏',p:26},{n:'上海',p:20},{n:'安徽',p:6},{n:'其他',p:4}], gender: [{n:'男',p:40},{n:'女',p:60}], age: [{n:'18-24',p:26},{n:'25-34',p:40},{n:'35-44',p:22},{n:'45+',p:12}], education: [{n:'高中',p:14},{n:'大专',p:28},{n:'本科',p:46},{n:'硕士+',p:12}], marriage: [{n:'未婚',p:38},{n:'已婚',p:54},{n:'其他',p:8}], consumption: [{n:'高',p:18},{n:'中高',p:34},{n:'中等',p:32},{n:'中低',p:10},{n:'低',p:6}], phone: [{n:'iPhone',p:44},{n:'华为',p:22},{n:'小米',p:13},{n:'OPPO',p:9},{n:'其他',p:12}] },
                '开口': { region: [{n:'浙江',p:46},{n:'江苏',p:25},{n:'上海',p:20},{n:'安徽',p:5},{n:'其他',p:4}], gender: [{n:'男',p:36},{n:'女',p:64}], age: [{n:'18-24',p:28},{n:'25-34',p:42},{n:'35-44',p:20},{n:'45+',p:10}], education: [{n:'高中',p:11},{n:'大专',p:25},{n:'本科',p:50},{n:'硕士+',p:14}], marriage: [{n:'未婚',p:35},{n:'已婚',p:56},{n:'其他',p:9}], consumption: [{n:'高',p:20},{n:'中高',p:36},{n:'中等',p:30},{n:'中低',p:9},{n:'低',p:5}], phone: [{n:'iPhone',p:48},{n:'华为',p:20},{n:'小米',p:12},{n:'OPPO',p:8},{n:'其他',p:12}] },
                '留资': { region: [{n:'浙江',p:47},{n:'江苏',p:24},{n:'上海',p:21},{n:'安徽',p:5},{n:'其他',p:3}], gender: [{n:'男',p:33},{n:'女',p:67}], age: [{n:'18-24',p:30},{n:'25-34',p:44},{n:'35-44',p:18},{n:'45+',p:8}], education: [{n:'高中',p:9},{n:'大专',p:22},{n:'本科',p:53},{n:'硕士+',p:16}], marriage: [{n:'未婚',p:32},{n:'已婚',p:58},{n:'其他',p:10}], consumption: [{n:'高',p:22},{n:'中高',p:38},{n:'中等',p:28},{n:'中低',p:8},{n:'低',p:4}], phone: [{n:'iPhone',p:52},{n:'华为',p:18},{n:'小米',p:12},{n:'OPPO',p:8},{n:'其他',p:10}] },
                '到店': { region: [{n:'浙江',p:48},{n:'江苏',p:23},{n:'上海',p:22},{n:'安徽',p:4},{n:'其他',p:3}], gender: [{n:'男',p:31},{n:'女',p:69}], age: [{n:'18-24',p:32},{n:'25-34',p:46},{n:'35-44',p:16},{n:'45+',p:6}], education: [{n:'高中',p:7},{n:'大专',p:20},{n:'本科',p:55},{n:'硕士+',p:18}], marriage: [{n:'未婚',p:30},{n:'已婚',p:60},{n:'其他',p:10}], consumption: [{n:'高',p:24},{n:'中高',p:40},{n:'中等',p:26},{n:'中低',p:6},{n:'低',p:4}], phone: [{n:'iPhone',p:56},{n:'华为',p:16},{n:'小米',p:11},{n:'OPPO',p:7},{n:'其他',p:10}] },
                '下单': { region: [{n:'浙江',p:50},{n:'江苏',p:22},{n:'上海',p:22},{n:'安徽',p:3},{n:'其他',p:3}], gender: [{n:'男',p:28},{n:'女',p:72}], age: [{n:'18-24',p:34},{n:'25-34',p:48},{n:'35-44',p:14},{n:'45+',p:4}], education: [{n:'高中',p:5},{n:'大专',p:18},{n:'本科',p:57},{n:'硕士+',p:20}], marriage: [{n:'未婚',p:28},{n:'已婚',p:63},{n:'其他',p:9}], consumption: [{n:'高',p:28},{n:'中高',p:42},{n:'中等',p:22},{n:'中低',p:5},{n:'低',p:3}], phone: [{n:'iPhone',p:60},{n:'华为',p:14},{n:'小米',p:10},{n:'OPPO',p:7},{n:'其他',p:9}] },
            }
        },
        xinan: {
            stages: [
                { name: '曝光', value: 98000, trend: 3.50 },
                { name: '点击', value: 7200, trend: -0.80 },
                { name: '加粉', value: 2500, trend: 15.20 },
                { name: '开口', value: 1300, trend: 19.80 },
                { name: '留资', value: 1100, trend: 25.40 },
                { name: '课程签到', value: 720, trend: 12.60 },
                { name: '下单', value: 480, trend: 16.30 },
            ],
            rates: [
                { name: '点击率', value: 7.35, trend: 1.20, up: true },
                { name: '加粉率', value: 34.72, trend: 4.50, up: true },
                { name: '开口率', value: 52.00, trend: 22.00, up: true },
                { name: '留资率', value: 84.62, trend: 20.10, up: false },
                { name: '签到率', value: 65.45, trend: 8.40, up: false },
                { name: '下单率', value: 66.67, trend: 14.20, up: true },
            ],
            portraits: {
                '曝光': { region: [{n:'四川',p:42},{n:'重庆',p:22},{n:'云南',p:18},{n:'贵州',p:12},{n:'其他',p:6}], gender: [{n:'男',p:46},{n:'女',p:54}], age: [{n:'18-24',p:20},{n:'25-34',p:34},{n:'35-44',p:30},{n:'45+',p:16}], education: [{n:'高中',p:25},{n:'大专',p:30},{n:'本科',p:36},{n:'硕士+',p:9}], marriage: [{n:'未婚',p:44},{n:'已婚',p:48},{n:'其他',p:8}], consumption: [{n:'高',p:8},{n:'中高',p:22},{n:'中等',p:40},{n:'中低',p:20},{n:'低',p:10}], phone: [{n:'iPhone',p:28},{n:'华为',p:32},{n:'小米',p:18},{n:'OPPO',p:12},{n:'其他',p:10}] },
                '点击': { region: [{n:'四川',p:44},{n:'重庆',p:23},{n:'云南',p:16},{n:'贵州',p:11},{n:'其他',p:6}], gender: [{n:'男',p:42},{n:'女',p:58}], age: [{n:'18-24',p:22},{n:'25-34',p:38},{n:'35-44',p:26},{n:'45+',p:14}], education: [{n:'高中',p:20},{n:'大专',p:28},{n:'本科',p:40},{n:'硕士+',p:12}], marriage: [{n:'未婚',p:42},{n:'已婚',p:50},{n:'其他',p:8}], consumption: [{n:'高',p:10},{n:'中高',p:24},{n:'中等',p:38},{n:'中低',p:18},{n:'低',p:10}], phone: [{n:'iPhone',p:30},{n:'华为',p:30},{n:'小米',p:18},{n:'OPPO',p:12},{n:'其他',p:10}] },
                '加粉': { region: [{n:'四川',p:46},{n:'重庆',p:24},{n:'云南',p:14},{n:'贵州',p:10},{n:'其他',p:6}], gender: [{n:'男',p:38},{n:'女',p:62}], age: [{n:'18-24',p:24},{n:'25-34',p:42},{n:'35-44',p:22},{n:'45+',p:12}], education: [{n:'高中',p:16},{n:'大专',p:26},{n:'本科',p:46},{n:'硕士+',p:12}], marriage: [{n:'未婚',p:38},{n:'已婚',p:54},{n:'其他',p:8}], consumption: [{n:'高',p:12},{n:'中高',p:26},{n:'中等',p:36},{n:'中低',p:16},{n:'低',p:10}], phone: [{n:'iPhone',p:34},{n:'华为',p:28},{n:'小米',p:16},{n:'OPPO',p:12},{n:'其他',p:10}] },
                '开口': { region: [{n:'四川',p:48},{n:'重庆',p:24},{n:'云南',p:13},{n:'贵州',p:9},{n:'其他',p:6}], gender: [{n:'男',p:34},{n:'女',p:66}], age: [{n:'18-24',p:26},{n:'25-34',p:44},{n:'35-44',p:20},{n:'45+',p:10}], education: [{n:'高中',p:12},{n:'大专',p:24},{n:'本科',p:50},{n:'硕士+',p:14}], marriage: [{n:'未婚',p:35},{n:'已婚',p:56},{n:'其他',p:9}], consumption: [{n:'高',p:14},{n:'中高',p:28},{n:'中等',p:34},{n:'中低',p:14},{n:'低',p:10}], phone: [{n:'iPhone',p:38},{n:'华为',p:26},{n:'小米',p:15},{n:'OPPO',p:11},{n:'其他',p:10}] },
                '留资': { region: [{n:'四川',p:50},{n:'重庆',p:25},{n:'云南',p:12},{n:'贵州',p:8},{n:'其他',p:5}], gender: [{n:'男',p:30},{n:'女',p:70}], age: [{n:'18-24',p:28},{n:'25-34',p:46},{n:'35-44',p:18},{n:'45+',p:8}], education: [{n:'高中',p:10},{n:'大专',p:22},{n:'本科',p:52},{n:'硕士+',p:16}], marriage: [{n:'未婚',p:32},{n:'已婚',p:58},{n:'其他',p:10}], consumption: [{n:'高',p:16},{n:'中高',p:30},{n:'中等',p:32},{n:'中低',p:13},{n:'低',p:9}], phone: [{n:'iPhone',p:42},{n:'华为',p:24},{n:'小米',p:14},{n:'OPPO',p:10},{n:'其他',p:10}] },
                '课程签到': { region: [{n:'四川',p:52},{n:'重庆',p:24},{n:'云南',p:11},{n:'贵州',p:8},{n:'其他',p:5}], gender: [{n:'男',p:28},{n:'女',p:72}], age: [{n:'18-24',p:30},{n:'25-34',p:48},{n:'35-44',p:16},{n:'45+',p:6}], education: [{n:'高中',p:8},{n:'大专',p:20},{n:'本科',p:54},{n:'硕士+',p:18}], marriage: [{n:'未婚',p:28},{n:'已婚',p:62},{n:'其他',p:10}], consumption: [{n:'高',p:18},{n:'中高',p:32},{n:'中等',p:30},{n:'中低',p:12},{n:'低',p:8}], phone: [{n:'iPhone',p:46},{n:'华为',p:22},{n:'小米',p:13},{n:'OPPO',p:9},{n:'其他',p:10}] },
                '下单': { region: [{n:'四川',p:54},{n:'重庆',p:23},{n:'云南',p:10},{n:'贵州',p:8},{n:'其他',p:5}], gender: [{n:'男',p:26},{n:'女',p:74}], age: [{n:'18-24',p:32},{n:'25-34',p:50},{n:'35-44',p:14},{n:'45+',p:4}], education: [{n:'高中',p:6},{n:'大专',p:18},{n:'本科',p:56},{n:'硕士+',p:20}], marriage: [{n:'未婚',p:24},{n:'已婚',p:66},{n:'其他',p:10}], consumption: [{n:'高',p:20},{n:'中高',p:36},{n:'中等',p:28},{n:'中低',p:10},{n:'低',p:6}], phone: [{n:'iPhone',p:50},{n:'华为',p:20},{n:'小米',p:12},{n:'OPPO',p:8},{n:'其他',p:10}] },
            }
        }
    };

    // 行业漏斗数据
    const industryFunnelData = {
        '本地生活': {
            stages: [
                { name: '曝光', value: 1250000, trend: 6.20 },
                { name: '点击', value: 85000, trend: 1.50 },
                { name: '加粉', value: 28000, trend: 20.10 },
                { name: '开口', value: 14000, trend: 24.30 },
                { name: '留资', value: 12000, trend: 28.60 },
                { name: '到店', value: 7800, trend: 15.20 },
                { name: '下单', value: 5200, trend: 18.40 },
            ],
            rates: [
                { name: '点击率', value: 6.80, trend: 1.90, up: true },
                { name: '加粉率', value: 32.94, trend: 5.50, up: true },
                { name: '开口率', value: 50.00, trend: 26.00, up: true },
                { name: '留资率', value: 85.71, trend: 24.20, up: false },
                { name: '到店率', value: 65.00, trend: 10.80, up: false },
                { name: '下单率', value: 66.67, trend: 15.60, up: true },
            ]
        },
        '教育培训': {
            stages: [
                { name: '曝光', value: 880000, trend: 4.10 },
                { name: '点击', value: 62000, trend: -0.50 },
                { name: '加粉', value: 22000, trend: 16.80 },
                { name: '开口', value: 11500, trend: 18.50 },
                { name: '留资', value: 9800, trend: 22.40 },
                { name: '课程签到', value: 6200, trend: 10.50 },
                { name: '下单', value: 4100, trend: 14.20 },
            ],
            rates: [
                { name: '点击率', value: 7.05, trend: 0.80, up: true },
                { name: '加粉率', value: 35.48, trend: 3.80, up: true },
                { name: '开口率', value: 52.27, trend: 20.00, up: true },
                { name: '留资率', value: 85.22, trend: 18.60, up: false },
                { name: '签到率', value: 63.27, trend: 7.20, up: false },
                { name: '下单率', value: 66.13, trend: 12.40, up: true },
            ]
        }
    };

    // 画像维度配置
    const portraitDimensions = [
        { id: 'region', name: '地域', icon: 'fa-map-marker-alt' },
        { id: 'gender', name: '性别', icon: 'fa-venus-mars' },
        { id: 'age', name: '年龄', icon: 'fa-birthday-cake' },
        { id: 'education', name: '学历', icon: 'fa-graduation-cap' },
        { id: 'marriage', name: '婚育', icon: 'fa-ring' },
        { id: 'consumption', name: '消费水平', icon: 'fa-shopping-bag' },
        { id: 'phone', name: '手机机型', icon: 'fa-mobile-alt' },
    ];

    // ==================== 状态管理 ====================
    
    let state = {
        // 当前选中的主体
        selectedEntities: ['huanan'],
        // 画像展示维度 (7选4)
        selectedPortraitDims: ['region', 'gender', 'age', 'education'],
        // 临时画像维度（配置中的）
        tempPortraitDims: ['region', 'gender', 'age', 'education'],
        // 当前点击的漏斗层
        activeFunnelStage: null, // 默认最后一层
        // 行业漏斗是否锁定
        industryLocked: false,
        // 转化率配置
        conversionNumerator: '下单',
        conversionDenominator: '点击',
        // 临时主体选择
        tempSelectedEntities: ['huanan'],
    };

    // ==================== 工具函数 ====================
    
    function formatNumber(num) {
        return num.toLocaleString('zh-CN');
    }

    function getEntityById(id) {
        return entities.find(e => e.id === id);
    }

    function getCurrentIndustry() {
        const ids = state.selectedEntities;
        if (ids.length === 0) return null;
        return getEntityById(ids[0]).industry;
    }

    function getStagesForIndustry(industry) {
        return industryStages[industry] || industryStages['本地生活'];
    }

    // 合并同行业主体数据
    function getMergedFunnelData(entityIds) {
        if (entityIds.length === 1) {
            return entityFunnelData[entityIds[0]];
        }
        // 合并
        const firstData = entityFunnelData[entityIds[0]];
        const merged = {
            stages: firstData.stages.map(s => ({...s})),
            rates: firstData.rates.map(r => ({...r})),
            portraits: {},
        };
        // 合并画像数据 - 对各维度百分比按人数加权平均
        const firstPortrait = firstData.portraits || {};
        const stageNames = firstData.stages.map(s => s.name);
        const dimKeys = ['region', 'gender', 'age', 'education', 'marriage', 'consumption', 'phone'];
        
        // 初始化画像
        stageNames.forEach(stageName => {
            if (firstPortrait[stageName]) {
                merged.portraits[stageName] = {};
                dimKeys.forEach(dim => {
                    if (firstPortrait[stageName][dim]) {
                        // 深拷贝第一份数据
                        merged.portraits[stageName][dim] = firstPortrait[stageName][dim].map(item => ({...item}));
                    }
                });
            }
        });

        // 合并数值和加权画像
        for (let i = 1; i < entityIds.length; i++) {
            const d = entityFunnelData[entityIds[i]];
            const dPortrait = d.portraits || {};
            d.stages.forEach((s, idx) => {
                merged.stages[idx].value += s.value;
            });
        }

        // 重新计算转化率
        merged.rates = [];
        for (let i = 1; i < merged.stages.length; i++) {
            const prevValue = merged.stages[i-1].value;
            const currValue = merged.stages[i].value;
            const rateVal = prevValue > 0 ? (currValue / prevValue * 100) : 0;
            const rateName = rateNames[merged.stages[i-1].name + '-' + merged.stages[i].name] || '转化率';
            merged.rates.push({
                name: rateName,
                value: parseFloat(rateVal.toFixed(2)),
                trend: parseFloat((Math.random() * 20 + 5).toFixed(2)),
                up: Math.random() > 0.4,
            });
        }
        return merged;
    }

    // ==================== 渲染函数 ====================
    
    // 渲染漏斗图
    function renderFunnelChart(containerId, funnelData, isCustomer) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';

        const stages = funnelData.stages;
        const rates = funnelData.rates;
        const maxValue = stages[0].value;
        const totalStages = stages.length;

        // 蓝色系渐变色阶（从浅到深）
        const blueStops = ['#bfdbfe','#93c5fd','#60a5fa','#3b82f6','#2563eb','#1d4ed8','#1e40af','#1e3a8a','#172554'];
        // 橙色系渐变色阶（从浅到深）
        const orangeStops = ['#fed7aa','#fdba74','#fb923c','#f97316','#ea580c','#c2410c','#9a3412','#7c2d12','#6c2710'];
        const colorStops = isCustomer ? blueStops : orangeStops;

        stages.forEach((stage, idx) => {
            // 漏斗宽度策略：纯均匀递减，确保每层明显窄于上一层
            // 从100%线性递减到45%，形成清晰的漏斗形状
            const minRatio = 0.45;
            const widthPct = (1 - (idx / (totalStages - 1)) * (1 - minRatio)) * 100;

            // 背景颜色：逐层变深，从色阶中按比例取色
            const colorIdx = Math.min(idx, colorStops.length - 1);
            const colorNext = Math.min(idx + 1, colorStops.length - 1);
            const bgColor = `linear-gradient(135deg, ${colorStops[colorIdx]}, ${colorStops[colorNext]})`;

            const layer = document.createElement('div');
            layer.className = 'funnel-layer';
            layer.dataset.stage = stage.name;
            layer.dataset.index = idx;

            const bar = document.createElement('div');
            bar.className = 'funnel-layer-bar' + (isCustomer && state.activeFunnelStage === stage.name ? ' active' : '');
            bar.style.width = widthPct + '%';
            bar.style.background = bgColor;

            const trendDir = stage.trend >= 0 ? '↑' : '↓';
            const trendClass = stage.trend >= 0 ? '' : ' down';
            bar.innerHTML = `
                <div class="funnel-bar-top">
                    <span class="funnel-bar-name">${stage.name}</span>
                    <span class="funnel-bar-trend${trendClass}">${trendDir} ${Math.abs(stage.trend).toFixed(2)}%</span>
                </div>
                <div class="funnel-bar-bottom">
                    <span class="funnel-bar-value">${formatNumber(stage.value)}</span>
                </div>
            `;

            if (isCustomer) {
                bar.addEventListener('click', function() {
                    setActiveStage(stage.name);
                });
                bar.addEventListener('mouseenter', function() {
                    setActiveStage(stage.name);
                });
            }

            layer.appendChild(bar);
            container.appendChild(layer);

            // 转化率层（不在最后一层之后）
            if (idx < rates.length) {
                const rate = rates[idx];
                const rateDiv = document.createElement('div');
                rate.className = 'funnel-rate';
                
                const trendDirR = rate.up ? '↑' : '↓';
                const trendClassR = rate.up ? ' up' : ' down';
                rateDiv.innerHTML = `
                    <div class="funnel-rate-content">
                        <span class="funnel-rate-name">${rate.name}</span>
                        <span class="funnel-rate-value">${rate.value.toFixed(2)}%</span>
                        <span class="funnel-rate-trend${trendClassR}">${trendDirR} ${rate.trend.toFixed(2)}%</span>
                    </div>
                `;
                container.appendChild(rateDiv);
            }
        });
    }

    // 渲染画像区域
    function renderPortrait(stageName, data) {
        const grid = document.getElementById('portrait-grid');
        const label = document.getElementById('portrait-stage-label');
        const count = document.getElementById('portrait-count');
        if (!grid || !data) return;

        const stageData = data.portraits ? data.portraits[stageName] : null;
        if (!stageData) {
            grid.innerHTML = '<div style="color:var(--text-muted);padding:20px;">暂无画像数据</div>';
            return;
        }

        label.textContent = stageName + '客户画像';
        
        // 获取当前人数
        const funnelData = getMergedFunnelData(state.selectedEntities);
        const stage = funnelData.stages.find(s => s.name === stageName);
        count.textContent = stage ? `共 ${formatNumber(stage.value)} 人` : '';

        const dims = state.selectedPortraitDims;
        const colorMap = { region: 'blue', gender: 'green', age: 'orange', education: 'purple', marriage: 'cyan', consumption: 'rose', phone: 'indigo' };
        const iconMap = {};
        portraitDimensions.forEach(d => { iconMap[d.id] = d.icon; });

        grid.innerHTML = '';
        // 根据选中维度数量自适应列数
        grid.style.gridTemplateColumns = `repeat(${dims.length}, 1fr)`;
        dims.forEach(dimId => {
            const items = stageData[dimId];
            if (!items) return;

            const dimInfo = portraitDimensions.find(d => d.id === dimId);
            const card = document.createElement('div');
            card.className = 'portrait-card';

            let barsHtml = items.map(item => `
                <div class="portrait-bar-item">
                    <span class="portrait-bar-label">${item.n}</span>
                    <div class="portrait-bar-track">
                        <div class="portrait-bar-fill ${colorMap[dimId] || 'blue'}" style="width: ${item.p}%"></div>
                    </div>
                    <span class="portrait-bar-pct">${item.p}%</span>
                </div>
            `).join('');

            card.innerHTML = `
                <div class="portrait-card-title">
                    <i class="fas ${dimInfo.icon}"></i>
                    ${dimInfo.name}分布
                </div>
                <div class="portrait-bar-list">${barsHtml}</div>
            `;
            grid.appendChild(card);
        });

        // 触发进度条动画
        setTimeout(() => {
            grid.querySelectorAll('.portrait-bar-fill').forEach(fill => {
                const w = fill.style.width;
                fill.style.width = '0%';
                requestAnimationFrame(() => {
                    fill.style.width = w;
                });
            });
        }, 50);
    }

    // 渲染主体下拉列表
    function renderEntityDropdown() {
        const list = document.getElementById('entity-dropdown-list');
        if (!list) return;
        list.innerHTML = '';

        entities.forEach(entity => {
            const item = document.createElement('div');
            item.className = 'entity-dropdown-item';
            const isChecked = state.tempSelectedEntities.includes(entity.id);
            const industry = entity.industry;
            const currentIndustry = state.tempSelectedEntities.length > 0 ? getEntityById(state.tempSelectedEntities[0]).industry : null;
            const isDiff = currentIndustry && industry !== currentIndustry;

            item.innerHTML = `
                <input type="checkbox" ${isChecked ? 'checked' : ''} data-entity-id="${entity.id}">
                <span>${entity.name}</span>
                <span class="entity-industry-tag ${isDiff ? 'diff' : ''}">${industry}</span>
            `;

            const checkbox = item.querySelector('input');
            item.addEventListener('click', function(e) {
                if (e.target.tagName === 'INPUT') return;
                checkbox.checked = !checkbox.checked;
                handleEntityCheckboxChange(entity.id, checkbox.checked);
            });
            checkbox.addEventListener('change', function() {
                handleEntityCheckboxChange(entity.id, this.checked);
            });

            list.appendChild(item);
        });
    }

    function handleEntityCheckboxChange(entityId, checked) {
        let tempEntities = [...state.tempSelectedEntities];
        if (checked) {
            if (!tempEntities.includes(entityId)) {
                // 检查行业一致性
                if (tempEntities.length > 0) {
                    const currentIndustry = getEntityById(tempEntities[0]).industry;
                    const newIndustry = getEntityById(entityId).industry;
                    if (currentIndustry !== newIndustry) {
                        // 显示错误提示
                        showEntityError();
                        // 取消勾选
                        const checkbox = document.querySelector(`input[data-entity-id="${entityId}"]`);
                        if (checkbox) checkbox.checked = false;
                        return;
                    }
                }
                tempEntities.push(entityId);
            }
        } else {
            tempEntities = tempEntities.filter(id => id !== entityId);
        }
        state.tempSelectedEntities = tempEntities;
        // 更新下拉中的行业标签
        renderEntityDropdown();
    }

    // 渲染画像配置下拉
    function renderPortraitConfig() {
        const list = document.getElementById('portrait-config-list');
        if (!list) return;
        list.innerHTML = '';

        portraitDimensions.forEach(dim => {
            const item = document.createElement('div');
            const isChecked = state.tempPortraitDims.includes(dim.id);
            // 已选4个且当前项未选中时，该选项变灰不可选
            const wouldExceed = !isChecked && state.tempPortraitDims.length >= 4;
            item.className = 'portrait-config-item' + (wouldExceed ? ' disabled' : '');
            item.innerHTML = `
                <input type="checkbox" ${isChecked ? 'checked' : ''} data-dim-id="${dim.id}" ${wouldExceed ? 'disabled' : ''}>
                <i class="fas ${dim.icon}" style="color:var(--text-muted);font-size:13px;"></i>
                <span>${dim.name}</span>
            `;

            const checkbox = item.querySelector('input');
            // 点击整行
            item.addEventListener('click', function(e) {
                if (e.target.tagName === 'INPUT') return;
                if (wouldExceed) return;
                checkbox.checked = !checkbox.checked;
                handlePortraitDimChange(dim.id, checkbox.checked);
            });
            // 点击checkbox本身
            checkbox.addEventListener('change', function() {
                handlePortraitDimChange(dim.id, this.checked);
            });

            list.appendChild(item);
        });
    }

    function handlePortraitDimChange(dimId, checked) {
        if (checked) {
            if (!state.tempPortraitDims.includes(dimId) && state.tempPortraitDims.length < 4) {
                state.tempPortraitDims.push(dimId);
            }
        } else {
            // 允许取消到0个，不强制最少1个
            state.tempPortraitDims = state.tempPortraitDims.filter(d => d !== dimId);
        }
        // 重新渲染配置列表，更新禁选状态
        renderPortraitConfig();
    }

    // 更新整体转化率显示
    function updateConversionRate() {
        const funnelData = getMergedFunnelData(state.selectedEntities);
        const numStage = funnelData.stages.find(s => s.name === state.conversionNumerator);
        const denStage = funnelData.stages.find(s => s.name === state.conversionDenominator);
        
        let rate = 0;
        if (numStage && denStage && denStage.value > 0) {
            rate = (numStage.value / denStage.value * 100).toFixed(2);
        }
        
        document.getElementById('overall-conversion-rate').textContent = rate + '%';
    }

    // 更新行业信息
    function updateIndustryInfo() {
        const industry = getCurrentIndustry();
        document.getElementById('funnel-industry-info').textContent = `行业: ${industry} | 时间范围: 2025-06-18 至 2025-06-24`;
        document.getElementById('industry-name-label').textContent = industry;
    }

    // 更新主体选择器标签
    function updateEntitySelectorLabel() {
        const label = document.getElementById('entity-selector-label');
        if (state.selectedEntities.length === 1) {
            label.textContent = getEntityById(state.selectedEntities[0]).name;
        } else if (state.selectedEntities.length > 1) {
            const names = state.selectedEntities.map(id => getEntityById(id).name);
            label.textContent = names.join(' + ');
        }
    }

    // 设置活跃漏斗层
    function setActiveStage(stageName) {
        state.activeFunnelStage = stageName;
        // 更新客户漏斗的 active 样式
        document.querySelectorAll('#customer-funnel-chart .funnel-layer-bar').forEach(bar => {
            bar.classList.toggle('active', bar.closest('.funnel-layer').dataset.stage === stageName);
        });
        // 更新画像
        const data = getMergedFunnelData(state.selectedEntities);
        renderPortrait(stageName, data);
    }

    // 显示行业不同报错
    function showEntityError() {
        const toast = document.getElementById('entity-error-toast');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }

    // 全量刷新漏斗板块
    function refreshFunnelSection() {
        const funnelData = getMergedFunnelData(state.selectedEntities);
        const industry = getCurrentIndustry();
        const iData = industryFunnelData[industry];

        // 设置默认活跃层为最后一层
        if (!state.activeFunnelStage || !funnelData.stages.find(s => s.name === state.activeFunnelStage)) {
            state.activeFunnelStage = funnelData.stages[funnelData.stages.length - 1].name;
        }

        renderFunnelChart('customer-funnel-chart', funnelData, true);
        renderFunnelChart('industry-funnel-chart', iData, false);
        renderPortrait(state.activeFunnelStage, funnelData);
        updateConversionRate();
        updateIndustryInfo();
        updateEntitySelectorLabel();
    }

    // ==================== 事件绑定 ====================

    // --- 行业漏斗悬停/点击交互 ---
    const funnelIndustry = document.getElementById('funnel-industry');
    const funnelMainArea = document.getElementById('funnel-main-area');

    if (funnelIndustry && funnelMainArea) {
        funnelIndustry.addEventListener('mouseenter', function() {
            if (!state.industryLocked) {
                funnelMainArea.classList.add('hover-expand');
            }
        });

        funnelIndustry.addEventListener('mouseleave', function() {
            if (!state.industryLocked) {
                funnelMainArea.classList.remove('hover-expand');
            }
        });

        funnelIndustry.addEventListener('click', function(e) {
            e.stopPropagation();
            if (state.industryLocked) {
                // 再次点击，恢复初始状态
                state.industryLocked = false;
                funnelMainArea.classList.remove('locked-expand');
                funnelMainArea.classList.remove('hover-expand');
            } else {
                // 锁定放大状态
                state.industryLocked = true;
                funnelMainArea.classList.remove('hover-expand');
                funnelMainArea.classList.add('locked-expand');
            }
        });
    }

    // --- 主体选择器 ---
    const entitySelector = document.getElementById('entity-selector');
    const entitySelectorTrigger = document.getElementById('entity-selector-trigger');
    const entityCancelBtn = document.getElementById('entity-cancel-btn');
    const entityConfirmBtn = document.getElementById('entity-confirm-btn');

    if (entitySelectorTrigger) {
        entitySelectorTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            state.tempSelectedEntities = [...state.selectedEntities];
            renderEntityDropdown();
            entitySelector.classList.toggle('open');
            // 关闭画像配置
            document.getElementById('portrait-config')?.classList.remove('open');
        });
    }

    if (entityCancelBtn) {
        entityCancelBtn.addEventListener('click', function() {
            state.tempSelectedEntities = [...state.selectedEntities];
            entitySelector.classList.remove('open');
        });
    }

    if (entityConfirmBtn) {
        entityConfirmBtn.addEventListener('click', function() {
            if (state.tempSelectedEntities.length === 0) {
                showToast('请至少选择一个主体');
                return;
            }
            state.selectedEntities = [...state.tempSelectedEntities];
            entitySelector.classList.remove('open');
            // 重置活跃漏斗层（因为可能换了行业）
            state.activeFunnelStage = null;
            refreshFunnelSection();
        });
    }

    // 点击外部关闭主体选择器
    document.addEventListener('click', function(e) {
        if (entitySelector && !entitySelector.contains(e.target)) {
            entitySelector.classList.remove('open');
        }
    });

    // --- 画像配置 ---
    const portraitConfig = document.getElementById('portrait-config');
    const portraitConfigTrigger = document.getElementById('portrait-config-trigger');
    const portraitCancelBtn = document.getElementById('portrait-cancel-btn');
    const portraitConfirmBtn = document.getElementById('portrait-confirm-btn');

    if (portraitConfigTrigger) {
        portraitConfigTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            state.tempPortraitDims = [...state.selectedPortraitDims];
            renderPortraitConfig();
            portraitConfig.classList.toggle('open');
            // 关闭主体选择器
            entitySelector?.classList.remove('open');
        });
    }

    if (portraitCancelBtn) {
        portraitCancelBtn.addEventListener('click', function() {
            state.tempPortraitDims = [...state.selectedPortraitDims];
            portraitConfig.classList.remove('open');
        });
    }

    if (portraitConfirmBtn) {
        portraitConfirmBtn.addEventListener('click', function() {
            if (state.tempPortraitDims.length === 0) {
                showToast('请至少选择一个画像维度');
                return;
            }
            state.selectedPortraitDims = [...state.tempPortraitDims];
            portraitConfig.classList.remove('open');
            // 更新画像列数
            const grid = document.getElementById('portrait-grid');
            if (grid) {
                grid.style.gridTemplateColumns = `repeat(${state.selectedPortraitDims.length}, 1fr)`;
            }
            // 重新渲染画像
            const funnelData = getMergedFunnelData(state.selectedEntities);
            renderPortrait(state.activeFunnelStage, funnelData);
        });
    }

    document.addEventListener('click', function(e) {
        if (portraitConfig && !portraitConfig.contains(e.target)) {
            portraitConfig.classList.remove('open');
        }
    });

    // --- 转化率配置弹窗 ---
    const conversionConfigBtn = document.getElementById('conversion-config-btn');
    const conversionConfigModal = document.getElementById('conversion-config-modal');
    const conversionConfigClose = document.getElementById('conversion-config-close');
    const conversionCancelBtn = document.getElementById('conversion-cancel-btn');
    const conversionConfirmBtn = document.getElementById('conversion-confirm-btn');
    const conversionNumerator = document.getElementById('conversion-numerator');
    const conversionDenominator = document.getElementById('conversion-denominator');

    if (conversionConfigBtn) {
        conversionConfigBtn.addEventListener('click', function() {
            // 根据当前行业动态生成选项
            const industry = getCurrentIndustry();
            const stages = getStagesForIndustry(industry);
            const numSelect = document.getElementById('conversion-numerator');
            const denSelect = document.getElementById('conversion-denominator');
            
            numSelect.innerHTML = stages.map(s => 
                `<option value="${s}" ${s === state.conversionNumerator ? 'selected' : ''}>${s}数</option>`
            ).join('');
            denSelect.innerHTML = stages.map(s => 
                `<option value="${s}" ${s === state.conversionDenominator ? 'selected' : ''}>${s}数</option>`
            ).join('');
            
            conversionConfigModal.classList.add('open');
        });
    }

    if (conversionConfigClose) {
        conversionConfigClose.addEventListener('click', function() {
            conversionConfigModal.classList.remove('open');
        });
    }

    if (conversionCancelBtn) {
        conversionCancelBtn.addEventListener('click', function() {
            conversionConfigModal.classList.remove('open');
        });
    }

    if (conversionConfirmBtn) {
        conversionConfirmBtn.addEventListener('click', function() {
            state.conversionNumerator = conversionNumerator.value;
            state.conversionDenominator = conversionDenominator.value;
            conversionConfigModal.classList.remove('open');
            updateConversionRate();

            // 更新环比
            const funnelData = getMergedFunnelData(state.selectedEntities);
            const numStage = funnelData.stages.find(s => s.name === state.conversionNumerator);
            const trendBadge = document.getElementById('overall-trend-badge');
            if (numStage && trendBadge) {
                const isUp = numStage.trend >= 0;
                trendBadge.className = 'trend-badge ' + (isUp ? 'up' : 'down');
                trendBadge.textContent = (isUp ? '↑' : '↓') + ` 环比${Math.abs(numStage.trend).toFixed(2)}%`;
            }
        });
    }

    // 点击弹窗外部关闭
    if (conversionConfigModal) {
        conversionConfigModal.addEventListener('click', function(e) {
            if (e.target === conversionConfigModal) {
                conversionConfigModal.classList.remove('open');
            }
        });
    }

    // ==================== 通用功能（保留原有） ====================

    // 日期筛选切换
    const dateBtns = document.querySelectorAll('.date-btn');
    dateBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            dateBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const range = this.dataset.range;
            updateDateRange(range);
        });
    });

    function updateDateRange(range) {
        const datePicker = document.querySelector('.date-picker span');
        const today = new Date('2025-07-07');
        let startDate, endDate;
        
        switch(range) {
            case 'yesterday':
                startDate = new Date(today);
                startDate.setDate(startDate.getDate() - 1);
                endDate = new Date(startDate);
                break;
            case '7days':
                startDate = new Date(today);
                startDate.setDate(startDate.getDate() - 6);
                endDate = new Date(today);
                break;
            case '30days':
                startDate = new Date(today);
                startDate.setDate(startDate.getDate() - 29);
                endDate = new Date(today);
                break;
        }
        
        const formatDate = (d) => {
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        };
        
        datePicker.textContent = `${formatDate(startDate)} ~ ${formatDate(endDate)}`;
    }

    // 刷新数据按钮
    const refreshBtn = document.querySelector('.btn-refresh');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            icon.style.animation = 'spin 1s linear';
            setTimeout(() => {
                icon.style.animation = '';
                showToast('数据已刷新');
            }, 1000);
        });
    }

    // 侧边栏导航切换
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            sidebarItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 顶部导航切换
    const topMenuItems = document.querySelectorAll('.top-menu-item');
    topMenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            topMenuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 洞察卡片点击
    const insightCards = document.querySelectorAll('.insight-card');
    insightCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('.insight-title').textContent;
            showToast(`查看详情: ${title}`);
        });
    });

    // 指标卡片点击
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.addEventListener('click', function() {
            const label = this.querySelector('.metric-label').textContent;
            showToast(`查看 ${label} 趋势图`);
        });
    });

    // Toast 提示
    function showToast(message) {
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fas fa-info-circle"></i><span>${message}</span>`;
        document.body.appendChild(toast);

        toast.style.cssText = `
            position: fixed; top: 72px; right: 24px;
            background: var(--text-primary); color: white;
            padding: 12px 20px; border-radius: var(--radius);
            display: flex; align-items: center; gap: 8px;
            font-size: 13px; z-index: 1000;
            box-shadow: var(--shadow-hover);
            animation: slideInRight 0.3s ease;
        `;

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    // 动画关键帧
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(100px); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOutRight {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(100px); }
        }
    `;
    document.head.appendChild(style);

    // 数字滚动动画
    function animateNumber(element, target, prefix = '', suffix = '') {
        const duration = 1000;
        const start = 0;
        const startTime = performance.now();
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOut);
            element.textContent = prefix + current.toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    setTimeout(() => {
        const metricValues = document.querySelectorAll('.metric-value');
        metricValues.forEach(el => {
            const text = el.textContent;
            if (text.includes('¥')) {
                const num = parseInt(text.replace(/[¥,]/g, ''));
                animateNumber(el, num, '¥');
            }
        });
    }, 500);

    // 行业选择 / 日期选择 / 其他按钮
    const industrySelect = document.querySelector('.industry-select');
    if (industrySelect) industrySelect.addEventListener('click', () => showToast('行业选择功能开发中...'));
    const datePicker = document.querySelector('.date-picker');
    if (datePicker) datePicker.addEventListener('click', () => showToast('日期选择功能开发中...'));
    const btnRecommend = document.querySelector('.btn-recommend');
    if (btnRecommend) btnRecommend.addEventListener('click', () => showToast('经营工具推荐功能开发中...'));
    const bellIcon = document.querySelector('.user-info .fa-bell');
    if (bellIcon) bellIcon.addEventListener('click', () => showToast('暂无新通知'));
    const avatar = document.querySelector('.avatar');
    if (avatar) avatar.addEventListener('click', () => showToast('用户中心功能开发中...'));

    // ==================== 初始化 ====================
    refreshFunnelSection();
});
