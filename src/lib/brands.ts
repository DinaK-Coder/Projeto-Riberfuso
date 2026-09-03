export type BrandMatte =
  | "plain"
  | "knock-black"
  | "white-lockup"
  | "trim-white"
  | "ink-lockup";

export type Brand = {
  id: string;
  name: string;
  /** Path under /public, or an official remote URL. */
  logoSrc: string;
  /**
   * How to seat the official file on a white plate.
   * plain: already works on white
   * knock-black: drop the black studio field and crop to the mark
   * white-lockup: knock black and seat white wordmarks as dark ink
   * trim-white: drop near-white padding and crop
   * ink-lockup: knock black and turn light type into dark ink
   */
  matte?: BrandMatte;
  /** Set true only after the official artwork is available. */
  assetReady: boolean;
  featured?: boolean;
  /** Heading used in the featured block when different from `name`. */
  title?: string;
  classification: string;
  description: string;
  highlight?: string;
};

export function brandAlt(brand: Brand): string {
  return `${brand.name}. ${brand.classification}`;
}

export const brands: Brand[] = [
  {
    id: "bosch",
    name: "Bosch",
    title: "Bosch Professional",
    logoSrc: "/brands/bosch.svg",
    matte: "plain",
    assetReady: true,
    featured: true,
    classification: "Uso profissional e industrial",
    description:
      "A Bosch Professional é a marca de destaque da Riberfuso Vila Nova na categoria de máquinas e ferramentas elétricas. Sua linha reúne furadeiras, parafusadeiras, marteletes, esmerilhadeiras, serras, lixadeiras, ferramentas a bateria, instrumentos de medição e acessórios para diferentes aplicações profissionais.",
    highlight:
      "Riberfuso e Bosch Professional: parceria para entregar desempenho e confiança.",
  },
  {
    id: "cortag",
    name: "Cortag",
    logoSrc: "/brands/cortag.svg",
    matte: "plain",
    assetReady: true,
    classification: "Uso profissional e também ocasional",
    description:
      "A Cortag é uma empresa brasileira especializada em ferramentas e soluções para colocação de pisos, revestimentos e porcelanatos. Trabalha com cortadores, sistemas de nivelamento, espaçadores, ventosas, desempenadeiras e outros acessórios para assentamento. Seu foco principal é o profissional da construção civil, embora vários produtos também atendam reformas domésticas.",
  },
  {
    id: "gedore",
    name: "Gedore",
    logoSrc: "/brands/gedore.svg",
    matte: "plain",
    assetReady: true,
    classification: "Uso profissional e industrial",
    description:
      "A Gedore é uma marca de origem alemã, com produção e presença consolidada no Brasil. Trabalha principalmente com ferramentas manuais, chaves, soquetes, alicates, torquímetros, ferramentas isoladas, soluções de torque e ferramentas especiais. É indicada para mecânica, manutenção, indústria, energia, oficinas e trabalhos que exigem precisão e utilização frequente.",
  },
  {
    id: "vonder",
    name: "Vonder",
    logoSrc: "https://www.vonder.com.br/loja/images/site/logo_da_vonder.png",
    matte: "plain",
    assetReady: true,
    classification:
      "Uso doméstico, semiprofissional e profissional, conforme o produto",
    description:
      "A Vonder possui uma linha diversificada de ferramentas manuais, acessórios, equipamentos para oficinas, itens para construção, jardinagem, organização e manutenção.",
  },
  {
    id: "mtx",
    name: "MTX",
    logoSrc: "/brands/mtx.png",
    matte: "knock-black",
    assetReady: true,
    classification: "Uso doméstico, semiprofissional e profissional moderado",
    description:
      "A MTX integra o portfólio da ToolsWorld e oferece ferramentas manuais, caixas, jogos de ferramentas, instrumentos de medição e acessórios para construção, manutenção e oficina. É uma opção de bom custo-benefício para serviços gerais, usuários domésticos, autônomos e profissionais que procuram ferramentas funcionais para demandas moderadas.",
  },
  {
    id: "fertak",
    name: "Fertak Tools",
    logoSrc: "/brands/fertak.png",
    matte: "ink-lockup",
    assetReady: true,
    classification: "Uso doméstico, hobby e profissional moderado",
    description:
      "A Fertak Tools trabalha principalmente com ferramentas manuais e acessórios para manutenção, construção, oficina e pequenos reparos. A marca se destaca pela variedade e pelo custo-benefício para as necessidades do cotidiano.",
  },
  {
    id: "stels",
    name: "Stels",
    logoSrc: "/brands/stels.png",
    matte: "knock-black",
    assetReady: true,
    classification: "Uso profissional e automotivo",
    description:
      "A Stels trabalha com ferramentas manuais, jogos de soquetes, caixas, organizadores e soluções voltadas principalmente à mecânica e à manutenção automotiva.",
  },
  {
    id: "gross",
    name: "Gross",
    logoSrc: "/brands/GROSS.webp",
    matte: "trim-white",
    assetReady: true,
    classification: "Uso profissional",
    description:
      "A Gross é apresentada pela ToolsWorld como sua linha premium de ferramentas. Oferece ferramentas manuais, instrumentos de corte, medição, organização e outros produtos destinados a profissionais que procuram maior desempenho, acabamento e resistência.",
  },
  {
    id: "rocast",
    name: "Rocast",
    logoSrc: "/brands/ROCAST.png",
    matte: "trim-white",
    assetReady: true,
    classification: "Uso profissional e industrial",
    description:
      "A Rocast é uma das marcas da Amatools e atua fortemente em ferramentas de corte, perfuração, usinagem e acabamento. Seu portfólio inclui brocas, machos, cossinetes, fresas, bits, bedames, serras, abrasivos e acessórios para oficinas.",
  },
  {
    id: "vip-industrial",
    name: "VIP Industrial",
    logoSrc: "/brands/VIP.webp",
    matte: "trim-white",
    assetReady: true,
    classification: "Uso profissional e industrial",
    description:
      "A VIP Industrial oferece ferramentas manuais e automotivas, soquetes manuais e de impacto, bits, pontas, torquímetros, brocas, abrasivos e acessórios para manutenção.",
  },
  {
    id: "graff",
    name: "Graff Vantage",
    logoSrc: "/brands/GRAFF.png",
    matte: "trim-white",
    assetReady: true,
    classification: "Uso geral e profissional moderado",
    description:
      "A Graff Vantage é uma marca própria da Amatools. Trabalha com ferramentas e acessórios para construção, manutenção, medição, corte e perfuração, incluindo níveis, desempenadeiras, grampeadores, brocas e outros itens de uso geral.",
  },
  {
    id: "tramontina",
    name: "Tramontina",
    logoSrc: "/brands/tramontina.svg",
    matte: "plain",
    assetReady: true,
    classification: "Uso doméstico, profissional e industrial, conforme a linha",
    description:
      "A Tramontina oferece ferramentas manuais, equipamentos para jardinagem e soluções de organização. A linha Tramontina PRO é voltada ao uso profissional, automotivo e industrial, enquanto outras linhas atendem manutenção, construção, jardinagem e trabalhos domésticos.",
  },
  {
    id: "robust",
    name: "Robust",
    logoSrc: "/brands/robust-on-light.svg",
    matte: "plain",
    assetReady: true,
    classification: "Uso doméstico, hobby e manutenção leve",
    description:
      "A Robust pertence ao Grupo Gedore e foi reposicionada no Brasil para atender principalmente o público hobbista. Trabalha com ferramentas destinadas a reparos, montagem, manutenção e atividades do cotidiano.",
  },
  {
    id: "irwin",
    name: "IRWIN",
    logoSrc: "/brands/irwin.png",
    matte: "knock-black",
    assetReady: true,
    classification: "Uso profissional",
    description:
      "A IRWIN fabrica ferramentas manuais e acessórios para ferramentas elétricas, com foco em profissionais da construção, marcenaria, instalação e manutenção. Trabalha com alicates Vise-Grip, grampos Quick-Grip, brocas, serrotes, trenas, abrasivos, ferramentas de corte e armazenamento.",
  },
  {
    id: "elite",
    name: "Elite Superflex",
    logoSrc: "/brands/elite.png",
    matte: "plain",
    assetReady: true,
    classification: "Uso profissional e industrial",
    description:
      "A Elite Superflex integra o Grupo Elite e iniciou sua trajetória no mercado de consumíveis para soldagem. Seu portfólio foi ampliado para abrasivos, ferramentas, fixadores e outros produtos utilizados em serralheria, construção, manutenção e indústria.",
  },
  {
    id: "noll",
    name: "Noll",
    logoSrc: "/brands/NOLL.png",
    matte: "trim-white",
    assetReady: true,
    classification: "Uso geral, profissional e semiprofissional",
    description:
      "A Noll é uma marca própria da Amatools com um catálogo diversificado. Trabalha com ferramentas manuais, instrumentos de medição, acessórios para compressores, ferramentas para construção e itens de organização.",
  },
  {
    id: "western",
    name: "Western",
    logoSrc: "/brands/western.png",
    matte: "trim-white",
    assetReady: true,
    classification: "Uso doméstico, hobby e profissional moderado",
    description:
      "A Western é uma marca do Grupo Etilux e trabalha com ferramentas manuais, instrumentos de medição, acessórios, cutelaria e produtos para construção, manutenção e atividades ao ar livre. Seu catálogo atende principalmente o consumidor doméstico, hobbista, pequenos reparos e aplicações profissionais moderadas.",
  },
  {
    id: "orbi-quimica",
    name: "Orbi Química",
    logoSrc: "/brands/orbi.png",
    matte: "ink-lockup",
    assetReady: true,
    classification: "Uso doméstico, profissional e industrial",
    description:
      "A Orbi Química é uma fabricante brasileira de produtos químicos para manutenção automotiva, indústria e construção civil. Trabalha com desengripantes, lubrificantes, silicones, selantes, adesivos, produtos automotivos e soluções para limpeza e manutenção.",
  },
  {
    id: "aeme",
    name: "AEME",
    logoSrc: "/brands/aeme.png",
    matte: "white-lockup",
    assetReady: true,
    classification: "Uso profissional e industrial",
    description:
      "A AEME é uma empresa brasileira fundada em 2000 e especializada em abrasivos e consumíveis para soldagem. Oferece discos abrasivos e diamantados, eletrodos, arames, varetas e acessórios para serralheria, soldagem e indústria.",
  },
  {
    id: "denver",
    name: "Denver Soldas",
    logoSrc: "/brands/denver-white.png",
    matte: "white-lockup",
    assetReady: true,
    classification: "Uso profissional e industrial",
    description:
      "A Denver Soldas é uma empresa brasileira fundada em 1968, especializada em tecnologia para soldagem e corte. Na Riberfuso, a marca deve ser apresentada principalmente por seus consumíveis, eletrodos, arames e soluções destinadas a serralherias, oficinas, manutenção e produção industrial.",
  },
  {
    id: "esab",
    name: "ESAB",
    logoSrc: "/brands/ESAB.png",
    matte: "trim-white",
    assetReady: true,
    classification: "Uso profissional e industrial",
    description:
      "A ESAB é uma marca global especializada em soldagem e corte. Na Riberfuso, deve ser apresentada por meio de tochas, eletrodos, arames, consumíveis e acessórios destinados principalmente a serralherias, manutenção pesada, fabricação metálica e indústria.",
  },
  {
    id: "starrett",
    name: "Starrett",
    logoSrc: "/brands/starrett.png",
    matte: "knock-black",
    assetReady: true,
    classification: "Uso profissional e industrial de precisão",
    description:
      "A Starrett é uma fabricante norte-americana fundada em 1880 e especializada em medição de precisão e ferramentas de corte. Trabalha com trenas, réguas, esquadros, paquímetros, micrômetros, relógios comparadores, serras-copo e lâminas de serra de fita.",
  },
  {
    id: "norton",
    name: "Norton",
    logoSrc: "/brands/norton.svg",
    matte: "plain",
    assetReady: true,
    classification: "Uso doméstico, profissional e industrial, conforme a linha",
    description:
      "A Norton é uma marca do grupo Saint-Gobain especializada em abrasivos. Oferece lixas, discos de corte e desbaste, discos diamantados, rebolos, escovas, mantas abrasivas e soluções para acabamento. Atende construção, serralheria, mecânica, indústria, setor automotivo, marcenaria e manutenção.",
  },
  {
    id: "tekbond",
    name: "Tekbond",
    logoSrc: "/brands/tekbond.webp",
    matte: "plain",
    assetReady: true,
    classification: "Uso doméstico, profissional e industrial",
    description:
      "A Tekbond trabalha com colas, adesivos instantâneos, epóxis, silicones, selantes, trava-roscas, fitas adesivas, tintas spray e produtos para manutenção. Suas soluções atendem desde pequenos reparos e artesanato até marcenaria, construção, oficinas e processos industriais.",
  },
];

export const featuredBrand = brands.find((brand) => brand.featured) ?? brands[0];
export const secondaryBrands = brands.filter((brand) => !brand.featured);
