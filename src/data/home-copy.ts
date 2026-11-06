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
    popular: string;
    tiers: readonly {
      name: string;
      tag: string;
      tagline: string;
      price: string;
      unit: string;
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
  agencies: { title: string; text: string; cta: string; topic: string };
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
    eyebrow: "Your business already has something to say",
    accent: "Give your business",
    rest: "a face people trust.",
    sub: "GINGGA finds ideas in your team's meetings, notes and reading and turns them into LinkedIn posts for your personal profiles, in each person's own voice. Customers get to know and trust the people behind your business.",
    cta: "Book a demo",
    secondary: "See an example",
    audience: "For small businesses that are already up and running.",
    inboxLabel: "Ideas found this week",
    ideas: [
      { kind: "Client question", text: "Why do you quote by project and not by the hour?" },
      { kind: "Team learning", text: "The three questions that decide whether a client says yes." },
      { kind: "Idea out loud", text: "What we'd tell anyone hiring in our industry for the first time." },
    ],
    note: "Illustrative example. No real data is processed.",
  },
  how: {
    title: "Stop hunting for topics. Your business already has them.",
    stepLabel: "Step",
    steps: [
      {
        title: "Connect your team's sources",
        text: "Link the tools where your team keeps meetings, notes and reading.",
      },
      {
        title: "Ideas appear",
        text: "GINGGA spots the client questions, decisions and lessons that could become posts.",
      },
      {
        title: "Each person adds their voice",
        text: "Turn an idea into a draft in that person's voice. Review it, then publish it on their profile or schedule it.",
      },
    ],
  },
  example: {
    title: "Said in a client meeting. Ready as your next post.",
    lead: "A real question from a customer becomes a post that shows how you think and work.",
    callLabel: "Client call · Fathom",
    quote:
      "A client asked why our quote was higher than another one. Most of the difference was in what we check before we start.",
    tag: "Idea detected: your team's judgement, ready to share",
    draftLabel: "LinkedIn draft · on the owner's profile",
    draftTitle: "A cheaper quote isn't always a cheaper job.",
    draftText:
      "This week a client asked why our quote was higher than another one. The difference wasn't the price of the work. It was everything we check before we start. If you're comparing quotes, ask what's included before you ask what it costs.",
    note: "Illustrative example. No real data is processed.",
  },
  integrations: {
    title: "Your team already knows what to say.",
    lead: "GINGGA connects the tools where your team keeps meetings, notes and reading, and finds the client questions, decisions and lessons worth sharing.",
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
    title: "What showing up can do for your business.",
    items: [
      {
        title: "Build trust",
        text: "Customers get to know the people behind the work before they ever talk to you.",
      },
      {
        title: "Open doors",
        text: "Consistent posts give prospects, partners and candidates a reason to reach out.",
      },
      {
        title: "Sell more",
        text: "Stay present with the people who may buy, so your name is the first one they remember.",
      },
    ],
  },
  pricing: {
    title: "Pick the plan that fits your team.",
    lead: "Every person gets their own voice and their own profile. You pay per person, and the price drops as your team grows.",
    popular: "Most popular",
    tiers: [
      {
        name: "Presence",
        tag: "For one person",
        tagline: "Your own voice on LinkedIn, 3 posts a week.",
        price: "$69",
        unit: "/ month",
        cta: "Start with Presence",
        includesTitle: "Includes:",
        features: [
          "3 posts a week on your personal profile, in your voice",
          "A voice you set up once and that keeps learning from what you feed it",
          "One connected source (meetings, notes, reading or dictation) turned into post ideas",
          "Idea bank, editorial calendar and LinkedIn scheduling",
        ],
      },
      {
        name: "Rhythm",
        tag: "For teams of 2 to 5",
        tagline: "Your team's voices, together, with numbers to prove it.",
        price: "$59",
        unit: "/ person / month",
        cta: "Start with Rhythm",
        includesTitle: "Everything in Presence, for each person, plus:",
        features: [
          "5 posts a week per person",
          "All your sources connected, not just one: meetings, notes, reading and dictation",
          "A stats panel for your business to see how your team's content performs",
          "Priority support",
        ],
        featured: true,
      },
      {
        name: "Authority",
        tag: "For teams of 6 or more",
        tagline: "Your whole team visible, at a lower price per person.",
        price: "$49",
        unit: "/ person / month",
        cta: "Start with Authority",
        includesTitle: "Everything in Rhythm, plus:",
        features: [
          "Early access to X and Instagram as they launch",
          "Early access to agents on your WhatsApp and the GINGGA CRM",
          "A setup session to shape your team's voices with our team",
        ],
      },
    ],
    compare: "For context: a content team costs $800+ a month. Here, one person starts at $69.",
  },
  faq: {
    title: "Before you start",
    items: [
      {
        q: "What kind of business is it for?",
        a: "Small businesses that already have an offer and customers, and want the people behind them to be visible on LinkedIn.",
      },
      {
        q: "Where are the posts published?",
        a: "On each person's own LinkedIn profile, in their voice. Every draft is reviewed by that person before it goes out.",
      },
      {
        q: "What can I do at the start?",
        a: "Turn your team's conversations, notes and reading into post ideas, set up a voice for each person that keeps learning, and write, share or schedule on LinkedIn. X, Instagram, agents on your WhatsApp and the CRM come next.",
      },
    ],
  },
  vision: {
    title: "Your voice is the start. Here is what comes next.",
    lead: "Today GINGGA takes your team from a conversation to a scheduled LinkedIn post. Next, it brings your other channels and your sales conversations into the same system.",
    todayLabel: "Available today",
    today: [
      {
        title: "Ideas from your team's conversations",
        text: "Agents pull in your meetings, notes and reading and turn them into ideas for posts.",
      },
      {
        title: "A voice for each person",
        text: "Set up each person's voice. The more they feed it, the better it sounds like them.",
      },
      { title: "Create", text: "Write new posts from your ideas, in each person's own voice." },
      { title: "Share and schedule", text: "Publish on LinkedIn straight away or schedule it for later." },
    ],
    nextLabel: "What comes next",
    next: [
      { title: "More networks", text: "Bring your team's voices and ideas to X and Instagram." },
      { title: "Agents on your WhatsApp", text: "Agents that talk in your WhatsApp, on your behalf." },
      {
        title: "Your CRM",
        text: "The doors your posts open land here, so no lead or enquiry gets lost.",
        crm: true,
      },
    ],
    crmLink: "See the GINGGA CRM solution",
  },
  agencies: {
    title: "Are you an agency?",
    text: "Distribute GINGGA to your clients and give their teams a voice. Let's talk about working together.",
    cta: "Talk about partnering",
    topic: "Agency partnership",
  },
  cta: {
    title: "When your people show up, your business gets noticed.",
    lead: "Connect your team's sources and find posts in what you already say in meetings, notes and reading.",
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
    eyebrow: "Tu negocio ya tiene algo que contar",
    accent: "Dale a tu negocio",
    rest: "un rostro en el que confiar.",
    sub: "GINGGA encuentra ideas en las reuniones, notas y lecturas de tu equipo y las convierte en publicaciones para LinkedIn en tus perfiles personales, con la voz de cada persona. Tus clientes conocen y confían en las personas detrás de tu negocio.",
    cta: "Reservar una demo",
    secondary: "Ver un ejemplo",
    audience: "Para pequeños negocios que ya están en marcha.",
    inboxLabel: "Ideas encontradas esta semana",
    ideas: [
      { kind: "Pregunta de un cliente", text: "¿Por qué cotizan por proyecto y no por hora?" },
      { kind: "Aprendizaje del equipo", text: "Las tres preguntas que deciden si un cliente dice que sí." },
      { kind: "Idea en voz alta", text: "Lo que le diríamos a quien contrata por primera vez en nuestro sector." },
    ],
    note: "Ejemplo ilustrativo. No se procesan datos reales.",
  },
  how: {
    title: "Deja de buscar temas. Tu negocio ya los tiene.",
    stepLabel: "Paso",
    steps: [
      {
        title: "Conecta las fuentes de tu equipo",
        text: "Enlaza las herramientas donde tu equipo guarda reuniones, notas y lecturas.",
      },
      {
        title: "Las ideas aparecen",
        text: "GINGGA identifica las preguntas de clientes, decisiones y aprendizajes que pueden convertirse en publicaciones.",
      },
      {
        title: "Cada persona pone su voz",
        text: "Convierte una idea en un borrador con la voz de esa persona. Revísalo y publícalo en su perfil o prográmalo.",
      },
    ],
  },
  example: {
    title: "Lo dijiste en una reunión con un cliente. Puede ser tu próxima publicación.",
    lead: "Una pregunta real de un cliente se convierte en una publicación que muestra cómo piensas y trabajas.",
    callLabel: "Llamada con un cliente · Fathom",
    quote:
      "Un cliente nos preguntó por qué nuestra cotización era más alta que otra. Buena parte de la diferencia estaba en lo que revisamos antes de empezar.",
    tag: "Idea detectada: el criterio de tu equipo, listo para compartir",
    draftLabel: "Borrador para LinkedIn · en el perfil del dueño",
    draftTitle: "Una cotización más barata no siempre es un trabajo más barato.",
    draftText:
      "Esta semana un cliente nos preguntó por qué nuestra cotización era más alta que otra. La diferencia no estaba en el precio del trabajo, sino en todo lo que revisamos antes de empezar. Si estás comparando cotizaciones, pregunta qué incluye antes de preguntar cuánto cuesta.",
    note: "Ejemplo ilustrativo. No se procesan datos reales.",
  },
  integrations: {
    title: "Tu equipo ya sabe qué decir.",
    lead: "GINGGA se conecta con las herramientas donde tu equipo guarda reuniones, notas y lecturas, y encuentra las preguntas de clientes, decisiones y aprendizajes que vale la pena compartir.",
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
    title: "Lo que puede lograr tu negocio al mostrarse.",
    items: [
      {
        title: "Genera confianza",
        text: "Tus clientes conocen a las personas detrás del trabajo antes de hablar contigo.",
      },
      {
        title: "Abre puertas",
        text: "Publicar con constancia da a prospectos, aliados y candidatos una razón para escribirte.",
      },
      {
        title: "Vende más",
        text: "Mantente presente ante quienes pueden comprar, para que tu nombre sea el primero que recuerden.",
      },
    ],
  },
  pricing: {
    title: "Elige el plan que va con tu equipo.",
    lead: "Cada persona tiene su propia voz y su propio perfil. Pagas por persona, y el precio baja a medida que crece tu equipo.",
    popular: "Más elegido",
    tiers: [
      {
        name: "Presencia",
        tag: "Para una persona",
        tagline: "Tu propia voz en LinkedIn, 3 publicaciones por semana.",
        price: "$69",
        unit: "/ mes",
        cta: "Empezar con Presencia",
        includesTitle: "Incluye:",
        features: [
          "3 publicaciones por semana en tu perfil personal, con tu voz",
          "Una voz que configuras una vez y sigue aprendiendo de lo que le aportas",
          "Una fuente conectada (reuniones, notas, lecturas o dictados) convertida en ideas para publicar",
          "Banco de ideas, calendario editorial y programación en LinkedIn",
        ],
      },
      {
        name: "Ritmo",
        tag: "Para equipos de 2 a 5 personas",
        tagline: "Las voces de tu equipo, juntas, y con números que lo demuestran.",
        price: "$59",
        unit: "/ persona / mes",
        cta: "Empezar con Ritmo",
        includesTitle: "Todo lo de Presencia, para cada persona, más:",
        features: [
          "5 publicaciones por semana por persona",
          "Todas tus fuentes conectadas, no solo una: reuniones, notas, lecturas y dictados",
          "Un panel de estadísticas para tu negocio, para ver cómo rinde el contenido de tu equipo",
          "Atención prioritaria",
        ],
        featured: true,
      },
      {
        name: "Autoridad",
        tag: "Para equipos de 6 o más personas",
        tagline: "Todo tu equipo visible, a un precio menor por persona.",
        price: "$49",
        unit: "/ persona / mes",
        cta: "Empezar con Autoridad",
        includesTitle: "Todo lo de Ritmo, más:",
        features: [
          "Acceso anticipado a X e Instagram cuando se lancen",
          "Acceso anticipado a los agentes en tu WhatsApp y al CRM de GINGGA",
          "Una sesión de configuración para afinar las voces de tu equipo con nuestro equipo",
        ],
      },
    ],
    compare: "Como referencia: un equipo de contenido cuesta $800+ al mes. Aquí, una persona empieza en $69.",
  },
  faq: {
    title: "Antes de empezar",
    items: [
      {
        q: "¿Para qué tipo de negocio está pensado?",
        a: "Para pequeños negocios que ya tienen una oferta y clientes, y quieren que las personas detrás de ellos se vean en LinkedIn.",
      },
      {
        q: "¿Dónde se publica el contenido?",
        a: "En el perfil personal de LinkedIn de cada persona, con su voz. Cada borrador lo revisa esa persona antes de salir.",
      },
      {
        q: "¿Qué puedo hacer inicialmente?",
        a: "Convertir las conversaciones, notas y lecturas de tu equipo en ideas para publicar, configurar una voz para cada persona que sigue aprendiendo, y escribir, compartir o programar en LinkedIn. X, Instagram, agentes en tu WhatsApp y el CRM vienen después.",
      },
    ],
  },
  vision: {
    title: "Tu voz es el comienzo. Esto es lo que viene.",
    lead: "Hoy GINGGA lleva a tu equipo de una conversación a una publicación programada en LinkedIn. Después, suma tus otros canales y tus conversaciones de ventas en el mismo sistema.",
    todayLabel: "Disponible hoy",
    today: [
      {
        title: "Ideas desde las conversaciones de tu equipo",
        text: "Los agentes traen tus reuniones, notas y lecturas y las convierten en ideas para publicar.",
      },
      {
        title: "Una voz para cada persona",
        text: "Configura la voz de cada persona. Cuanto más la nutre, más suena como ella.",
      },
      { title: "Crea", text: "Escribe nuevas publicaciones a partir de tus ideas, con la voz de cada persona." },
      { title: "Comparte y programa", text: "Publica en LinkedIn al momento o prográmalo para después." },
    ],
    nextLabel: "Lo que sigue",
    next: [
      { title: "Más redes", text: "Lleva las voces y las ideas de tu equipo a X e Instagram." },
      { title: "Agentes en tu WhatsApp", text: "Agentes que hablan en tu WhatsApp, en tu nombre." },
      {
        title: "Tu CRM",
        text: "Las puertas que abren tus publicaciones llegan aquí, para que no se pierda ningún lead ni consulta.",
        crm: true,
      },
    ],
    crmLink: "Conoce la solución CRM de GINGGA (en inglés)",
  },
  agencies: {
    title: "¿Eres una agencia?",
    text: "Distribuye GINGGA entre tus clientes y dale voz a sus equipos. Hablemos de trabajar juntos.",
    cta: "Hablemos de una alianza",
    topic: "Alianza para agencias",
  },
  cta: {
    title: "Cuando tu gente se muestra, tu negocio se nota.",
    lead: "Conecta las fuentes de tu equipo y encuentra publicaciones en lo que ya dicen en reuniones, notas y lecturas.",
    label: "Reservar una demo",
  },
};

export const homeCopy: Record<Lang, HomeCopy> = { en, es };
