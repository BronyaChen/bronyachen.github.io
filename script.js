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
            cost: { total: 125800, trend: 12.50 },
            portraits: {}
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
            cost: { total: 98500, trend: 8.30 },
            rates: [
                { name: '点击率', value: 6.47, trend: 1.80, up: true },
                { name: '加粉率', value: 32.45, trend: 5.10, up: true },
                { name: '开口率', value: 51.56, trend: 28.00, up: true },
                { name: '留资率', value: 87.88, trend: 26.50, up: false },
                { name: '到店率', value: 67.59, trend: 10.30, up: false },
                { name: '下单率', value: 66.33, trend: 16.80, up: true },
            ],
            portraits: {}
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
            cost: { total: 58600, trend: 6.80 },
            rates: [
                { name: '点击率', value: 7.35, trend: 1.20, up: true },
                { name: '加粉率', value: 34.72, trend: 4.50, up: true },
                { name: '开口率', value: 52.00, trend: 22.00, up: true },
                { name: '留资率', value: 84.62, trend: 20.10, up: false },
                { name: '签到率', value: 65.45, trend: 8.40, up: false },
                { name: '下单率', value: 66.67, trend: 14.20, up: true },
            ],
            portraits: {}
        }
    };

    // 动态生成符合严格命名和分段划分的画像数据
    function generateMockPortraits() {
        const stagesList = ['曝光', '点击', '加粉', '开口', '留资', '到店', '课程签到', '下单'];
        const entitiesList = ['huanan', 'dongnan', 'xinan'];

        entitiesList.forEach(ent => {
            const ports = {};
            stagesList.forEach((stage, sIdx) => {
                ports[stage] = {
                    // 1、常驻省份: 广东、湖南、广西、福建、其他
                    region: [
                        { n: '广东', p: Math.max(5, 30 + sIdx * 2 - (ent === 'xinan' ? 15 : 0)) },
                        { n: '湖南', p: Math.max(5, 20 - sIdx + (ent === 'xinan' ? 5 : 0)) },
                        { n: '广西', p: Math.max(5, 15 + sIdx - (ent === 'huanan' ? 2 : 0)) },
                        { n: '福建', p: Math.max(5, 15 - sIdx * 2 + (ent === 'dongnan' ? 8 : 0)) },
                        { n: '其他', p: 0 }
                    ],
                    // 2、性别: 男、女、其他
                    gender: [
                        { n: '男', p: Math.max(5, 45 - sIdx + (ent === 'huanan' ? 5 : 0)) },
                        { n: '女', p: Math.max(5, 50 + sIdx - (ent === 'huanan' ? 3 : 0)) },
                        { n: '其他', p: 0 }
                    ],
                    // 3、年龄: 0-18；18-24；24-30；30-40；40-55；55+
                    age: [
                        { n: '0-18', p: Math.max(1, 5 - Math.floor(sIdx / 2)) },
                        { n: '18-24', p: Math.max(5, 15 + sIdx) },
                        { n: '24-30', p: Math.max(5, 30 + sIdx * 2) },
                        { n: '30-40', p: Math.max(5, 25 - sIdx) },
                        { n: '40-55', p: Math.max(5, 20 - sIdx * 2) },
                        { n: '55+', p: 0 }
                    ],
                    // 4、学历: 高中及以下；本科；硕士；博士及以上；大专；其他
                    education: [
                        { n: '高中及以下', p: Math.max(2, 10 - sIdx) },
                        { n: '大专', p: Math.max(5, 25 - sIdx * 2) },
                        { n: '本科', p: Math.max(5, 35 + sIdx * 2) },
                        { n: '硕士', p: Math.max(2, 15 + sIdx) },
                        { n: '博士及以上', p: Math.max(1, 5 + Math.floor(sIdx / 2)) },
                        { n: '其他', p: 0 }
                    ],
                    // 5、育儿: 已育儿；未育儿
                    parenting: [
                        { n: '已育儿', p: Math.max(5, 40 + sIdx * 3) },
                        { n: '未育儿', p: 0 }
                    ],
                    // 6、综合消费能力: 高消费、中等消费、低消费
                    consumption: [
                        { n: '高消费', p: Math.max(5, 20 + sIdx * 4) },
                        { n: '中等消费', p: Math.max(5, 55 - sIdx) },
                        { n: '低消费', p: 0 }
                    ]
                };

                // 自动补齐各维度中“其他”或最后一项的百分比，确保和为100%
                const dims = ['region', 'gender', 'age', 'education', 'parenting', 'consumption'];
                dims.forEach(dim => {
                    const list = ports[stage][dim];
                    let sum = 0;
                    for (let i = 0; i < list.length - 1; i++) {
                        sum += list[i].p;
                    }
                    list[list.length - 1].p = Math.max(0, 100 - sum);
                });
            });
            entityFunnelData[ent].portraits = ports;
        });
    }

    generateMockPortraits();

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

    // 同行对比数据 - 各转化率在同行中的水位排名
    const peerBenchmarkData = {
        huanan: [
            { rateName: '点击率', percentile: 35 },
            { rateName: '加粉率', percentile: 42 },
            { rateName: '开口率', percentile: 28 },
            { rateName: '留资率', percentile: 65 },
            { rateName: '到店率', percentile: 55 },
            { rateName: '下单率', percentile: 48 },
        ],
        dongnan: [
            { rateName: '点击率', percentile: 40 },
            { rateName: '加粉率', percentile: 50 },
            { rateName: '开口率', percentile: 32 },
            { rateName: '留资率', percentile: 60 },
            { rateName: '到店率', percentile: 58 },
            { rateName: '下单率', percentile: 45 },
        ],
        xinan: [
            { rateName: '点击率', percentile: 52 },
            { rateName: '加粉率', percentile: 60 },
            { rateName: '开口率', percentile: 38 },
            { rateName: '留资率', percentile: 70 },
            { rateName: '签到率', percentile: 45 },
            { rateName: '下单率', percentile: 50 },
        ],
    };

    // 同行对比数据 - 各平均成本在同行中的水位排名
    const costPeerBenchmarkData = {
        huanan: [
            { costName: '曝光', percentile: 30 },
            { costName: '点击', percentile: 25 },
            { costName: '加粉', percentile: 38 },
            { costName: '开口', percentile: 42 },
            { costName: '留资', percentile: 55 },
            { costName: '到店', percentile: 60 },
            { costName: '下单', percentile: 65 },
        ],
        dongnan: [
            { costName: '曝光', percentile: 35 },
            { costName: '点击', percentile: 28 },
            { costName: '加粉', percentile: 45 },
            { costName: '开口', percentile: 48 },
            { costName: '留资', percentile: 58 },
            { costName: '到店', percentile: 62 },
            { costName: '下单', percentile: 68 },
        ],
        xinan: [
            { costName: '曝光', percentile: 22 },
            { costName: '点击', percentile: 18 },
            { costName: '加粉', percentile: 32 },
            { costName: '开口', percentile: 35 },
            { costName: '留资', percentile: 50 },
            { costName: '课程签到', percentile: 55 },
            { costName: '下单', percentile: 60 },
        ],
    };

    // 画像维度配置
    const portraitDimensions = [
        { id: 'region', name: '常驻省份', icon: 'fa-map-marker-alt' },
        { id: 'gender', name: '性别', icon: 'fa-venus-mars' },
        { id: 'age', name: '年龄', icon: 'fa-birthday-cake' },
        { id: 'education', name: '学历', icon: 'fa-graduation-cap' },
        { id: 'parenting', name: '育儿', icon: 'fa-baby' },
        { id: 'consumption', name: '综合消费能力', icon: 'fa-shopping-bag' },
    ];

    // 行业与主体的映射关系
    const industryEntityMap = {
        '本地生活': ['huanan', 'dongnan'],
        '教育培训': ['xinan'],
    };

    // ==================== 状态管理 ====================
    
    let state = {
        // 当前选中的主体
        selectedEntities: ['huanan', 'dongnan'],
        // 当前选中的行业
        selectedIndustry: '本地生活',
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
        tempSelectedEntities: ['huanan', 'dongnan'],
        // 临时行业选择（主体下拉卡片中）
        tempIndustry: '本地生活',
        // 漏斗图 - 曝光时间范围
        exposureStartDate: '2025-06-18',
        exposureEndDate: '2025-06-24',
        // 转化周期（天数）
        conversionPeriodDays: 30,
        conversionPeriodMode: '30', // '7', '14', '30', 'custom'
        // 漏斗维度模式: 'quantity' 数量 | 'cost' 消耗
        funnelMode: 'quantity',
    };

    // ==================== 工具函数 ====================
    
    function formatNumber(num) {
        return num.toLocaleString('zh-CN');
    }

    function getEntityById(id) {
        return entities.find(e => e.id === id);
    }

    function getCurrentIndustry() {
        return state.selectedIndustry;
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
            cost: firstData.cost ? {...firstData.cost} : { total: 0, trend: 0 },
            portraits: {},
        };
        // 合并画像数据 - 对各维度百分比按人数加权平均
        const firstPortrait = firstData.portraits || {};
        const stageNames = firstData.stages.map(s => s.name);
        const dimKeys = ['region', 'gender', 'age', 'education', 'parenting', 'consumption'];
        
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
            // 合并消耗
            if (d.cost) {
                merged.cost.total += d.cost.total;
            }
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

    // 获取同行对比水位百分位
    function getPeerPercentile(rateName, entityIds) {
        if (entityIds.length === 1) {
            // 单主体：直接取该主体的同行对比数据
            const data = peerBenchmarkData[entityIds[0]];
            if (data) {
                const item = data.find(d => d.rateName === rateName);
                return item ? item.percentile : null;
            }
            return null;
        }
        // 多主体合并：取平均值
        let sum = 0, count = 0;
        entityIds.forEach(id => {
            const data = peerBenchmarkData[id];
            if (data) {
                const item = data.find(d => d.rateName === rateName);
                if (item) { sum += item.percentile; count++; }
            }
        });
        return count > 0 ? Math.round(sum / count) : null;
    }

    // 获取消耗维度同行对比水位百分位
    function getCostPeerPercentile(stageName, entityIds) {
        if (entityIds.length === 1) {
            const data = costPeerBenchmarkData[entityIds[0]];
            if (data) {
                const item = data.find(d => d.costName === stageName);
                return item ? item.percentile : null;
            }
            return null;
        }
        let sum = 0, count = 0;
        entityIds.forEach(id => {
            const data = costPeerBenchmarkData[id];
            if (data) {
                const item = data.find(d => d.costName === stageName);
                if (item) { sum += item.percentile; count++; }
            }
        });
        return count > 0 ? Math.round(sum / count) : null;
    }

    // ==================== 渲染函数 ====================
    
    // 渲染漏斗图
    function renderFunnelChart(containerId, funnelData, isCustomer, mode) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';

        const stages = funnelData.stages;
        const rates = funnelData.rates;
        const maxValue = stages[0].value;
        const totalStages = stages.length;
        const isCostMode = mode === 'cost';

        // 蓝色系渐变色阶（从浅到深）
        const blueStops = ['#bfdbfe','#93c5fd','#60a5fa','#3b82f6','#2563eb','#1d4ed8','#1e40af','#1e3a8a','#172554'];
        // 橙色系渐变色阶（从浅到深）
        const orangeStops = ['#fed7aa','#fdba74','#fb923c','#f97316','#ea580c','#c2410c','#9a3412','#7c2d12','#6c2710'];
        // 消耗模式用绿色系
        const greenStops = ['#bbf7d0','#86efac','#4ade80','#22c55e','#16a34a','#15803d','#166534','#14532d','#052e16'];
        const colorStops = isCostMode ? greenStops : (isCustomer ? blueStops : orangeStops);

        // 消耗模式下，在曝光层上方加消耗层
        if (isCostMode && isCustomer && funnelData.cost) {
            const cost = funnelData.cost;
            const costLayer = document.createElement('div');
            costLayer.className = 'funnel-layer';
            costLayer.dataset.stage = '消耗';
            costLayer.dataset.index = '-1';

            const costBar = document.createElement('div');
            costBar.className = 'funnel-layer-bar' + (isCustomer && state.activeFunnelStage === '消耗' ? ' active' : '');
            costBar.style.width = '100%';
            costBar.style.background = `linear-gradient(135deg, ${greenStops[0]}, ${greenStops[1]})`;

            const costTrendDir = cost.trend >= 0 ? '↑' : '↓';
            const costTrendClass = cost.trend >= 0 ? '' : ' down';
            costBar.innerHTML = `
                <div class="funnel-bar-top">
                    <span class="funnel-bar-name">总消耗</span>
                </div>
                <div class="funnel-bar-bottom">
                    <span class="funnel-bar-value">¥${formatNumber(cost.total)}</span>
                    <span class="funnel-bar-trend${costTrendClass}">${costTrendDir} ${Math.abs(cost.trend).toFixed(2)}%</span>
                </div>
            `;

            if (isCustomer) {
                costBar.addEventListener('click', function() {
                    setActiveStage('消耗');
                });
                costBar.addEventListener('mouseenter', function() {
                    setActiveStage('消耗');
                });
            }

            costLayer.appendChild(costBar);
            container.appendChild(costLayer);
        }

        stages.forEach((stage, idx) => {
            // 漏斗宽度策略：纯均匀递减，确保每层明显窄于上一层
            // 从100%线性递减到45%，形成清晰的漏斗形状
            const minRatio = 0.45;
            const widthPct = (1 - (idx / (totalStages - 1)) * (1 - minRatio)) * 100;

            // 背景颜色：逐层变深，从色阶中按比例取色
            const colorIdx = Math.min(idx, colorStops.length - 1);
            const colorNext = Math.min(idx + 1, colorStops.length - 1);
            const bgColor = `linear-gradient(135deg, ${colorStops[colorIdx]}, ${colorStops[colorNext]})`;

            // 消耗模式下，替换指标名称和数值
            let displayName = stage.name;
            let displayValue = formatNumber(stage.value);
            let displayTrend = stage.trend;

            if (isCostMode && funnelData.cost) {
                const avgCost = stage.value > 0 ? funnelData.cost.total / stage.value : 0;
                displayName = '平均' + stage.name + '成本';
                displayValue = '¥' + avgCost.toFixed(2);
                displayTrend = parseFloat((Math.random() * 15 + 2).toFixed(2));
            }

            const trendDir = displayTrend >= 0 ? '↑' : '↓';
            const trendClass = displayTrend >= 0 ? '' : ' down';

            // 消耗模式下计算同行对比标签
            let costPeerHtml = '';
            if (isCostMode && isCustomer) {
                const costPct = getCostPeerPercentile(stage.name, state.selectedEntities);
                if (costPct !== null) {
                    const peerClass = costPct <= 30 ? 'peer-low' : (costPct <= 60 ? 'peer-mid' : 'peer-high');
                    costPeerHtml = `<span class="funnel-bar-cost-peer ${peerClass}">位于同行平均${stage.name}成本水位的前${100 - costPct}%</span>`;
                }
            }

            const layer = document.createElement('div');
            layer.className = 'funnel-layer';
            layer.dataset.stage = stage.name;
            layer.dataset.index = idx;

            const bar = document.createElement('div');
            bar.className = 'funnel-layer-bar' + (isCustomer && state.activeFunnelStage === stage.name ? ' active' : '');
            bar.style.width = widthPct + '%';
            bar.style.background = bgColor;

            bar.innerHTML = `
                <div class="funnel-bar-top">
                    <span class="funnel-bar-name">${displayName}</span>
                </div>
                <div class="funnel-bar-bottom">
                    <span class="funnel-bar-value">${displayValue}</span>
                    <span class="funnel-bar-trend${trendClass}">${trendDir} ${Math.abs(displayTrend).toFixed(2)}%</span>
                    ${costPeerHtml}
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
                rateDiv.className = 'funnel-rate';
                
                const trendDirR = rate.up ? '↑' : '↓';
                const trendClassR = rate.up ? ' up' : ' down';

                // 客户漏斗增加同行对比（消耗模式下不展示同行对比）
                let peerHtml = '';
                if (isCustomer && !isCostMode) {
                    const percentile = getPeerPercentile(rate.name, state.selectedEntities);
                    if (percentile !== null) {
                        const peerClass = percentile <= 30 ? 'peer-low' : (percentile <= 60 ? 'peer-mid' : 'peer-high');
                        peerHtml = `<span class="funnel-rate-peer ${peerClass}">位于同行${rate.name}水位的前${100 - percentile}%</span>`;
                    }
                }

                rateDiv.innerHTML = `
                    <div class="funnel-rate-content">
                        <span class="funnel-rate-name">${rate.name}</span>
                        <span class="funnel-rate-value">${rate.value.toFixed(2)}%</span>
                        <span class="funnel-rate-trend${trendClassR}">${trendDirR} ${rate.trend.toFixed(2)}%</span>
                        ${peerHtml}
                    </div>
                `;
                container.appendChild(rateDiv);
            }
        });
    }

    // ==================== 折线图（趋势变化） ====================

    // 辅助函数：日期加天数
    function addDays(dateStr, days) {
        const d = new Date(dateStr);
        d.setDate(d.getDate() + days);
        return d.toISOString().slice(0, 10);
    }

    // 辅助函数：格式化日期为 "M.D"
    function fmtShortDate(dateStr) {
        const d = new Date(dateStr);
        return (d.getMonth() + 1) + '.' + d.getDate();
    }

    // 辅助函数：格式化日期为 "YYYY.M.D"
    function fmtFullDate(dateStr) {
        const d = new Date(dateStr);
        return d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate();
    }

    // 生成6个周期的趋势数据
    // quantity模式: 下单数/曝光数的转化率趋势
    // cost模式: 平均XX成本的趋势
    function generatePeriodTrendData(mode, stageName) {
        const startBase = state.exposureStartDate;
        const endBase = state.exposureEndDate;

        const startD = new Date(startBase);
        const endD = new Date(endBase);
        const diffTime = Math.abs(endD - startD);
        const periodLength = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        const funnelData = getMergedFunnelData(state.selectedEntities);
        const points = [];

        if (mode === 'quantity') {
            // 计算当前下单数/曝光数转化率
            const numStage = funnelData.stages.find(s => s.name === '下单');
            const denStage = funnelData.stages.find(s => s.name === '曝光');
            const baseRate = (numStage && denStage && denStage.value > 0)
                ? numStage.value / denStage.value * 100 : 0;

            let seed = state.selectedEntities.join('').length + 7;
            for (let i = 0; i < 6; i++) {
                // 从最新到最旧：偏移 i * periodLength 天
                const periodStart = addDays(startBase, -i * periodLength);
                const periodEnd = addDays(endBase, -i * periodLength);
                const label = fmtFullDate(periodStart) + '-' + fmtFullDate(periodEnd);

                seed = (seed * 9301 + 49297) % 233280;
                const rnd = (seed / 233280) - 0.5;
                const trend = Math.sin(i * 0.8) * baseRate * 0.15;
                const noise = rnd * baseRate * 0.1;
                const rate = Math.max(0, baseRate + trend + noise);

                points.unshift({
                    label: label,
                    value: parseFloat(rate.toFixed(2)),
                });
            }
        } else if (mode === 'cost' && stageName && funnelData.cost) {
            // 计算基础成本值：如果是总消耗层，直接为 cost.total；否则为 cost.total / 指标数
            let baseCost = 0;
            if (stageName === '消耗') {
                baseCost = funnelData.cost.total;
            } else {
                const stage = funnelData.stages.find(s => s.name === stageName);
                baseCost = (stage && stage.value > 0)
                    ? funnelData.cost.total / stage.value : 0;
            }

            let seed = state.selectedEntities.join('').length + stageName.length;
            for (let i = 0; i < 6; i++) {
                const periodStart = addDays(startBase, -i * periodLength);
                const periodEnd = addDays(endBase, -i * periodLength);
                const label = fmtFullDate(periodStart) + '-' + fmtFullDate(periodEnd);

                seed = (seed * 9301 + 49297) % 233280;
                const rnd = (seed / 233280) - 0.5;
                const trend = Math.sin(i * 0.9) * baseCost * 0.12;
                const noise = rnd * baseCost * 0.08;
                const cost = Math.max(0, baseCost + trend + noise);

                points.unshift({
                    label: label,
                    value: parseFloat(cost.toFixed(2)),
                });
            }
        }

        return points;
    }

    // 渲染数量/转化率趋势图 SVG
    function renderQuantityTrendChart() {
        const container = document.getElementById('quantity-trend-chart-body');
        if (!container) return;

        const rateLabel = document.getElementById('trend-rate-label');
        const configBtn = document.getElementById('trend-config-btn');

        const data = generatePeriodTrendData('quantity');
        const yUnit = '%';
        const tooltipSuffix = '%';

        if (rateLabel) {
            // 支持配置的分子分母
            rateLabel.textContent = state.trendNumerator + '数/' + state.trendDenominator + '数';
            rateLabel.style.background = 'rgba(245,158,11,0.1)';
            rateLabel.style.color = '#f59e0b';
        }

        if (data.length === 0) {
            container.innerHTML = '<div style="color:var(--text-muted);padding:20px;text-align:center;">暂无数据</div>';
            return;
        }

        const W = container.clientWidth || 460;
        const H = Math.max(160, (container.parentElement?.clientHeight || 260) - 60);
        const padL = 50, padR = 16, padT = 16, padB = 48;
        const plotW = W - padL - padR;
        const plotH = H - padT - padB;

        const values = data.map(d => d.value);
        const minR = 0;
        const maxR = 2;
        const rangeR = maxR - minR || 1;

        const xScale = (i) => padL + (i / (data.length - 1)) * plotW;
        const yScale = (v) => padT + plotH - ((v - minR) / rangeR) * plotH;

        const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xScale(i).toFixed(1)},${yScale(d.value).toFixed(1)}`).join(' ');
        const areaPath = linePath + ` L${xScale(data.length - 1).toFixed(1)},${(padT + plotH).toFixed(1)} L${xScale(0).toFixed(1)},${(padT + plotH).toFixed(1)} Z`;

        const yTicks = 4;
        let yTickHtml = '';
        for (let i = 0; i <= yTicks; i++) {
            const val = minR + (rangeR * i / yTicks);
            const y = yScale(val);
            yTickHtml += `<line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="#f0f0f0" stroke-width="1"/>`;
            yTickHtml += `<text x="${padL - 6}" y="${y + 4}" text-anchor="end" fill="#9ca3af" font-size="10">${val.toFixed(1)}%</text>`;
        }

        let xTickHtml = '';
        data.forEach((d, i) => {
            const x = xScale(i);
            xTickHtml += `<text x="${x}" y="${H - padB + 14}" text-anchor="end" fill="#9ca3af" font-size="8" transform="rotate(-35,${x},${H - padB + 14})">${d.label}</text>`;
        });

        const mainColor = '#2563eb';
        const mainColorLight = '#3b82f6';
        const areaGradId = 'trendAreaGrad';

        let dotsHtml = data.map((d, i) =>
            `<circle cx="${xScale(i).toFixed(1)}" cy="${yScale(d.value).toFixed(1)}" r="3" fill="${mainColor}" stroke="white" stroke-width="1.5" class="trend-dot" data-label="${d.label}" data-value="${d.value}${tooltipSuffix}"/>`
        ).join('');

        const svg = `
            <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" class="trend-svg">
                <defs>
                    <linearGradient id="${areaGradId}" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="${mainColorLight}" stop-opacity="0.2"/>
                        <stop offset="100%" stop-color="${mainColorLight}" stop-opacity="0.02"/>
                    </linearGradient>
                </defs>
                ${yTickHtml}
                ${xTickHtml}
                <path d="${areaPath}" fill="url(#${areaGradId})"/>
                <path d="${linePath}" fill="none" stroke="${mainColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                ${dotsHtml}
            </svg>
        `;
        container.innerHTML = svg;

        container.querySelectorAll('.trend-dot').forEach(dot => {
            dot.addEventListener('mouseenter', function(e) {
                showTrendTooltip(e, this.dataset.label, this.dataset.value);
            });
            dot.addEventListener('mouseleave', function() {
                hideTrendTooltip();
            });
        });
    }

    // 渲染消耗变化趋势图 SVG
    function renderCostTrendChart() {
        const container = document.getElementById('cost-trend-chart-body');
        if (!container) return;

        const trendTitleEl = document.querySelector('#cost-trend-panel .trend-chart-title span:nth-child(2)');
        const rateLabel = document.getElementById('cost-trend-rate-label');

        const stageName = state.activeFunnelStage || '消耗';
        const data = generatePeriodTrendData('cost', stageName);
        const yUnit = '元';
        const tooltipSuffix = '元';

        // 更新标题和计算公式标签
        let formulaText = '';
        if (stageName === '消耗') {
            if (trendTitleEl) trendTitleEl.textContent = '总消耗变化趋势图';
            formulaText = '曝光总消耗';
        } else {
            if (trendTitleEl) trendTitleEl.textContent = '平均' + stageName + '成本变化趋势图';
            formulaText = '曝光总消耗/' + stageName + '数';
        }
        if (rateLabel) rateLabel.textContent = formulaText;

        if (data.length === 0) {
            container.innerHTML = '<div style="color:var(--text-muted);padding:20px;text-align:center;">暂无数据</div>';
            return;
        }

        const W = container.clientWidth || 460;
        const H = Math.max(160, (container.parentElement?.clientHeight || 260) - 60);
        const padL = 50, padR = 16, padT = 16, padB = 48;
        const plotW = W - padL - padR;
        const plotH = H - padT - padB;

        const values = data.map(d => d.value);

        // 消耗模式：动态范围，下方留30%余量，上方留30%余量
        const dataMin = Math.min(...values);
        const dataMax = Math.max(...values);
        const range = dataMax - dataMin || dataMax * 0.2 || 1;
        const minR = Math.max(0, dataMin - range * 0.3);
        const maxR = dataMax + range * 0.3;
        const rangeR = maxR - minR || 1;

        const xScale = (i) => padL + (i / (data.length - 1)) * plotW;
        const yScale = (v) => padT + plotH - ((v - minR) / rangeR) * plotH;

        const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xScale(i).toFixed(1)},${yScale(d.value).toFixed(1)}`).join(' ');
        const areaPath = linePath + ` L${xScale(data.length - 1).toFixed(1)},${(padT + plotH).toFixed(1)} L${xScale(0).toFixed(1)},${(padT + plotH).toFixed(1)} Z`;

        const yTicks = 4;
        let yTickHtml = '';
        for (let i = 0; i <= yTicks; i++) {
            const val = minR + (rangeR * i / yTicks);
            const y = yScale(val);
            yTickHtml += `<line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="#f0f0f0" stroke-width="1"/>`;
            yTickHtml += `<text x="${padL - 6}" y="${y + 4}" text-anchor="end" fill="#9ca3af" font-size="10">${val.toFixed(1)}${yUnit}</text>`;
        }

        let xTickHtml = '';
        data.forEach((d, i) => {
            const x = xScale(i);
            xTickHtml += `<text x="${x}" y="${H - padB + 14}" text-anchor="end" fill="#9ca3af" font-size="8" transform="rotate(-35,${x},${H - padB + 14})">${d.label}</text>`;
        });

        const mainColor = '#16a34a';
        const mainColorLight = '#22c55e';
        const areaGradId = 'trendAreaGradCost';

        let dotsHtml = data.map((d, i) =>
            `<circle cx="${xScale(i).toFixed(1)}" cy="${yScale(d.value).toFixed(1)}" r="3" fill="${mainColor}" stroke="white" stroke-width="1.5" class="trend-dot" data-label="${d.label}" data-value="${d.value}${tooltipSuffix}"/>`
        ).join('');

        const svg = `
            <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" class="trend-svg">
                <defs>
                    <linearGradient id="${areaGradId}" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="${mainColorLight}" stop-opacity="0.2"/>
                        <stop offset="100%" stop-color="${mainColorLight}" stop-opacity="0.02"/>
                    </linearGradient>
                </defs>
                ${yTickHtml}
                ${xTickHtml}
                <path d="${areaPath}" fill="url(#${areaGradId})"/>
                <path d="${linePath}" fill="none" stroke="${mainColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                ${dotsHtml}
            </svg>
        `;
        container.innerHTML = svg;

        container.querySelectorAll('.trend-dot').forEach(dot => {
            dot.addEventListener('mouseenter', function(e) {
                showTrendTooltip(e, this.dataset.label, this.dataset.value);
            });
            dot.addEventListener('mouseleave', function() {
                hideTrendTooltip();
            });
        });
    }

    function showTrendTooltip(e, label, value) {
        hideTrendTooltip();
        const tip = document.createElement('div');
        tip.className = 'trend-tooltip';
        tip.id = 'trend-tooltip';
        tip.innerHTML = `<div class="trend-tooltip-date">${label}</div><div class="trend-tooltip-rate">${value}</div>`;
        document.body.appendChild(tip);
        const rect = e.target.getBoundingClientRect();
        tip.style.left = (rect.left + rect.width / 2 - tip.offsetWidth / 2) + 'px';
        tip.style.top = (rect.top - tip.offsetHeight - 8) + 'px';
    }

    function hideTrendTooltip() {
        const existing = document.getElementById('trend-tooltip');
        if (existing) existing.remove();
    }

    // ==================== 画像渲染 ====================
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
        const colorMap = { region: 'blue', gender: 'green', age: 'orange', education: 'purple', parenting: 'cyan', consumption: 'rose' };
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

    // 渲染主体下拉列表（包含行业选择）
    function renderEntityDropdown() {
        // 渲染行业选择区域 - checkbox 样式，单选逻辑
        const industryContainer = document.getElementById('entity-industry-options');
        if (industryContainer) {
            const industries = Object.keys(industryEntityMap);
            industryContainer.innerHTML = industries.map(ind => {
                const isActive = ind === state.tempIndustry;
                return `
                    <label class="entity-industry-chip${isActive ? ' active' : ''}" data-industry="${ind}">
                        <input type="checkbox" ${isActive ? 'checked' : ''}>
                        <span>${ind}</span>
                    </label>
                `;
            }).join('');
        }

        // 渲染主体列表 - 显示所有主体，当前行业的主体自动勾选，非当前行业的主体不勾选
        const list = document.getElementById('entity-dropdown-list');
        if (!list) return;
        list.innerHTML = '';

        entities.forEach(entity => {
            const item = document.createElement('div');
            const isCurrentIndustry = entity.industry === state.tempIndustry;
            const isChecked = state.tempSelectedEntities.includes(entity.id);
            item.className = 'entity-dropdown-item' + (!isCurrentIndustry ? ' disabled' : '');

            item.innerHTML = `
                <input type="checkbox" ${isChecked ? 'checked' : ''} ${!isCurrentIndustry ? 'disabled' : ''} data-entity-id="${entity.id}">
                <span>${entity.name}</span>
                <span class="entity-industry-tag">${entity.industry}</span>
            `;

            if (isCurrentIndustry) {
                const checkbox = item.querySelector('input');
                item.addEventListener('click', function(e) {
                    if (e.target.tagName === 'INPUT') return;
                    checkbox.checked = !checkbox.checked;
                    handleEntityCheckboxChange(entity.id, checkbox.checked);
                });
                checkbox.addEventListener('change', function() {
                    handleEntityCheckboxChange(entity.id, this.checked);
                });
            }

            list.appendChild(item);
        });
    }

    function handleEntityCheckboxChange(entityId, checked) {
        if (checked) {
            if (!state.tempSelectedEntities.includes(entityId)) {
                state.tempSelectedEntities.push(entityId);
            }
        } else {
            // 取消勾选主体 - 至少保留一个
            if (state.tempSelectedEntities.length <= 1) {
                showToast('请至少选择一个主体');
                renderEntityDropdown();
                return;
            }
            state.tempSelectedEntities = state.tempSelectedEntities.filter(id => id !== entityId);
        }
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

        // 更新整体转化率的同行对比
        const peerBadge = document.getElementById('overall-peer-badge');
        if (peerBadge) {
            const percentile = getOverallConversionPeerPercentile(state.selectedEntities);
            if (percentile !== null) {
                const peerClass = percentile <= 30 ? 'peer-low' : (percentile <= 60 ? 'peer-mid' : 'peer-high');
                peerBadge.className = 'funnel-rate-peer ' + peerClass;
                peerBadge.textContent = '位于同行转化率的前' + (100 - percentile) + '%';
            }
        }
    }

    // 获取整体转化率的同行对比百分位
    function getOverallConversionPeerPercentile(entityIds) {
        // 取各主体"下单率"的百分位平均作为整体转化率的同行对比参考
        let sum = 0, count = 0;
        entityIds.forEach(id => {
            const data = peerBenchmarkData[id];
            if (data) {
                // 取下单率的百分位
                const item = data.find(d => d.rateName === '下单率');
                if (item) { sum += item.percentile; count++; }
            }
        });
        return count > 0 ? Math.round(sum / count) : null;
    }

    // 更新行业信息
    function updateIndustryInfo() {
        document.getElementById('funnel-industry-info').textContent = 
            '曝光: ' + state.exposureStartDate + ' ~ ' + state.exposureEndDate + 
            ' | 转化周期: ' + state.conversionPeriodDays + '天';
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
        // 更新两边漏斗的 active 样式
        document.querySelectorAll('.funnel-layer-bar').forEach(bar => {
            bar.classList.toggle('active', bar.closest('.funnel-layer').dataset.stage === stageName);
        });
        // 消耗趋势图跟随hover的漏斗层
        renderCostTrendChart();
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

        // 设置默认活跃层为最后一层
        if (!state.activeFunnelStage || !funnelData.stages.find(s => s.name === state.activeFunnelStage)) {
            state.activeFunnelStage = funnelData.stages[funnelData.stages.length - 1].name;
        }

        // 更新时间选择器标签
        const expLabel = document.getElementById('exposure-time-label');
        if (expLabel) expLabel.textContent = state.exposureStartDate + ' ~ ' + state.exposureEndDate;

        renderFunnelChart('customer-funnel-chart', funnelData, true, 'quantity');
        renderFunnelChart('cost-funnel-chart', funnelData, true, 'cost');
        updateConversionRate();
        updateIndustryInfo();
        updateEntitySelectorLabel();
        renderQuantityTrendChart();
        renderCostTrendChart();
    }

    // ==================== 事件绑定 ====================

    // --- 主体选择器 ---
    const entitySelector = document.getElementById('entity-selector');
    const entitySelectorTrigger = document.getElementById('entity-selector-trigger');
    const entityCancelBtn = document.getElementById('entity-cancel-btn');
    const entityConfirmBtn = document.getElementById('entity-confirm-btn');

    if (entitySelectorTrigger) {
        entitySelectorTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            state.tempSelectedEntities = [...state.selectedEntities];
            state.tempIndustry = state.selectedIndustry;
            renderEntityDropdown();
            entitySelector.classList.toggle('open');
            // 关闭画像配置
            document.getElementById('portrait-config')?.classList.remove('open');
        });
    }

    if (entityCancelBtn) {
        entityCancelBtn.addEventListener('click', function() {
            state.tempSelectedEntities = [...state.selectedEntities];
            state.tempIndustry = state.selectedIndustry;
            entitySelector.classList.remove('open');
        });
    }

    if (entityConfirmBtn) {
        entityConfirmBtn.addEventListener('click', function() {
            if (state.tempSelectedEntities.length === 0) {
                showToast('请至少选择一个主体');
                return;
            }
            // 跨行业校验：检查选中的主体是否来自同一行业
            const selectedIndustries = new Set();
            state.tempSelectedEntities.forEach(id => {
                const entity = getEntityById(id);
                if (entity) selectedIndustries.add(entity.industry);
            });
            if (selectedIndustries.size > 1) {
                showEntityError();
                return;
            }
            state.selectedEntities = [...state.tempSelectedEntities];
            state.selectedIndustry = state.tempIndustry;
            entitySelector.classList.remove('open');
            // 重置活跃漏斗层（因为可能换了行业）
            state.activeFunnelStage = null;
            refreshFunnelSection();
        });
    }

    // 行业选择事件委托 - checkbox 样式但单选逻辑
    document.addEventListener('click', function(e) {
        const chip = e.target.closest('.entity-industry-chip');
        if (chip) {
            e.stopPropagation();
            e.preventDefault();
            const industry = chip.dataset.industry;
            if (industry !== state.tempIndustry) {
                // 切换行业，自动全选该行业下所有主体
                state.tempIndustry = industry;
                state.tempSelectedEntities = [...industryEntityMap[industry]];
            }
            // 点击已选中行业不做任何操作（不允许取消行业选择）
            renderEntityDropdown();
            return; // 阻止后续的关闭逻辑
        }
    });

    // 点击外部关闭主体选择器
    document.addEventListener('click', function(e) {
        // 排除行业 chip 的点击（切换行业不应关闭卡片）
        if (e.target.closest('.entity-industry-chip')) return;
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

    // 漏斗图时间选择器 - 曝光时间范围
    const exposureTimePicker = document.getElementById('exposure-time-picker');
    if (exposureTimePicker) {
        exposureTimePicker.addEventListener('click', function() {
            showFunnelTimePicker('exposure');
        });
    }

    function showFunnelTimePicker(type) {
        let existing = document.getElementById('funnel-date-picker-modal');
        if (existing) existing.remove();

        const isExposure = type === 'exposure';
        const title = isExposure ? '选择曝光时间范围' : '选择观察时间范围';
        const startVal = isExposure ? state.exposureStartDate : '';
        const endVal = isExposure ? state.exposureEndDate : '';

        const modal = document.createElement('div');
        modal.id = 'funnel-date-picker-modal';
        modal.className = 'conversion-config-modal open';
        modal.innerHTML = `
            <div class="conversion-config-content" style="width:360px;">
                <div class="conversion-config-title">
                    <span>${title}</span>
                    <button class="conversion-config-close" id="funnel-date-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="conversion-config-body">
                    <div class="conversion-config-row">
                        <label>开始</label>
                        <input type="date" id="funnel-date-start" class="conversion-select" value="${startVal}">
                    </div>
                    <div class="conversion-config-row">
                        <label>结束</label>
                        <input type="date" id="funnel-date-end" class="conversion-select" value="${endVal}">
                    </div>
                </div>
                <div class="conversion-config-footer">
                    <button class="entity-btn entity-btn-cancel" id="funnel-date-cancel-btn">取消</button>
                    <button class="entity-btn entity-btn-confirm" id="funnel-date-confirm-btn">确定</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('funnel-date-close').addEventListener('click', () => modal.remove());
        document.getElementById('funnel-date-cancel-btn').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.remove();
        });
        document.getElementById('funnel-date-confirm-btn').addEventListener('click', function() {
            const start = document.getElementById('funnel-date-start').value;
            const end = document.getElementById('funnel-date-end').value;
            if (start && end && start <= end) {
                if (isExposure) {
                    state.exposureStartDate = start;
                    state.exposureEndDate = end;
                }
                refreshFunnelSection();
            }
            modal.remove();
        });
    }

    // ==================== 漏斗维度切换 ====================
    const funnelModeToggle = document.getElementById('funnel-mode-toggle');
    if (funnelModeToggle) {
        funnelModeToggle.addEventListener('click', function(e) {
            const btn = e.target.closest('.funnel-mode-btn');
            if (!btn) return;
            const mode = btn.dataset.mode;
            if (mode === state.funnelMode) return;
            state.funnelMode = mode;
            funnelModeToggle.querySelectorAll('.funnel-mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            refreshFunnelSection();
        });
    }

    // ==================== 转化周期选择器 ====================
    const periodBtns = document.querySelectorAll('.period-btn');
    const periodCustomInput = document.getElementById('period-custom-input');
    const periodCustomDays = document.getElementById('period-custom-days');
    const periodError = document.getElementById('period-error');

    periodBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const days = this.dataset.days;
            periodBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            if (days === 'custom') {
                periodCustomInput.style.display = 'flex';
                periodError.textContent = '';
                // 不立即更新，等待用户输入
            } else {
                periodCustomInput.style.display = 'none';
                periodError.textContent = '';
                state.conversionPeriodMode = days;
                state.conversionPeriodDays = parseInt(days);
                refreshFunnelSection();
            }
        });
    });

    if (periodCustomDays) {
        periodCustomDays.addEventListener('input', function() {
            const val = parseInt(this.value);
            if (this.value && val > 90) {
                periodError.textContent = '转化周期过长，请输入90天以内的数';
                periodError.style.color = 'var(--danger)';
            } else if (this.value && val < 1) {
                periodError.textContent = '请输入有效的天数';
                periodError.style.color = 'var(--danger)';
            } else {
                periodError.textContent = '';
                if (this.value && val >= 1 && val <= 90) {
                    state.conversionPeriodMode = 'custom';
                    state.conversionPeriodDays = val;
                    refreshFunnelSection();
                }
            }
        });
    }

    // ==================== 通用功能（保留原有） ====================

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

    // ==================== 初始化 ====================
    refreshFunnelSection();

    const btnRecommend = document.querySelector('.btn-recommend');
    if (btnRecommend) btnRecommend.addEventListener('click', () => showToast('经营工具推荐功能开发中...'));
    const bellIcon = document.querySelector('.user-info .fa-bell');
    if (bellIcon) bellIcon.addEventListener('click', () => showToast('暂无新通知'));
    const avatar = document.querySelector('.avatar');
    if (avatar) avatar.addEventListener('click', () => showToast('用户中心功能开发中...'));

});
