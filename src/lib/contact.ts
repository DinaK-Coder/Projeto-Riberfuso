export type ContactPhone = {
  label: string;
  display: string;
  href: string;
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
    instagram: {
      label: string;
      href: string;
      handle: string;
    };
    youtube: {
      label: string;
      href: string;
      handle: string;
    };
  };
  hoursNote: string;
};

export const contact: ContactInfo = {
  phones: [
    { label: "Telefone", display: "(35) 3722-2754", href: "tel:+553537222754" },
    { label: "Telefone", display: "(35) 3722-3650", href: "tel:+553537223650" },
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
    youtube: {
      label: "YouTube",
      href: "https://www.youtube.com/@manualdasferramentas",
      handle: "@manualdasferramentas",
    },
  },
  hoursNote:
    "Horário de funcionamento sob consulta pelo WhatsApp ou telefone.",
};
