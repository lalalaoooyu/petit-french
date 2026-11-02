export type CourseId = "daily" | "exam";
/** [french, chinese, ...extras]; extras: a colour hex, a digit, or an example "fr|zh" */
export type WordRow = [string, string, ...string[]];
export type Deck = { i: string; tip: string; w: WordRow[] };
export type Course = { name: string; sub: string; decks: Record<string, Deck> };
export type Word = { fr: string; zh: string; deck: string; course: CourseId; extra?: string; example?: { fr: string; zh: string } };

export const COURSES: Record<CourseId, Course> = {
 daily:{name:"日常",sub:"旅行 · 生活",decks:{
  "问候":{i:"bubble",tip:"法国人进店、上车都会先说 Bonjour，不打招呼直接问问题会被认为很失礼。晚上六点后改说 Bonsoir。",w:[
   ["Bonjour","你好","Bonjour madame !|您好，女士！"],["Bonsoir","晚上好"],["Salut","嗨（熟人之间）","Salut, ça va ?|嗨，还好吗？"],["Merci beaucoup","非常感谢"],["De rien","不客气"],["Au revoir","再见"],["À bientôt !","回头见！"],["À demain !","明天见！"],["S'il vous plaît","请（对您）"],["S'il te plaît","请（对你）"],["Excusez-moi","打扰一下","Excusez-moi, où est la gare ?|打扰一下，火车站在哪里？"],["Pardon","对不起；借过"],["Bonne journée !","祝你今天愉快！"],["Bonne soirée !","祝你晚上愉快！"],["Enchanté(e)","很高兴认识你"],["Ça va ?","还好吗？","Ça va ? — Oui, ça va bien.|还好吗？——嗯，挺好的。"]]},
  "咖啡面包":{i:"croissant",tip:"在咖啡馆点 un café 得到的是一小杯浓缩咖啡；想要美式可以说 un café allongé。面包店里说 Je voudrais… 最礼貌。",w:[
   ["la boulangerie","面包店","Je vais à la boulangerie.|我去面包店。"],["le croissant","可颂"],["la baguette","法棍","Une baguette, s'il vous plaît.|请给我一根法棍。"],["le pain au chocolat","巧克力面包"],["la tarte","水果挞"],["un café","一杯浓缩咖啡"],["un café crème","奶咖"],["un thé","一杯茶"],["un chocolat chaud","一杯热巧克力"],["le sucre","糖"],["sur place","堂食"],["à emporter","外带","C'est pour emporter.|这个外带。"],["Je voudrais…","我想要……","Je voudrais un croissant.|我想要一个可颂。"],["Ce sera tout","就这些"],["Et avec ceci ?","还要别的吗？"]]},
  "餐厅":{i:"croissant",tip:"法国餐厅不会主动拿账单，需要自己说 L'addition, s'il vous plaît。une carafe d'eau 是免费的自来水。",w:[
   ["la carte","菜单"],["le menu","套餐"],["Une table pour deux","两位"],["J'ai réservé au nom de…","我用……的名字订了位"],["l'entrée","前菜"],["le plat principal","主菜"],["le dessert","甜点"],["le plat du jour","今日特餐"],["une carafe d'eau","一壶水（免费）"],["un verre de vin rouge","一杯红酒"],["saignant","三分熟"],["bien cuit","全熟"],["Je suis allergique à…","我对……过敏","Je suis allergique aux noix.|我对坚果过敏。"],["végétarien","素食的"],["C'était délicieux !","太好吃了！"],["l'addition, s'il vous plaît","请结账"]]},
  "超市":{i:"bag",tip:"法国超市大多周日不开或只开半天。称水果蔬菜有的店要自己称重贴标签。",w:[
   ["le supermarché","超市"],["le panier","购物篮"],["le chariot","购物车"],["la caisse","收银台","Où est la caisse ?|收银台在哪？"],["le rayon","货架区"],["les fruits","水果"],["les légumes","蔬菜"],["la viande","肉"],["le poulet","鸡肉"],["les œufs","鸡蛋"],["le lait","牛奶"],["le fromage","奶酪"],["le beurre","黄油"],["le riz","米饭；大米"],["un kilo de…","一公斤……","Un kilo de pommes, s'il vous plaît.|请给我一公斤苹果。"],["en promotion","促销中"]]},
  "交通":{i:"train",tip:"法国火车票要在上车前确认好车次和车厢 voiture；巴黎地铁票现在大多用 Navigo 卡或手机买。",w:[
   ["la gare","火车站"],["l'aéroport","机场"],["le métro","地铁"],["le bus","公交车"],["le train","火车"],["le billet","票"],["un aller simple","单程票"],["un aller-retour","往返票"],["le quai","站台"],["la voie","轨道（几号线）"],["la sortie","出口"],["la correspondance","换乘"],["en retard","晚点"],["le taxi","出租车"],["Le train part à quelle heure ?","火车几点出发？"],["Je voudrais un billet pour Paris","我想买一张去巴黎的票"],["C'est direct ?","是直达的吗？"]]},
  "酒店":{i:"bed",tip:"欧洲的「一楼」是 le rez-de-chaussée，le premier étage 其实是中国的二楼。",w:[
   ["l'hôtel","酒店"],["la réception","前台"],["la chambre","房间"],["une chambre double","双人房"],["la clé","钥匙"],["le petit-déjeuner","早餐","Le petit-déjeuner est compris ?|含早餐吗？"],["J'ai une réservation","我有预订"],["pour deux nuits","住两晚"],["la douche","淋浴"],["la serviette","毛巾"],["l'ascenseur","电梯"],["le rez-de-chaussée","一楼（地面层）"],["le premier étage","二楼"],["le mot de passe du wifi","wifi 密码"],["À quelle heure est le check-out ?","几点退房？"]]},
  "问路":{i:"map",tip:"问路先说 Excusez-moi，听不懂时说 Pouvez-vous parler plus lentement ?（能说慢一点吗？）",w:[
   ["Où est… ?","……在哪里？","Où est le musée ?|博物馆在哪里？"],["à gauche","左边"],["à droite","右边"],["tout droit","直走","Allez tout droit.|一直往前走。"],["tournez","转弯"],["près d'ici","离这儿近"],["loin","远"],["la rue","街道"],["le carrefour","十字路口"],["le feu","红绿灯"],["en face de","在……对面"],["à côté de","在……旁边"],["au coin de la rue","在街角"],["à pied","走路"],["C'est à combien de minutes ?","要走几分钟？"],["Je suis perdu(e)","我迷路了"]]},
  "购物":{i:"bag",tip:"法国每年一月和七月有法定打折季 les soldes。试衣服前问一句 Je peux essayer ? 比较礼貌。",w:[
   ["C'est combien ?","多少钱？"],["Je regarde seulement","我只是看看"],["Vous acceptez la carte ?","可以刷卡吗？"],["en espèces","用现金"],["trop cher","太贵了"],["moins cher","便宜一点"],["la taille","尺码","Vous avez une taille plus grande ?|有大一号的吗？"],["la pointure","鞋码"],["Je peux essayer ?","我可以试穿吗？"],["la cabine d'essayage","试衣间"],["un sac, s'il vous plaît","请给我一个袋子"],["le reçu","收据"],["rembourser","退款"],["le marché","市场"],["les soldes","打折季"]]},
  "时间约会":{i:"clock",tip:"法国人说时间常用 24 小时制：18h 读作 dix-huit heures。约人时 On se voit… ? 很常用。",w:[
   ["Il est quelle heure ?","几点了？"],["Il est midi","中午十二点"],["Il est minuit","午夜十二点"],["et demie","半","Il est trois heures et demie.|三点半。"],["et quart","一刻"],["moins le quart","差一刻"],["le matin","早上"],["l'après-midi","下午"],["le soir","晚上"],["ce week-end","这个周末"],["On se voit quand ?","我们什么时候见？"],["Tu es libre demain ?","你明天有空吗？"],["Rendez-vous à 18h","下午六点见"],["Je suis en retard","我迟到了"],["D'accord !","好的！"]]},
  "交朋友":{i:"bubble",tip:"对朋友和同龄人用 tu，对陌生人、长辈和店员用 vous。不确定时先用 vous。",w:[
   ["Tu t'appelles comment ?","你叫什么名字？"],["Tu viens d'où ?","你从哪里来？","Je viens de Chine.|我来自中国。"],["Tu habites où ?","你住在哪？"],["Qu'est-ce que tu fais ?","你是做什么的？"],["Tu aimes… ?","你喜欢……吗？"],["moi aussi","我也是"],["moi non plus","我也不"],["C'est génial !","太棒了！"],["C'est vrai ?","真的吗？"],["On prend un verre ?","一起喝一杯？"],["Tu as Instagram ?","你有 Instagram 吗？"],["Bon week-end !","周末愉快！"],["la bise","贴面礼"],["copain / copine","朋友；男/女朋友"],["Ça marche !","没问题！"]]},
  "手机网络":{i:"keys",tip:"法国的 SIM 卡叫 une carte SIM，常见运营商有 Orange、Free、SFR。",w:[
   ["le portable","手机"],["la batterie","电池"],["le chargeur","充电器","Vous avez un chargeur ?|您有充电器吗？"],["la prise","插座"],["recharger","充电"],["le réseau","信号；网络"],["le wifi","无线网"],["la carte SIM","SIM 卡"],["le forfait","套餐"],["envoyer un message","发消息"],["appeler","打电话"],["le numéro de téléphone","电话号码"],["l'appli","应用程序"],["télécharger","下载"],["Ça ne marche pas","这个不好用"]]},
  "看医生":{i:"cross",tip:"法国小病一般先去药店 la pharmacie（绿色十字招牌），药剂师可以给建议。急救电话是 15，统一紧急电话是 112。",w:[
   ["le médecin","医生"],["la pharmacie","药店"],["l'hôpital","医院"],["le rendez-vous","预约"],["J'ai mal à la tête","我头疼"],["J'ai mal au ventre","我肚子疼"],["J'ai de la fièvre","我发烧了"],["Je tousse","我咳嗽"],["Je suis enrhumé(e)","我感冒了"],["le médicament","药"],["l'ordonnance","处方"],["la carte vitale","医保卡"],["allergique","过敏的"],["Ça fait mal ici","这里疼"],["Je me sens mal","我不舒服"]]},
  "应急":{i:"cross",tip:"丢了护照先去警察局 le commissariat 报案拿证明，再联系中国大使馆。",w:[
   ["Au secours !","救命！"],["Appelez la police !","报警！"],["Appelez une ambulance !","叫救护车！"],["le commissariat","警察局"],["J'ai perdu mon passeport","我护照丢了"],["On m'a volé mon sac","我的包被偷了"],["le voleur","小偷"],["Attention !","小心！"],["C'est urgent","很紧急"],["Je ne comprends pas","我听不懂"],["Vous parlez anglais ?","您会说英语吗？"],["Pouvez-vous répéter ?","能再说一遍吗？"],["Plus lentement, s'il vous plaît","请说慢一点"],["l'ambassade de Chine","中国大使馆"],["les toilettes","洗手间","Où sont les toilettes ?|洗手间在哪？"]]}
 }},
 exam:{name:"考试",sub:"DELF A1 考纲",decks:{
  "自我介绍":{i:"bubble",tip:"DELF A1 口语第一部分就是自我介绍：名字、年龄、国籍、住址、职业、爱好，提前背熟一段。",w:[
   ["Je m'appelle…","我叫……","Je m'appelle Alice.|我叫 Alice。"],["J'ai vingt ans","我二十岁"],["Je suis chinois(e)","我是中国人"],["Je viens de Chine","我来自中国"],["J'habite à Tokyo","我住在东京"],["Je suis étudiant(e)","我是学生"],["Je parle chinois","我会说中文"],["Je parle un peu français","我会说一点法语"],["la nationalité","国籍"],["l'adresse","地址"],["le prénom","名"],["le nom de famille","姓"],["l'âge","年龄"],["né(e) le…","出生于……"],["la langue","语言"]]},
  "家庭":{i:"house",tip:"所有格要跟着名词的阴阳性变：mon père、ma mère、mes parents。",w:[
   ["la famille","家庭"],["la mère","妈妈"],["le père","爸爸"],["les parents","父母"],["la sœur","姐妹"],["le frère","兄弟","J'ai un frère.|我有一个兄弟。"],["le fils","儿子"],["la fille","女儿；女孩"],["le mari","丈夫"],["la femme","妻子；女人"],["l'enfant","孩子"],["les grands-parents","祖父母"],["l'oncle","叔叔；舅舅"],["la tante","阿姨；姑姑"],["le cousin","表/堂兄弟"],["marié(e)","已婚的"],["célibataire","单身的"]]},
  "数字":{i:"dice",tip:"法语 70 = 60+10（soixante-dix），80 = 4×20（quatre-vingts），90 = 4×20+10，听力里最常考。",w:[
   ["un","一","1"],["cinq","五","5"],["onze","十一","11"],["seize","十六","16"],["dix-sept","十七","17"],["vingt","二十","20"],["vingt et un","二十一","21"],["trente","三十","30"],["cinquante","五十","50"],["soixante","六十","60"],["soixante-dix","七十","70"],["soixante-quinze","七十五","75"],["quatre-vingts","八十","80"],["quatre-vingt-dix","九十","90"],["cent","一百","100"],["mille","一千","1000"]]},
  "时间日期":{i:"clock",tip:"星期和月份在法语里都小写：lundi、janvier。日期说 le 14 juillet，1 号说 le premier。",w:[
   ["lundi","星期一"],["mardi","星期二"],["mercredi","星期三"],["jeudi","星期四"],["vendredi","星期五"],["samedi","星期六"],["dimanche","星期日"],["janvier","一月"],["mars","三月"],["mai","五月"],["juillet","七月"],["septembre","九月"],["décembre","十二月"],["aujourd'hui","今天"],["demain","明天"],["hier","昨天"],["la semaine","星期；周"],["Il est quelle heure ?","几点了？"]]},
  "颜色":{i:"palette",tip:"颜色形容词放在名词后面，并且要配合阴阳性：un sac vert、une robe verte。",w:[
   ["rouge","红色","#e0533d","La pomme est rouge.|苹果是红色的。"],["bleu","蓝色","#4a8fe0"],["vert","绿色","#6abe30"],["jaune","黄色","#f7c843"],["rose","粉色","#ff9eb5"],["noir","黑色","#2b1d14"],["blanc","白色","#ffffff"],["gris","灰色","#9a9a9a"],["violet","紫色","#9d6bd9"],["orange","橙色","#f08a3a"],["marron","棕色","#8f5a2b"],["beige","米色","#e6d3a8"]]},
  "天气":{i:"sun",tip:"天气几乎都用 Il fait + 形容词，但下雨下雪是动词：Il pleut、Il neige。",w:[
   ["Il fait beau","天气好"],["Il fait mauvais","天气不好"],["Il fait chaud","天气热"],["Il fait froid","天气冷"],["Il pleut","下雨"],["Il neige","下雪"],["Il y a du vent","有风"],["Il y a des nuages","多云"],["le soleil","太阳"],["la température","气温"],["le printemps","春天"],["l'été","夏天"],["l'automne","秋天"],["l'hiver","冬天"],["la météo","天气预报"]]},
  "食物饮料":{i:"croissant",tip:"说「一些」不确定数量的食物用部分冠词：du pain、de la viande、de l'eau。",w:[
   ["le pain","面包","Je mange du pain.|我吃面包。"],["le fromage","奶酪"],["la viande","肉"],["le poisson","鱼"],["les légumes","蔬菜"],["les fruits","水果"],["la pomme","苹果"],["la tomate","番茄"],["les pâtes","意面"],["l'eau","水"],["le jus d'orange","橙汁"],["le thé","茶"],["le petit-déjeuner","早餐"],["le déjeuner","午餐"],["le dîner","晚餐"],["J'ai faim","我饿了"],["J'ai soif","我渴了"]]},
  "爱好":{i:"cat",tip:"jouer au + 运动（jouer au tennis），jouer du + 乐器（jouer du piano）。",w:[
   ["le sport","运动"],["la musique","音乐"],["lire","阅读"],["voyager","旅行"],["le cinéma","电影"],["nager","游泳"],["danser","跳舞"],["cuisiner","做饭"],["chanter","唱歌"],["dessiner","画画"],["jouer au football","踢足球"],["jouer du piano","弹钢琴"],["faire du vélo","骑自行车"],["J'aime…","我喜欢……","J'aime voyager.|我喜欢旅行。"],["Je n'aime pas…","我不喜欢……"],["Je préfère…","我更喜欢……"]]},
  "住房":{i:"house",tip:"写作题常要求描述住处：J'habite dans un appartement de deux pièces（我住两室的公寓）。",w:[
   ["la maison","房子"],["l'appartement","公寓"],["la pièce","房间（统称）"],["la chambre","卧室"],["la cuisine","厨房"],["la salle de bain","浴室"],["le salon","客厅"],["les toilettes","厕所"],["le jardin","花园"],["le balcon","阳台"],["le lit","床"],["la table","桌子"],["la chaise","椅子"],["le loyer","房租"],["le voisin","邻居"]]},
  "城市地点":{i:"map",tip:"去某地用 à + 冠词：à la banque、au cinéma（à+le=au）、aux toilettes（à+les=aux）。",w:[
   ["la ville","城市"],["la banque","银行"],["la poste","邮局"],["le musée","博物馆"],["le cinéma","电影院"],["la bibliothèque","图书馆"],["l'école","学校"],["l'université","大学"],["le parc","公园"],["l'église","教堂"],["le restaurant","餐厅"],["le magasin","商店"],["la place","广场"],["le quartier","街区"],["la mairie","市政厅"]]},
  "交通出行":{i:"train",tip:"交通工具前的介词：en bus、en train、en voiture，但 à pied（步行）、à vélo（骑车）。",w:[
   ["la voiture","汽车"],["le vélo","自行车"],["l'avion","飞机"],["le bateau","船"],["en bus","坐公交"],["en train","坐火车"],["à pied","步行"],["à vélo","骑车"],["le ticket","票（地铁/公交）"],["l'arrêt de bus","公交站"],["le départ","出发"],["l'arrivée","到达"],["partir","出发；离开"],["arriver","到达"],["prendre le métro","坐地铁"]]},
  "购物":{i:"bag",tip:"问价格：Ça coûte combien ? / C'est combien ? 价格读法：3,50 € 读作 trois euros cinquante。",w:[
   ["le magasin","商店"],["le prix","价格"],["l'euro","欧元"],["cher","贵"],["pas cher","便宜"],["acheter","买"],["payer","付钱"],["la carte bancaire","银行卡"],["les vêtements","衣服"],["le pantalon","裤子"],["la robe","连衣裙"],["la chemise","衬衫"],["les chaussures","鞋"],["Ça coûte combien ?","多少钱？"],["Je prends ça","我要这个"]]},
  "身体健康":{i:"heart",tip:"「我……疼」用 avoir mal à：j'ai mal à la tête、j'ai mal au dos、j'ai mal aux dents。",w:[
   ["la tête","头"],["les yeux","眼睛"],["le nez","鼻子"],["la bouche","嘴"],["l'oreille","耳朵"],["les dents","牙齿"],["le bras","手臂"],["la main","手"],["la jambe","腿"],["le pied","脚"],["le dos","背"],["le ventre","肚子"],["malade","生病的"],["J'ai mal à…","我……疼"],["Je suis fatigué(e)","我累了"]]},
  "职业":{i:"book",tip:"说职业时不加冠词：Je suis professeur（不说 un professeur）。很多职业有阴阳两种形式。",w:[
   ["le travail","工作"],["le professeur","老师"],["le médecin","医生"],["l'infirmier / l'infirmière","护士"],["l'ingénieur","工程师"],["le vendeur / la vendeuse","售货员"],["le serveur / la serveuse","服务员"],["le cuisinier","厨师"],["l'étudiant / l'étudiante","学生"],["l'avocat","律师"],["le bureau","办公室"],["l'entreprise","公司"],["travailler","工作（动词）"],["Je travaille dans…","我在……工作"],["Qu'est-ce que vous faites ?","您是做什么的？"]]},
  "形容词":{i:"star",tip:"大部分形容词放在名词后；但 grand、petit、beau、bon、jeune、vieux 这几个常用的放在名词前。",w:[
   ["grand(e)","大的；高的"],["petit(e)","小的；矮的"],["beau / belle","美的"],["joli(e)","漂亮的"],["bon / bonne","好的"],["mauvais(e)","坏的"],["jeune","年轻的"],["vieux / vieille","老的"],["nouveau / nouvelle","新的"],["content(e)","高兴的"],["triste","难过的"],["sympa","人很好的"],["facile","容易的"],["difficile","难的"],["intéressant(e)","有趣的"]]},
  "介词":{i:"map",tip:"城市前用 à（à Paris），阴性国家用 en（en France），阳性国家用 au（au Japon）。",w:[
   ["dans","在……里面"],["sur","在……上面"],["sous","在……下面"],["devant","在……前面"],["derrière","在……后面"],["entre","在……之间"],["à côté de","在……旁边"],["avec","和……一起"],["sans","没有"],["pour","为了"],["chez","在……家","Je vais chez Marie.|我去 Marie 家。"],["à Paris","在巴黎"],["en France","在法国"],["au Japon","在日本"],["avant / après","之前 / 之后"]]},
  "核心动词":{i:"scroll",tip:"être、avoir、aller、faire 是最常用的四个不规则动词，A1 必须背熟全部变位。",w:[
   ["je suis","我是（être）"],["tu es","你是（être）"],["il / elle est","他/她是（être）"],["nous sommes","我们是（être）"],["vous êtes","您/你们是（être）"],["ils sont","他们是（être）"],["j'ai","我有（avoir）"],["tu as","你有（avoir）"],["nous avons","我们有（avoir）"],["ils ont","他们有（avoir）"],["je vais","我去（aller）"],["nous allons","我们去（aller）"],["je fais","我做（faire）"],["je veux","我想要（vouloir）"],["je peux","我能（pouvoir）"],["je prends","我拿/乘（prendre）"]]},
  "疑问词":{i:"book",tip:"口语里最简单的提问方式是句尾升调：Tu viens ? 正式一点加 Est-ce que：Est-ce que tu viens ?",w:[
   ["Qui ?","谁？"],["Quoi ?","什么？"],["Qu'est-ce que… ?","……什么？","Qu'est-ce que tu manges ?|你在吃什么？"],["Où ?","哪里？"],["Quand ?","什么时候？"],["Comment ?","怎么样？"],["Pourquoi ?","为什么？"],["Combien ?","多少？"],["Quel / Quelle ?","哪个？"],["À quelle heure ?","几点？"],["Est-ce que…","是不是……（疑问句）"],["parce que","因为"]]},
  "易错点":{i:"quill",tip:"这些词长得像英语，意思却完全不同（faux amis），或者是发音里最容易读错的地方。",w:[
   ["le pain","面包（不是 pain 疼痛）"],["la librairie","书店（不是图书馆）"],["la bibliothèque","图书馆"],["la location","租赁（不是位置）"],["assister à","参加（不是协助）"],["blesser","使受伤（不是祝福）"],["sensible","敏感的（不是明智的）"],["actuellement","目前（不是实际上）"],["la journée","白天；一天（不是旅程）"],["attendre","等待（不是参加）"],["Paris","巴黎（词尾 s 不发音）"],["beaucoup","很多（p 不发音）"],["petit","小的（词尾 t 不发音）"],["les amis","朋友们（必须连读 lez-amis）"],["un ami","一个朋友（必须连读 un-nami）"],["et alors","然后（et 后面不连读）"]]}
 }}
};

