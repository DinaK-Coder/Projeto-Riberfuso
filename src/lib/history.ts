export type HistoryChapter = {
  id: string;
  index: string;
  year: string;
  context: string;
};

export type AboutPhoto = {
  id: string;
  src: string;
  alt: string;
  era: string;
  title: string;
  caption: string;
  width: number;
  height: number;
};

export const aboutStory = {
  kicker: "Sobre nós · desde a década de 60",
  title: "Uma história feita para durar.",
  paragraphs: [
    "A Riberfuso foi fundada em Ribeirão Preto na década de 1960. Em 1991, a loja foi comprada em sociedade e trazida para Poços de Caldas — MG. Após 22 anos, a sociedade se encerrou e a marca passou a ser dirigida somente pelo Sr. Almires e família.",
    "A sede da Riberfuso Vila Nova fica na Rua Doutor Mário de Paiva, 465: amplo espaço e infraestrutura pensados para atendimento, armazenamento e logística dos produtos.",
    "Com profissionais capacitados em ferramentas e equipamentos de última geração, trabalhamos com peças especializadas para as mais variadas áreas — do uso pessoal ao profissional — alinhadas às normas técnicas da ABNT.",
  ],
  closing:
    "Hoje atendemos Poços de Caldas em duas unidades: Matriz na Vila Nova e Filial no Centro.",
} as const;

export const aboutPhotos: AboutPhoto[] = [
  {
    id: "anos-90",
    src: "/about/anos-90.jpg",
    alt: "Fachada histórica da Riberfuso em Ribeirão Preto, com fuscas estacionados na frente da loja",
    era: "Origem",
    title: "Ribeirão Preto",
    caption: "Registro da casa onde a Riberfuso nasceu, ainda em Ribeirão Preto.",
    width: 256,
    height: 169,
  },
  {
    id: "vila-nova",
    src: "/about/vila-nova.jpg",
    alt: "Fachada da Riberfuso Vila Nova na Rua Doutor Mário de Paiva, 465",
    era: "Matriz",
    title: "Rua Dr. Mário de Paiva",
    caption: "Sede na Vila Nova — espaço amplo para atendimento e logística.",
    width: 750,
    height: 813,
  },
  {
    id: "joao-pinheiro",
    src: "/about/joao-pinheiro.jpg",
    alt: "Fachada da Riberfuso na Avenida João Pinheiro, no Centro de Poços de Caldas",
    era: "Filial",
    title: "Av. João Pinheiro",
    caption: "Unidade no Centro — mesma marca, mesmo atendimento.",
    width: 1024,
    height: 659,
  },
];

export const historyChapters: HistoryChapter[] = [
  {
    id: "1960s",
    index: "01",
    year: "Década de 1960",
    context: "Origem da Riberfuso em Ribeirão Preto.",
  },
  {
    id: "1991",
    index: "02",
    year: "1991",
    context: "A marca é adquirida e chega a Poços de Caldas.",
  },
  {
    id: "hoje",
    index: "03",
    year: "Hoje",
    context:
      "Duas lojas especializadas em parafusos, ferramentas e soluções profissionais.",
  },
];
