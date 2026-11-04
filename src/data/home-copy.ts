export type Lang = "en" | "es";

export type HomeCopy = {
  nav: {
    howItWorks: string;
    example: string;
    integrations: string;
    vision: string;
    crm: string;
    bookDemo: string;
    switchTo: string;
    switchLabel: string;
  };
  hero: {
    eyebrow: string;
    accent: string;
    rest: string;
    sub: string;
    cta: string;
    secondary: string;
    audience: string;
    inboxLabel: string;
    ideas: readonly { kind: string; text: string }[];
    note: string;
  };
  how: { title: string; stepLabel: string; steps: readonly { title: string; text: string }[] };
  example: {
    title: string;
    lead: string;
    callLabel: string;
    quote: string;
    tag: string;
    draftLabel: string;
    draftTitle: string;
    draftText: string;
    note: string;
  };
  integrations: { title: string; lead: string; groups: readonly { title: string; tools: readonly string[] }[] };
  points: { title: string; items: readonly { title: string; text: string }[] };
  faq: { title: string; items: readonly { q: string; a: string }[] };
  vision: {
    title: string;
    lead: string;
    today: string;
    todayTitle: string;
    soon: string;
    loop: readonly { title: string; text: string }[];
    crmPrefix: string;
    crmLink: string;
  };
  cta: { title: string; lead: string; label: string };
};

const en: HomeCopy = {
  nav: {
    howItWorks: "How it works",
    example: "Example",
    integrations: "Integrations",
    vision: "Vision",
    crm: "For sales teams",
    bookDemo: "Book a demo",
    switchTo: "Español",
    switchLabel: "Ver esta página en español",
  },
  hero: {
    eyebrow: "Your conversations already contain content",
    accent: "Give a voice",
    rest: "to your ideas and your experience.",
    sub: "GINGGA connects to your meeting notes, reading and voice notes, finds the ideas worth sharing and turns them into LinkedIn drafts in your own voice.",
    cta: "Book a demo",
    secondary: "See an example",
    audience: "For professionals and founders who build a business around their expertise.",
    inboxLabel: "Ideas found this week",
    ideas: [
      { kind: "Client question", text: "Before buying another tool, we need to be clear on the problem." },
      { kind: "Shared learning", text: "The first AI decision isn't which tool to buy." },
      { kind: "Idea out loud", text: "Why I stopped writing a new topic list every Monday." },
    ],
    note: "Illustrative example. No real data is processed.",
  },
  how: {
    title: "You don’t have to invent a topic every week.",
    stepLabel: "Step",
    steps: [
      {
        title: "Connect your sources",
        text: "Link the tools where your conversations, notes and reading already live.",
      },
      {
        title: "Ideas appear",
        text: "GINGGA spots the questions, lessons and perspectives that could become content.",
      },
      {
        title: "Add your voice",
        text: "Turn an idea into a LinkedIn draft. Edit it, then publish when you're happy.",
      },
    ],
  },
  example: {
    title: "Said in a meeting. Ready as your next post.",
    lead: "A client question becomes the starting point for a draft that sounds like you.",
    callLabel: "Client call · Fathom",
    quote:
      "Three clients asked me this week which AI tool to buy. None of them had defined the task they wanted to improve.",
    tag: "Idea detected: a perspective worth sharing",
    draftLabel: "LinkedIn draft · in your voice",
    draftTitle: "The first decision about AI shouldn’t be which tool to buy.",
    draftText:
      "This week I got the same question three times. My answer started with another one: what task do you want to improve? Before comparing tools, describe the problem. That’s where a useful decision starts.",
    note: "Illustrative example. No real data is processed.",
  },
  integrations: {
    title: "The ideas are already in your day.",
    lead: "GINGGA connects the tools where you keep conversations, notes and reading, and finds starting points you would otherwise forget: an explanation you keep repeating, a good question, something you just learned.",
    groups: [
      {
        title: "Meetings and conversation notes",
        tools: ["Fathom", "Fireflies", "Granola", "Microsoft Teams", "Read AI"],
      },
      { title: "Reading and dictated ideas", tools: ["Readwise", "Wispr Flow"] },
    ],
  },
  points: {
    title: "One voice of your own. Different places to start.",
    items: [
      {
        title: "Explore an offer",
        text: "Start from the problem you want to solve. Share your perspective and open conversations with the people who live it. Their answers help you shape a proposal you can then test.",
      },
      {
        title: "Show your expertise",
        text: "Turn what you already know into a steady, recognisable presence, without starting each post from a blank page.",
      },
      {
        title: "Give your business a voice",
        text: "Keep the way your business talks consistent, drawing on the real questions your customers ask.",
      },
    ],
  },
  faq: {
    title: "Before you start",
    items: [
      {
        q: "Do I need a business already running?",
        a: "No. You can start from your professional experience while you explore a business of your own.",
      },
      {
        q: "What can I do at the start?",
        a: "Create LinkedIn content from your conversations, notes and reading. WhatsApp, Instagram and managed conversations are next steps, not part of today's product.",
      },
      {
        q: "Does publishing content validate my idea?",
        a: "Publishing can open conversations. To validate an offer, you still need to check that it solves a need someone is willing to pay for.",
      },
    ],
  },
  vision: {
    title: "Your voice is the start. The vision goes further.",
    lead: "We want to connect content, conversations and learning in one system. Instagram, WhatsApp and managed conversations are part of that direction.",
    today: "Available today",
    todayTitle: "LinkedIn content from your own conversations.",
    soon: "Where we’re heading",
    loop: [
      { title: "Define your voice", text: "Who you are, what you know and who you want to help." },
      { title: "Create and share", text: "Turn your ideas into content that represents you." },
      { title: "Talk and connect", text: "Hear the questions, needs and objections." },
      { title: "Learn and adjust", text: "Bring what you learn into your next message and offer." },
    ],
    crmPrefix: "Already handling leads and enquiries?",
    crmLink: "See the GINGGA CRM solution",
  },
  cta: {
    title: "Your experience deserves more than your notes app.",
    lead: "Connect your sources and find content ideas in what you already talk about, read and learn.",
    label: "Book a demo",
  },
};