export function deckWords(course: CourseId, deck: string): Word[] {
  return COURSES[course].decks[deck].w.map(([fr, zh, ...rest]) => {
    const ex = rest.find((x) => x.includes("|"));
    const extra = rest.find((x) => !x.includes("|"));
    return { fr, zh, deck, course, extra, example: ex ? { fr: ex.split("|")[0], zh: ex.split("|")[1] } : undefined };
  });
}

export const deckNames = (course: CourseId) => Object.keys(COURSES[course].decks);

/* elided l' and plural les hide the gender, so those nouns need a lookup */
const ELIDED: Record<string, "m" | "f"> = {
  aéroport: "m", hôtel: "m", ascenseur: "m", "après-midi": "m", appli: "f", hôpital: "m", ordonnance: "f", ambassade: "f",
  entrée: "f", addition: "f", adresse: "f", âge: "m", enfant: "m", oncle: "m", été: "m", automne: "m", hiver: "m", eau: "f",
  appartement: "m", école: "f", université: "f", église: "f", avion: "m", arrêt: "m", arrivée: "f", euro: "m", oreille: "f",
  ingénieur: "m", entreprise: "f", avocat: "m", fruits: "m", légumes: "m", œufs: "m", soldes: "m", toilettes: "f",
  parents: "m", "grands-parents": "m", pâtes: "f", vêtements: "m", chaussures: "f", yeux: "m", dents: "f", amis: "m",
};

export function gender(fr: string): { g: "m" | "f"; plural: boolean } | null {
  const s = fr.toLowerCase();
  if (s.includes("?") || s.includes("/") || s.split(" ").length > 4) return null;
  if (/^(le|un) /.test(s)) return { g: "m", plural: false };
  if (/^(la|une) /.test(s)) return { g: "f", plural: false };
  const m = s.match(/^(l'|les )([^\s,]+)/);
  if (m && ELIDED[m[2]]) return { g: ELIDED[m[2]], plural: m[1] === "les " };
  return null;
}

let index: Map<string, Word> | null = null;
/** look a word up by its French text across both courses */
export function findWord(fr: string): Word | undefined {
  if (!index) {
    index = new Map();
    for (const c of Object.keys(COURSES) as CourseId[]) for (const d of deckNames(c)) for (const w of deckWords(c, d)) if (!index.has(w.fr)) index.set(w.fr, w);
  }
  return index.get(fr);
}
