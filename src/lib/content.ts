export type Bi = { en: string; zh: string }

export const LESSONS: { title: Bi; icon: "flame" | "piggy" | "percent" | "trend" | "landmark" | "chart"; body: Bi }[] = [
  {
    title: { en: "What FIRE is", zh: "FIRE 係咩" },
    icon: "flame",
    body: {
      en: "FIRE means Financial Independence, Retire Early. Save a large share of your income, invest it, and one day your investments can pay your living costs. Then work becomes a choice, not a must. It is not about being rich. It is about the gap between what you earn and what you spend, and what that gap buys you over time.",
      zh: "FIRE 即係「財務自由，提早退休」。儲落一大部分收入，拎去投資，等投資回報可以支付生活開支，咁工作就變成選擇，而唔係必須。重點唔係賺得多，而係收入同開支之間嘅差額，以及呢個差額隨時間可以買返咩。",
    },
  },
  {
    title: { en: "Savings rate beats salary", zh: "儲蓄率勝過人工" },
    icon: "piggy",
    body: {
      en: "Two people earn HK$20k. A saves 10%, B saves 50%. B reaches freedom far sooner, even with the same salary. Why? Your savings rate sets how fast you fill your pot and how little you need to live on. A higher salary helps, but cutting the gap between income and spending usually helps more.",
      zh: "兩個人都人工HK$20,000。A儲一成，B儲一半。即使人工一樣，B都會早好多達到自由。原因係儲蓄率同時決定你幾快儲到錢，以及你要幾多錢生活。加人工有幫助，但縮窄收入同開支之間嘅差距，通常效果更大。",
    },
  },
  {
    title: { en: "The 4% rule", zh: "4% 法則" },
    icon: "percent",
    body: {
      en: "A common guideline: withdraw about 4% of your portfolio in year one, then raise that amount with inflation each year. Past US studies suggest this lasted about 30 years. Need HK$120,000 a year? You need about HK$3 million. Use 3.5% for a more cautious estimate. This is a rough guide from past markets, not a promise.",
      zh: "一個常見參考：第一年提取投資組合約4%，之後每年隨通脹加番少少。過往美國研究顯示大約可以用30年。每年要HK$120,000，大約需要HK$3,000,000。想保守啲可以用3.5%。呢個係根據過去市場嘅粗略指引，唔係保證。",
    },
  },
  {
    title: { en: "Compound interest", zh: "複利" },
    icon: "trend",
    body: {
      en: "Warren Buffett has said most of his wealth came after he turned 50. Compounding is interest on interest. HK$10,000 growing 6% a year becomes about HK$32,000 in 20 years and HK$57,000 in 30 years, with no extra saving. Time is the ingredient you cannot buy later. Starting at 20 can beat saving twice as much from 30.",
      zh: "巴菲特話，佢大部分財富係50歲之後先累積。複利即係利息再生利息。HK$10,000 每年增長6%，20年後約HK$32,000，30年後約HK$57,000，而且唔使另外儲錢。時間係你之後買唔返嘅原料。20歲開始，可以勝過30歲先儲兩倍錢。",
    },
  },
  {
    title: { en: "MPF basics", zh: "強積金基本知識" },
    icon: "landmark",
    body: {
      en: "Hong Kong's Mandatory Provident Fund: you and your employer each contribute 5% of salary, capped at HK$1,500 a month each. In most cases the money is locked until age 65. So this app does not count it toward your freedom date. It shows it as a top-up after 65. Check your statements and fund choices every year.",
      zh: "香港強制性公積金：僱員同僱主各供5%薪金，每月各上限HK$1,500。大多數情況要到65歲先可以提取。所以呢個App唔會計入你嘅自由日子，而係當作65歲後嘅額外補充。每年要睇吓結單同基金選擇。",
    },
  },
  {
    title: { en: "Index funds", zh: "指數基金" },
    icon: "chart",
    body: {
      en: "Instead of picking single stocks, an index fund holds many companies that follow a market index. Low fees matter: a 1% yearly fee can eat a large share of growth over decades. Hong Kong has index trackers such as the Tracker Fund, shown here as an illustration only. This is not a recommendation. Read a fund's documents before investing.",
      zh: "指數基金唔係揀個別股票，而係持有跟隨某個市場指數嘅一籃子公司。費用好重要：每年1%費用，幾十年下來可以食走大部分增長。香港有盈富基金等指數追蹤基金，呢度只係作說明，唔係推介。投資前請先睇基金文件。",
    },
  },
]

export const QUIZ: { q: Bi; options: [Bi, Bi, Bi, Bi]; answer: 0 | 1 | 2 | 3 }[] = [
  {
    q: { en: "Which matters most for reaching freedom sooner?", zh: "邊樣嘢最影響你幾時可以自由？" },
    options: [
      { en: "Having the highest salary", zh: "人工最高" },
      { en: "Your savings rate", zh: "你嘅儲蓄率" },
      { en: "Picking the hottest stock", zh: "揀最熱門嘅股票" },
      { en: "Ignoring inflation", zh: "唔理通脹" },
    ],
    answer: 1,
  },
  {
    q: {
      en: "Under the 4% rule, HK$200,000 a year of spending needs roughly how much?",
      zh: "按4%法則，每年花HK$200,000，大約需要幾多資產？",
    },
    options: [
      { en: "HK$2 million", zh: "HK$2百萬" },
      { en: "HK$5 million", zh: "HK$5百萬" },
      { en: "HK$8 million", zh: "HK$8百萬" },
      { en: "HK$20 million", zh: "HK$2千萬" },
    ],
    answer: 1,
  },
  {
    q: { en: "Why does this app keep MPF out of your freedom date?", zh: "點解呢個App唔將強積金計入自由日子？" },
    options: [
      { en: "It is taxed twice", zh: "要交兩次稅" },
      { en: "It is locked until 65 in most cases", zh: "大多數情況鎖到65歲" },
      { en: "It earns nothing", zh: "冇任何回報" },
      { en: "It is cash in a bank", zh: "係銀行現金" },
    ],
    answer: 1,
  },
  {
    q: { en: "What does compound interest mean?", zh: "複利係咩意思？" },
    options: [
      { en: "Interest only on your first deposit", zh: "只計首次存款嘅利息" },
      { en: "Interest earned on earlier interest", zh: "利息再生利息" },
      { en: "A fixed bank fee", zh: "銀行固定收費" },
      { en: "A tax on gains", zh: "對收益徵收嘅稅" },
    ],
    answer: 1,
  },
  {
    q: { en: "Why does a 1% higher yearly fund fee hurt so much?", zh: "基金每年多收1%費用，點解影響咁大？" },
    options: [
      { en: "It is paid only once", zh: "只需付一次" },
      { en: "It cuts long-term growth every year", zh: "每年都削減長期增長" },
      { en: "It only affects bonds", zh: "只影響債券" },
      { en: "It is refunded at 65", zh: "65歲時退還" },
    ],
    answer: 1,
  },
  {
    q: {
      en: "A friend says \"buy stock X, it's guaranteed to go up.\" What is the best response?",
      zh: "朋友話「買股票X，保證升」。最好嘅回應係？",
    },
    options: [
      { en: "Buy it now", zh: "即刻買" },
      { en: "Ask how much you can borrow", zh: "問你可以借幾多" },
      { en: "No investment is guaranteed. Check the risks and do your own research", zh: "冇投資係保證嘅，要睇清風險，自己研究" },
      { en: "Put your whole MPF in it", zh: "將全部強積金放入" },
    ],
    answer: 2,
  },
]