const es: HomeCopy = {
  nav: {
    howItWorks: "Cómo funciona",
    example: "Ejemplo",
    integrations: "Integraciones",
    vision: "Visión",
    crm: "Para equipos de ventas",
    bookDemo: "Reservar una demo",
    switchTo: "English",
    switchLabel: "View this page in English",
  },
  hero: {
    eyebrow: "Tus conversaciones ya tienen contenido",
    accent: "Dale una voz",
    rest: "a tus ideas y tu experiencia.",
    sub: "GINGGA se conecta con tus notas de reuniones, lecturas y notas de voz, encuentra las ideas que vale la pena compartir y las convierte en borradores para LinkedIn con tu propia voz.",
    cta: "Reservar una demo",
    secondary: "Ver un ejemplo",
    audience: "Para profesionales y fundadores que construyen un negocio alrededor de su experiencia.",
    inboxLabel: "Ideas encontradas esta semana",
    ideas: [
      { kind: "Pregunta de un cliente", text: "Antes de comprar otra herramienta, necesitamos aclarar el problema." },
      { kind: "Aprendizaje compartido", text: "La primera decisión sobre IA no es qué herramienta comprar." },
      { kind: "Idea en voz alta", text: "Por qué dejé de inventar una lista de temas cada lunes." },
    ],
    note: "Ejemplo ilustrativo. No se procesan datos reales.",
  },
  how: {
    title: "No necesitas inventar un tema cada semana.",
    stepLabel: "Paso",
    steps: [
      {
        title: "Conecta tus fuentes",
        text: "Enlaza las herramientas donde ya guardas tus conversaciones, notas y lecturas.",
      },
      {
        title: "Las ideas aparecen",
        text: "GINGGA identifica las preguntas, aprendizajes y perspectivas que pueden convertirse en contenido.",
      },
      {
        title: "Ponle tu voz",
        text: "Convierte una idea en un borrador para LinkedIn. Ajústalo y publícalo cuando estés conforme.",
      },
    ],
  },
  example: {
    title: "Lo dijiste en una reunión. Puede ser tu próximo post.",
    lead: "Una pregunta de un cliente se convierte en el punto de partida de un borrador que suena como tú.",
    callLabel: "Conversación con un cliente · Fathom",
    quote:
      "Tres clientes me preguntaron esta semana qué herramienta de IA comprar. Ninguno había definido qué tarea quería mejorar.",
    tag: "Idea detectada: una perspectiva que merece compartirse",
    draftLabel: "Borrador para LinkedIn · con tu voz",
    draftTitle: "La primera decisión sobre IA no debería ser qué herramienta comprar.",
    draftText:
      "Esta semana recibí la misma pregunta tres veces. Mi respuesta empezó con otra: ¿qué tarea quieres mejorar? Antes de comparar herramientas, describe el problema. Ahí empieza una decisión útil.",
    note: "Ejemplo ilustrativo. No se procesan datos reales.",
  },
  integrations: {
    title: "Las ideas ya están en tu día.",
    lead: "GINGGA se conecta con las herramientas donde guardas conversaciones, notas y lecturas, y encuentra puntos de partida que de otro modo olvidarías: una explicación que repites, una buena pregunta, algo que acabas de aprender.",
    groups: [
      {
        title: "Reuniones y notas de conversaciones",
        tools: ["Fathom", "Fireflies", "Granola", "Microsoft Teams", "Read AI"],
      },
      { title: "Lecturas e ideas dictadas", tools: ["Readwise", "Wispr Flow"] },
    ],
  },
  points: {
    title: "Una voz propia. Diferentes puntos de partida.",
    items: [
      {
        title: "Explorar una oferta",
        text: "Empieza por el problema que quieres resolver. Comparte tu perspectiva y abre conversaciones con quienes viven ese problema. Sus respuestas te ayudan a formular una propuesta que después podrás probar.",
      },
      {
        title: "Mostrar mi experiencia",
        text: "Convierte lo que ya sabes en una presencia constante y reconocible, sin empezar cada publicación desde cero.",
      },
      {
        title: "Dar voz a mi negocio",
        text: "Mantén coherente la manera en que habla tu negocio, apoyándote en las preguntas reales de tus clientes.",
      },
    ],
  },
  faq: {
    title: "Antes de empezar",
    items: [
      {
        q: "¿Necesito tener un negocio en marcha?",
        a: "No. Puedes empezar desde tu experiencia profesional mientras exploras una actividad propia.",
      },
      {
        q: "¿Qué puedo hacer inicialmente?",
        a: "Crear contenido para LinkedIn a partir de tus conversaciones, notas y lecturas. WhatsApp, Instagram y la gestión integrada de conversaciones son próximos pasos, no forman parte del producto de hoy.",
      },
      {
        q: "¿Publicar contenido valida mi idea?",
        a: "Publicar puede abrir conversaciones. Para validar una oferta necesitas comprobar si resuelve una necesidad por la que alguien está dispuesto a pagar.",
      },
    ],
  },
  vision: {
    title: "Tu voz es el comienzo. La visión va más allá.",
    lead: "Queremos conectar contenido, conversaciones y aprendizaje en un mismo sistema. Instagram, WhatsApp y la gestión integrada de conversaciones forman parte de esa dirección.",
    today: "Disponible hoy",
    todayTitle: "Contenido para LinkedIn a partir de tus propias conversaciones.",
    soon: "Hacia dónde vamos",
    loop: [
      { title: "Define tu voz", text: "Quién eres, qué sabes y a quién quieres ayudar." },
      { title: "Crea y comparte", text: "Convierte tus ideas en contenido que te represente." },
      { title: "Conversa y conecta", text: "Escucha preguntas, necesidades y objeciones." },
      { title: "Aprende y ajusta", text: "Lleva lo aprendido a tu próximo mensaje y propuesta." },
    ],
    crmPrefix: "¿Ya gestionas leads y consultas?",
    crmLink: "Conoce la solución CRM de GINGGA (en inglés)",
  },
  cta: {
    title: "Tu experiencia merece salir de tus notas.",
    lead: "Conecta tus fuentes y encuentra ideas de contenido en lo que ya hablas, lees y aprendes.",
    label: "Reservar una demo",
  },
};

export const homeCopy: Record<Lang, HomeCopy> = { en, es };
