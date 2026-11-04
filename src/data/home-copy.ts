export type Lang = "en" | "es";

export type HomeCopy = {
  nav: {
    howItWorks: string;
    pricing: string;
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
  integrations: {
    title: string;
    lead: string;
    note: string;
    groups: readonly { title: string; tools: readonly string[] }[];
  };
  points: { title: string; items: readonly { title: string; text: string }[] };
  pricing: {
    title: string;
    lead: string;
    perMonth: string;
    popular: string;
    tiers: readonly {
      name: string;
      tag: string;
      tagline: string;
      price: string;
      cta: string;
      includesTitle: string;
      features: readonly string[];
      featured?: boolean;
    }[];
    compare: string;
  };
  faq: { title: string; items: readonly { q: string; a: string }[] };
  vision: {
    title: string;
    lead: string;
    todayLabel: string;
    today: readonly { title: string; text: string }[];
    nextLabel: string;
    next: readonly { title: string; text: string; crm?: boolean }[];
    crmLink: string;
  };
  cta: { title: string; lead: string; label: string };
};

const en: HomeCopy = {
  nav: {
    howItWorks: "How it works",
    pricing: "Pricing",
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
        text: "Turn an idea into a LinkedIn draft. Edit it, then publish or schedule it when you're happy.",
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
    note: "Logos belong to their respective owners and are shown only to identify the tools you can connect.",
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
  pricing: {
    title: "Choose how often you want to show up.",
    lead: "One flat monthly fee. Your agents work for you all month, so you stay visible even in your busiest weeks.",
    perMonth: "/ month",
    popular: "Most popular",
    tiers: [
      {
        name: "Presence",
        tag: "To get noticed",
        tagline: "A steady frequency: 3 posts a week.",
        price: "$29",
        cta: "Start with Presence",
        includesTitle: "Includes:",
        features: [
          "3 posts a week, in your voice",
          "A voice you set up once and that keeps learning from what you feed it",
          "One connected source (meetings, notes, reading or dictation) turned into post ideas",
          "Idea bank, editorial calendar and LinkedIn scheduling",
        ],
      },
      {
        name: "Rhythm",
        tag: "To become the go-to voice",
        tagline: "Daily presence. A personal brand, done properly.",
        price: "$79",
        cta: "Start with Rhythm",
        includesTitle: "Everything in Presence, plus:",
        features: [
          "A post every day",
          "All your sources connected, not just one: meetings, notes, reading and dictation",
          "Priority support",
        ],
        featured: true,
      },
      {
        name: "Authority",
        tag: "To lead the conversation",
        tagline: "Your voice on every channel, first in line.",
        price: "$148",
        cta: "Start with Authority",
        includesTitle: "Everything in Rhythm, plus:",
        features: [
          "Early access to X and Instagram as they launch",
          "Early access to agents on your WhatsApp and the GINGGA CRM",
          "A setup session to shape your voice with our team",
        ],
      },
    ],
    compare: "For context: a content team costs $800+ a month. Here, it starts at $29.",
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
        a: "Turn your conversations, notes and reading into post ideas, set up a voice that learns, and write, share or schedule on LinkedIn. X, Instagram, WhatsApp agents and the CRM come next.",
      },
      {
        q: "Does publishing content validate my idea?",
        a: "Publishing can open conversations. To validate an offer, you still need to check that it solves a need someone is willing to pay for.",
      },
    ],
  },
  vision: {
    title: "Your voice is the start. Here is what comes next.",
    lead: "Today GINGGA takes you from a conversation to a scheduled LinkedIn post. Next, it brings your other channels and your sales conversations into the same system.",
    todayLabel: "Available today",
    today: [
      {
        title: "Ideas from your conversations",
        text: "Agents pull in your meetings, notes and reading and turn them into ideas for posts.",
      },
      {
        title: "A voice that learns",
        text: "Set up your voice. The more you feed it, the better it sounds like you.",
      },
      { title: "Create", text: "Write new posts from your ideas, in your own voice." },
      { title: "Share and schedule", text: "Publish on LinkedIn straight away or schedule it for later." },
    ],
    nextLabel: "What comes next",
    next: [
      { title: "More networks", text: "Bring your voice and ideas to X and Instagram." },
      { title: "Agents on your WhatsApp", text: "Agents that talk in your WhatsApp, on your behalf." },
      {
        title: "Your CRM",
        text: "Keep the conversations that follow in one place, so no lead or enquiry gets lost.",
        crm: true,
      },
    ],
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
    pricing: "Precios",
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
        text: "Convierte una idea en un borrador para LinkedIn. Ajústalo y publícalo o prográmalo cuando estés conforme.",
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
    note: "Los logos pertenecen a sus respectivos dueños y se muestran solo para identificar las herramientas que puedes conectar.",
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
  pricing: {
    title: "Elige con qué frecuencia quieres aparecer.",
    lead: "Una tarifa fija al mes. Tus agentes trabajan para ti todo el mes, así sigues visible incluso en tus semanas más ocupadas.",
    perMonth: "/ mes",
    popular: "Más elegido",
    tiers: [
      {
        name: "Presencia",
        tag: "Para que te noten",
        tagline: "Una frecuencia constante: 3 publicaciones por semana.",
        price: "$29",
        cta: "Empezar con Presencia",
        includesTitle: "Incluye:",
        features: [
          "3 publicaciones por semana, con tu voz",
          "Una voz que configuras una vez y sigue aprendiendo de lo que le aportas",
          "Una fuente conectada (reuniones, notas, lecturas o dictados) convertida en ideas para publicar",
          "Banco de ideas, calendario editorial y programación en LinkedIn",
        ],
      },
      {
        name: "Ritmo",
        tag: "Para ser referente",
        tagline: "Presencia diaria. Tu marca personal, en serio.",
        price: "$79",
        cta: "Empezar con Ritmo",
        includesTitle: "Todo lo de Presencia, más:",
        features: [
          "Una publicación cada día",
          "Todas tus fuentes conectadas, no solo una: reuniones, notas, lecturas y dictados",
          "Atención prioritaria",
        ],
        featured: true,
      },
      {
        name: "Autoridad",
        tag: "Para liderar la conversación",
        tagline: "Tu voz en todos los canales, primero en la fila.",
        price: "$148",
        cta: "Empezar con Autoridad",
        includesTitle: "Todo lo de Ritmo, más:",
        features: [
          "Acceso anticipado a X e Instagram cuando se lancen",
          "Acceso anticipado a los agentes en tu WhatsApp y al CRM de GINGGA",
          "Una sesión de configuración para afinar tu voz con nuestro equipo",
        ],
      },
    ],
    compare: "Como referencia: un equipo de contenido cuesta $800+ al mes. Aquí, empieza en $29.",
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
        a: "Convertir tus conversaciones, notas y lecturas en ideas para publicar, configurar una voz que aprende, y escribir, compartir o programar en LinkedIn. X, Instagram, agentes en WhatsApp y el CRM vienen después.",
      },
      {
        q: "¿Publicar contenido valida mi idea?",
        a: "Publicar puede abrir conversaciones. Para validar una oferta necesitas comprobar si resuelve una necesidad por la que alguien está dispuesto a pagar.",
      },
    ],
  },
  vision: {
    title: "Tu voz es el comienzo. Esto es lo que viene.",
    lead: "Hoy GINGGA te lleva de una conversación a una publicación programada en LinkedIn. Después, suma tus otros canales y tus conversaciones de ventas en el mismo sistema.",
    todayLabel: "Disponible hoy",
    today: [
      {
        title: "Ideas desde tus conversaciones",
        text: "Los agentes traen tus reuniones, notas y lecturas y las convierten en ideas para publicar.",
      },
      {
        title: "Una voz que aprende",
        text: "Configura tu voz. Cuanto más la nutres, más suena como tú.",
      },
      { title: "Crea", text: "Escribe nuevas publicaciones a partir de tus ideas, con tu propia voz." },
      { title: "Comparte y programa", text: "Publica en LinkedIn al momento o prográmalo para después." },
    ],
    nextLabel: "Lo que sigue",
    next: [
      { title: "Más redes", text: "Lleva tu voz y tus ideas a X e Instagram." },
      { title: "Agentes en tu WhatsApp", text: "Agentes que hablan en tu WhatsApp, en tu nombre." },
      {
        title: "Tu CRM",
        text: "Mantén en un solo lugar las conversaciones que siguen, para que no se pierda ningún lead ni consulta.",
        crm: true,
      },
    ],
    crmLink: "Conoce la solución CRM de GINGGA (en inglés)",
  },
  cta: {
    title: "Tu experiencia merece salir de tus notas.",
    lead: "Conecta tus fuentes y encuentra ideas de contenido en lo que ya hablas, lees y aprendes.",
    label: "Reservar una demo",
  },
};

export const homeCopy: Record<Lang, HomeCopy> = { en, es };
