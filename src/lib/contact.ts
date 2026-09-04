export type ContactPhone = {
  unit: "Matriz" | "Filial";
  kind: "phone" | "vendas";
  display: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
  handle: string;
};

export type ContactInfo = {
  phones: ContactPhone[];
  whatsapp: {
    display: string;
    href: string;
  };
  email: {
    display: string;
    href: string;
  };
  social: {
    instagram: SocialLink;
    facebook: SocialLink;
    youtube: SocialLink;
  };
  hoursNote: string;
};

export const contact: ContactInfo = {
  phones: [
    {
      unit: "Matriz",
      kind: "phone",
      display: "(35) 3722-2754",
      href: "tel:+553537222754",
    },
    {
      unit: "Matriz",
      kind: "phone",
      display: "(35) 3722-3650",
      href: "tel:+553537223650",
    },
    {
      unit: "Matriz",
      kind: "vendas",
      display: "(35) 99897-2282",
      href: "https://wa.me/5535998972282",
    },
    {
      unit: "Filial",
      kind: "phone",
      display: "(35) 3714-8383",
      href: "tel:+553537148383",
    },
    {
      unit: "Filial",
      kind: "vendas",
      display: "(35) 99903-2197",
      href: "https://wa.me/5535999032197",
    },
  ],
  whatsapp: {
    display: "(35) 99897-2282",
    href: "https://wa.me/5535998972282",
  },
  email: {
    display: "riberfusovilanova@hotmail.com",
    href: "mailto:riberfusovilanova@hotmail.com",
  },
  social: {
    instagram: {
      label: "Instagram",
      href: "https://www.instagram.com/riberfusovilanova/",
      handle: "@riberfusovilanova",
    },
    facebook: {
      label: "Facebook",
      href: "https://www.facebook.com/riberfuso.ltda/",
      handle: "riberfuso.ltda",
    },
    youtube: {
      label: "YouTube",
      href: "https://www.youtube.com/@manualdasferramentas",
      handle: "@manualdasferramentas",
    },
  },
  hoursNote:
    "Segunda a sexta, 8h às 18h · Sábado, 8h às 12h. Confirme o atendimento em feriados pelo WhatsApp.",
};

export function contactLandlines(info: ContactInfo) {
  return info.phones.filter((phone) => phone.kind === "phone");
}

export function contactWhatsapps(info: ContactInfo) {
  const listed = info.phones.filter((phone) => phone.kind === "vendas");
  return listed.length
    ? listed
    : [
        {
          unit: "Matriz" as const,
          kind: "vendas" as const,
          display: info.whatsapp.display,
          href: info.whatsapp.href,
        },
      ];
}
