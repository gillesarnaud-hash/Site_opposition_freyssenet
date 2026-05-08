// site.jsx — Site de l'opposition municipale de Freyssenet
// Maquette haute fidélité, ton engagé et affirmé

const { useState, useEffect, useRef, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#8b2635", "#4a5d3a", "#1a1a1a", "#fafaf7"],
  "headingFont": "Instrument Serif",
  "bodyFont": "Public Sans",
  "kpiFormat": "jauges",
  "cardStyle": "bordered",
  "tone": "engage"
}/*EDITMODE-END*/;

// ───────────────────────────── DATA ─────────────────────────────
const ELUS = [
  { name: "[À compléter — votre nom]", role: "Conseiller municipal d'opposition", quote: "Mon rôle : porter la voix de tous les habitants, pas seulement celle d'une majorité. La transparence n'est pas une option, c'est un devoir.", initials: "—" },
];

const ACTUS = [
  { tag: "Tribune", date: "28 avril 2026", title: "Budget 2026 : nos alertes sur l'endettement communal", excerpt: "Le budget voté ce mois-ci passe sous silence un endettement par habitant qui a doublé en trois ans. Décryptage et propositions alternatives." },
  { tag: "Conseil", date: "22 avril 2026", title: "Compte-rendu du conseil du 18 avril", excerpt: "Cinq délibérations contestées, un vote sur la cession d'un bien communal sans estimation des Domaines, et nos questions restées sans réponse." },
  { tag: "Patrimoine", date: "15 avril 2026", title: "La chapelle Saint-Roch toujours en péril", excerpt: "Quatre ans après notre première alerte, les travaux de mise hors d'eau n'ont toujours pas été engagés. Photos et chiffrage à l'appui." },
  { tag: "Démocratie", date: "08 avril 2026", title: "Pour un référendum communal sur l'éolien", excerpt: "Nous demandons une consultation officielle des Freyssenetois avant toute signature avec les opérateurs." },
];

const KPIS_2020 = [
  { theme: "Routes & chemins", promesse: "Réfection complète de 12 km de voirie communale d'ici 2026", realise: 35, statut: "retard", detail: "4,2 km réalisés sur 12 km promis. Plusieurs chemins ruraux signalés en 2023 toujours non traités." },
  { theme: "Patrimoine bâti", promesse: "Sauvegarder la chapelle, le lavoir et le four banal", realise: 15, statut: "alerte", detail: "Seul le lavoir a fait l'objet d'un nettoyage. Aucune étude diagnostic engagée sur la chapelle." },
  { theme: "Vivre ensemble", promesse: "Créer un espace de rencontre intergénérationnel", realise: 60, statut: "encours", detail: "Salle polyvalente rénovée mais peu d'animations programmées. Conseil des anciens jamais réuni." },
  { theme: "Finances communales", promesse: "Maintenir une fiscalité stable sans nouvel emprunt", realise: 20, statut: "alerte", detail: "Hausse de 8% de la taxe foncière en 2025. Nouvel emprunt de 240k€ contracté en juin." },
  { theme: "Écologie & transition", promesse: "Plan énergie communal et réduction de 30% des consommations", realise: 25, statut: "retard", detail: "Aucun audit énergétique réalisé. Éclairage public encore au sodium sur 70% du réseau." },
  { theme: "Probité & déontologie", promesse: "Charte de l'élu et registre public des déports", realise: 0, statut: "alerte", detail: "Aucune charte signée. Trois délibérations votées sans déport sur conflit d'intérêt apparent." },
  { theme: "Transparence", promesse: "Diffusion en direct et publication des PV sous 15 jours", realise: 45, statut: "encours", detail: "PV publiés mais avec 6 à 8 semaines de retard. Pas de diffusion vidéo." },
  { theme: "Démocratie participative", promesse: "Budget participatif et consultations citoyennes", realise: 10, statut: "alerte", detail: "Une seule réunion publique en 4 ans. Aucun budget participatif mis en place." },
];

const KPIS_2026 = [
  { theme: "Routes & chemins", promesse: "Achever les 8 km de voirie restants et entretenir les chemins ruraux", realise: 5, statut: "encours", detail: "Mandat débuté en mars 2026. Diagnostic en cours sur l'ensemble du réseau. Premiers chantiers programmés à l'automne." },
  { theme: "Patrimoine bâti", promesse: "Lancer l'étude de sauvegarde de la chapelle Saint-Roch sous 12 mois", realise: 10, statut: "encours", detail: "Premières prises de contact avec la DRAC. Subvention sollicitée auprès du Département. Nous suivrons mois après mois." },
  { theme: "Vivre ensemble", promesse: "Réunir le conseil des anciens et créer un comité des fêtes intergénérationnel", realise: 0, statut: "alerte", detail: "Aucune initiative annoncée à ce stade. Nous attendons l'inscription au prochain conseil." },
  { theme: "Finances communales", promesse: "Présenter chaque année un débat d'orientation budgétaire ouvert au public", realise: 0, statut: "encours", detail: "Premier DOB attendu en novembre 2026. Nous avons proposé qu'il se tienne en réunion publique." },
  { theme: "Écologie & transition", promesse: "Audit énergétique communal et passage de l'éclairage public en LED", realise: 0, statut: "alerte", detail: "Aucun calendrier annoncé. Notre proposition d'audit gratuit via le SDE 07 est restée sans réponse." },
  { theme: "Probité & déontologie", promesse: "Adopter une charte de l'élu dès la première séance du mandat", realise: 0, statut: "alerte", detail: "Texte que nous avons proposé non inscrit à l'ordre du jour de la séance d'installation." },
  { theme: "Transparence", promesse: "Diffuser le conseil municipal en direct vidéo et publier les PV sous 15 jours", realise: 25, statut: "encours", detail: "Captation audio mise en place dès avril. La diffusion vidéo reste à organiser." },
  { theme: "Démocratie participative", promesse: "Mettre en place un budget participatif annuel de 5 000 €", realise: 0, statut: "encours", detail: "Engagement réaffirmé par la majorité. Première édition annoncée pour 2027." },
];

const MANDATS = {
  "2020": { kpis: KPIS_2020, label: "Mandat 2020 — 2026", sub: "Bilan complet · achevé en mars 2026", source: "Sources : programme 2020, délibérations, comptes administratifs, observations de terrain." },
  "2026": { kpis: KPIS_2026, label: "Mandat 2026 — 2032", sub: "En cours · suivi mois après mois", source: "Sources : programme 2026 de la liste majoritaire, déclarations en conseil, premières délibérations." },
};

const DOCS_CAPCA = [
  { type: "Convocation", date: "05 mai 2026", title: "Conseil communautaire CAPCA du 14 mai 2026", size: "PDF · 196 Ko" },
  { type: "Ordre du jour", date: "05 mai 2026", title: "Séance du 14 mai 2026 — 22 délibérations", size: "PDF · 142 Ko" },
  { type: "Procès-verbal", date: "20 avril 2026", title: "Conseil communautaire du 9 avril 2026", size: "PDF · 1,4 Mo" },
  { type: "Compte-rendu", date: "20 avril 2026", title: "Synthèse du conseil du 9 avril 2026", size: "PDF · 312 Ko" },
  { type: "Délibération", date: "09 avril 2026", title: "DCC 2026-047 — Plan climat-air-énergie territorial", size: "PDF · 2,8 Mo" },
  { type: "Procès-verbal", date: "12 mars 2026", title: "Conseil communautaire du 5 mars 2026", size: "PDF · 1,1 Mo" },
  { type: "Rapport", date: "01 mars 2026", title: "Rapport d'activité CAPCA 2025", size: "PDF · 4,2 Mo" },
];

const DOCS_CONSEIL = [
  { type: "Convocation", date: "12 mai 2026", title: "Conseil municipal du 20 mai 2026", size: "PDF · 124 Ko" },
  { type: "Ordre du jour", date: "12 mai 2026", title: "Séance du 20 mai 2026 — 9 délibérations", size: "PDF · 88 Ko" },
  { type: "Procès-verbal", date: "30 avril 2026", title: "Séance du 18 avril 2026", size: "PDF · 412 Ko" },
  { type: "Délibération", date: "18 avril 2026", title: "DCM 2026-018 — Cession parcelle B 247", size: "PDF · 156 Ko" },
  { type: "Procès-verbal", date: "22 mars 2026", title: "Séance du 14 mars 2026", size: "PDF · 388 Ko" },
  { type: "Budget", date: "08 mars 2026", title: "Budget primitif 2026 — annexes complètes", size: "PDF · 2,1 Mo" },
];

const DOCS_OPPO = [
  { type: "Tribune", date: "28 avril", title: "Budget 2026 : nos alertes", excerpt: "Analyse ligne à ligne du budget voté." },
  { type: "Question écrite", date: "20 avril", title: "Sur la cession de la parcelle B 247", excerpt: "Demande d'estimation des Domaines préalable." },
  { type: "Vœu", date: "14 mars", title: "Pour la sauvegarde de la chapelle Saint-Roch", excerpt: "Texte rejeté par 7 voix contre 3." },
  { type: "Proposition", date: "10 février", title: "Charte de l'élu et registre des déports", excerpt: "Texte type proposé, non inscrit à l'ordre du jour." },
  { type: "Amendement", date: "18 janvier", title: "Sur le règlement intérieur du conseil", excerpt: "Garantir le temps de parole de l'opposition." },
];

const ASSOS = [
  { name: "Les Amis de Freyssenet", focus: "Patrimoine & histoire locale", next: "Visite guidée du four banal — 14 mai" },
  { name: "Comité des fêtes", focus: "Animations & festivités", next: "Vide-greniers de printemps — 25 mai" },
  { name: "Foyer rural", focus: "Activités sportives & culturelles", next: "Tournoi de pétanque — 1ᵉʳ juin" },
  { name: "Société de chasse", focus: "Régulation & nature", next: "Battue collective — 8 juin" },
  { name: "Club du 3ᵉ âge", focus: "Lien social & sorties", next: "Sortie en Drôme — 22 mai" },
];

const TEMOIGNAGES = [
  { author: "Bernadette L.", lieu: "Hameau du Cluzel", date: "il y a 2 jours", votes: 11, text: "Le chemin qui mène chez nous est impraticable depuis l'hiver dernier. Trois courriers en mairie, aucune réponse. Heureusement qu'il y a ce site pour qu'on nous entende." },
  { author: "Pascal D.", lieu: "Bourg", date: "il y a 4 jours", votes: 16, text: "Pourquoi le compte-rendu du conseil de mars n'est-il toujours pas affiché en mairie ? On parle de transparence mais dans les faits..." },
  { author: "Anonyme", lieu: "Freyssenet", date: "il y a 1 semaine", votes: 22, text: "J'aimerais qu'on parle vraiment du devenir de la salle communale. Les chiffres sont là : si on ne fait rien, elle se dégradera irrémédiablement." },
];

const IDEES = [
  { title: "Créer un marché de producteurs locaux", auteur: "Hélène M.", votes: 18, statut: "Très soutenue" },
  { title: "Installer des bancs sur le chemin de la Croix", auteur: "Robert T.", votes: 12, statut: "Soutenue" },
  { title: "Diffuser le conseil municipal en vidéo", auteur: "Collectif citoyen", votes: 27, statut: "Très soutenue" },
  { title: "Sentier d'interprétation du patrimoine", auteur: "Jeanne P.", votes: 9, statut: "À débattre" },
];

// ───────────────────────────── HELPERS ─────────────────────────────
function statutColor(statut, palette) {
  if (statut === "ok") return palette[1];
  if (statut === "encours") return "#c9a227";
  if (statut === "retard") return "#d97706";
  return palette[0]; // alerte
}
function statutLabel(statut) {
  return { ok: "Tenu", encours: "En cours", retard: "En retard", alerte: "Non tenu" }[statut];
}

// ───────────────────────────── COMPONENTS ─────────────────────────────
function BrandMark({ palette, headingFont, size = 48 }) {
  return (
    <img src="logo.png" alt="Freyssenet" className="brand-mark"
      style={{ width: size, height: size, objectFit: "contain", display: "block", flexShrink: 0 }} />
  );
}

function Header({ section, setSection, palette, headingFont }) {
  const items = [
    ["accueil", "Accueil"],
    ["conseil", "Conseil municipal"],
    ["bilan", "Bilan de la majorité"],
    ["opposition", "Mon action"],
    ["expression", "Vous avez la parole"],
    ["commune", "Notre commune"],
    ["meteo", "Météo"],
    ["nous", "Qui sommes-nous"],
  ];
  return (
    <header className="site-header" data-screen-label={`Header`}>
      <div className="site-header__inner">
        <a href="#" onClick={(e) => { e.preventDefault(); setSection("accueil"); }} className="site-brand">
          <BrandMark palette={palette} headingFont={headingFont} />
          <div className="site-brand__text">
            <div className="site-brand__name" style={{ fontFamily: headingFont }}>Freyssenet Ensemble</div>
            <div className="site-brand__sub">L'avenir à construire ensemble</div>
          </div>
        </a>
        <nav className="site-nav">
          {items.map(([k, l]) => (
            <button key={k} onClick={() => setSection(k)}
              className={"site-nav__item " + (section === k ? "is-active" : "")}
              style={section === k ? { color: palette[0] } : {}}>
              {l}
              {section === k && <span className="site-nav__bar" style={{ background: palette[0] }} />}
            </button>
          ))}
        </nav>
        <button className="site-cta" style={{ background: palette[2], color: palette[3] }}
          onClick={() => setSection("expression")}>
          Nous écrire →
        </button>
      </div>
    </header>
  );
}

function Hero({ palette, headingFont, setSection, tone }) {
  const titre = tone === "engage"
    ? "Freyssenet, l'avenir à construire ensemble."
    : "Freyssenet, l'avenir à construire ensemble.";
  const intro = tone === "engage"
    ? "46 habitants, une voix qui compte. Nous publions ici tous les documents du conseil municipal, nos analyses, nos propositions, et nous donnons la parole à ceux que la majorité préfère ne pas entendre."
    : "46 habitants, une commune à faire vivre. Nous mettons à disposition les documents du conseil, nos travaux et un espace d'expression ouvert à tous les Freyssenetois.";
  return (
    <section className="hero" data-screen-label="Hero">
      <div className="hero__grid">
        <div className="hero__left">
          <div className="hero__eyebrow" style={{ color: palette[0] }}>
            <span className="hero__pulse" style={{ background: palette[0] }} />
            Édition du 8 mai 2026 · 46 habitants · Ardèche
          </div>
          <h1 className="hero__title" style={{ fontFamily: headingFont, color: palette[2] }}>
            {titre}
          </h1>
          <p className="hero__lead">{intro}</p>
          <div className="hero__cta">
            <button className="btn btn--primary" style={{ background: palette[0] }} onClick={() => setSection("bilan")}>
              Voir le bilan de la majorité
            </button>
            <button className="btn btn--ghost" onClick={() => setSection("conseil")}>
              Consulter les documents →
            </button>
          </div>
          <div className="hero__stats">
            <Stat n="48" l="délibérations suivies" palette={palette} headingFont={headingFont} />
            <Stat n="12" l="tribunes publiées" palette={palette} headingFont={headingFont} />
            <Stat n="38" l="contributions citoyennes" palette={palette} headingFont={headingFont} />
            <Stat n="1/7" l="élu d'opposition" palette={palette} headingFont={headingFont} />
          </div>
        </div>
        <div className="hero__right">
          <div className="hero__photo">
            <img src="village.jpg" alt="Vue ancienne du village de Freyssenet-en-Coiron" />
          </div>
          <div className="hero__caption">
            « Freyssenet-en-Coiron — un village dans l'intérieur d'un cirque de prairies, que des géologues disent être le cratère d'un volcan. »<br />
            <span style={{ opacity: .6 }}>— Carte postale, vers 1906</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ n, l, palette, headingFont }) {
  return (
    <div className="stat">
      <div className="stat__n" style={{ fontFamily: headingFont, color: palette[0] }}>{n}</div>
      <div className="stat__l">{l}</div>
    </div>
  );
}

function SectionTitle({ kicker, title, palette, headingFont }) {
  return (
    <div className="sect-title">
      <div className="sect-title__kicker" style={{ color: palette[0] }}>
        <span className="sect-title__line" style={{ background: palette[0] }} /> {kicker}
      </div>
      <h2 style={{ fontFamily: headingFont, color: palette[2] }}>{title}</h2>
    </div>
  );
}

function Actus({ palette, headingFont }) {
  return (
    <section className="actus" data-screen-label="Actualités">
      <SectionTitle kicker="À la une" title="Nos dernières publications" palette={palette} headingFont={headingFont} />
      <div className="actus__grid">
        {ACTUS.map((a, i) => (
          <article key={i} className={"card actu " + (i === 0 ? "actu--featured" : "")}>
            <div className="actu__meta">
              <span className="actu__tag" style={{ color: palette[0], borderColor: palette[0] }}>{a.tag}</span>
              <span className="actu__date">{a.date}</span>
            </div>
            <h3 style={{ fontFamily: headingFont, color: palette[2] }}>{a.title}</h3>
            <p>{a.excerpt}</p>
            <a className="actu__more" style={{ color: palette[0] }}>Lire la suite →</a>
            {i === 0 && (
              <div className="actu__hero placeholder">
                <div className="placeholder__label">photo · illustration tribune</div>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function KPI({ palette, headingFont, format }) {
  const [mandat, setMandat] = useState("2020");
  const m = MANDATS[mandat];
  return (
    <section className="bilan" data-screen-label="Bilan KPI">
      <SectionTitle kicker={"Bilan de la majorité — " + m.label.toLowerCase()}
        title="Promesses tenues, promesses oubliées." palette={palette} headingFont={headingFont} />

      <div className="mandat-switch">
        {Object.entries(MANDATS).map(([k, v]) => (
          <button key={k}
            className={"mandat-switch__btn " + (mandat === k ? "is-active" : "")}
            onClick={() => setMandat(k)}
            style={mandat === k ? { borderColor: palette[0], color: palette[0] } : {}}>
            <div className="mandat-switch__l" style={{ fontFamily: headingFont }}>{v.label}</div>
            <div className="mandat-switch__s">{v.sub}</div>
          </button>
        ))}
      </div>

      <p className="bilan__intro">
        Notre méthode : pour chaque engagement public de la majorité, nous mesurons l'écart entre la promesse et la réalisation effective au {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}. {m.source}
      </p>

      <div className="bilan__legend">
        <LegendItem c={palette[1]} l="Tenu (≥80%)" />
        <LegendItem c="#c9a227" l="En cours (50–79%)" />
        <LegendItem c="#d97706" l="En retard (20–49%)" />
        <LegendItem c={palette[0]} l="Non tenu (&lt;20%)" />
      </div>

      <div className="bilan__list">
        {m.kpis.map((k, i) => (
          <KPICard key={mandat + i} k={k} palette={palette} headingFont={headingFont} format={format} idx={i} />
        ))}
      </div>
    </section>
  );
}

function LegendItem({ c, l }) {
  return <div className="legend-item"><span style={{ background: c }} /> {l}</div>;
}

function KPICard({ k, palette, headingFont, format, idx }) {
  const color = statutColor(k.statut, palette);
  return (
    <article className="kpi-card" data-screen-label={`KPI ${idx + 1}`}>
      <div className="kpi-card__head">
        <div className="kpi-card__num" style={{ fontFamily: headingFont, color: palette[0] }}>
          {String(idx + 1).padStart(2, "0")}
        </div>
        <div className="kpi-card__title">
          <h3 style={{ fontFamily: headingFont, color: palette[2] }}>{k.theme}</h3>
          <p>« {k.promesse} »</p>
        </div>
        <div className="kpi-card__badge" style={{ color, borderColor: color }}>
          {statutLabel(k.statut)}
        </div>
      </div>

      {format === "jauges" && (
        <div className="kpi-gauge">
          <div className="kpi-gauge__row">
            <span>Promesse</span>
            <div className="kpi-gauge__bar"><div style={{ width: "100%", background: "rgba(0,0,0,.12)" }} /></div>
            <span className="kpi-gauge__val">100%</span>
          </div>
          <div className="kpi-gauge__row">
            <span>Réalisé</span>
            <div className="kpi-gauge__bar"><div style={{ width: `${k.realise}%`, background: color }} /></div>
            <span className="kpi-gauge__val" style={{ color, fontWeight: 600 }}>{k.realise}%</span>
          </div>
        </div>
      )}

      {format === "notes" && (
        <div className="kpi-note">
          <div className="kpi-note__big" style={{ fontFamily: headingFont, color }}>
            {Math.round(k.realise / 10)}<span>/10</span>
          </div>
          <div className="kpi-note__bars">
            {[...Array(10)].map((_, i) => (
              <span key={i} style={{ background: i < Math.round(k.realise / 10) ? color : "rgba(0,0,0,.08)" }} />
            ))}
          </div>
        </div>
      )}

      {format === "feux" && (
        <div className="kpi-feux">
          <div className={"feu " + (k.statut === "ok" ? "is-on" : "")} style={{ background: k.statut === "ok" ? palette[1] : "rgba(0,0,0,.08)" }} />
          <div className={"feu " + (k.statut === "encours" || k.statut === "retard" ? "is-on" : "")} style={{ background: (k.statut === "encours" || k.statut === "retard") ? "#d97706" : "rgba(0,0,0,.08)" }} />
          <div className={"feu " + (k.statut === "alerte" ? "is-on" : "")} style={{ background: k.statut === "alerte" ? palette[0] : "rgba(0,0,0,.08)" }} />
          <div className="kpi-feux__label" style={{ color }}>{statutLabel(k.statut)}</div>
        </div>
      )}

      <p className="kpi-card__detail">{k.detail}</p>
    </article>
  );
}

function Conseil({ palette, headingFont }) {
  const [scope, setScope] = useState("municipal");
  const docs = scope === "municipal" ? DOCS_CONSEIL : DOCS_CAPCA;
  return (
    <section className="conseil" data-screen-label="Conseil municipal">
      <SectionTitle kicker="Documents officiels" title="Tous les documents des conseils." palette={palette} headingFont={headingFont} />
      <p className="conseil__intro">
        Convocations, ordres du jour, procès-verbaux, délibérations et budgets : tout ce qui devrait être public, l'est ici. Les documents sont publiés dès leur réception, sans filtre.
      </p>

      <div className="conseil__scope">
        <button
          className={"conseil__scope-btn " + (scope === "municipal" ? "is-active" : "")}
          onClick={() => setScope("municipal")}
          style={scope === "municipal" ? { borderColor: palette[0], color: palette[0] } : {}}>
          <div className="conseil__scope-l">Conseil municipal</div>
          <div className="conseil__scope-s">Commune de Freyssenet · 7 conseillers</div>
        </button>
        <button
          className={"conseil__scope-btn " + (scope === "capca" ? "is-active" : "")}
          onClick={() => setScope("capca")}
          style={scope === "capca" ? { borderColor: palette[0], color: palette[0] } : {}}>
          <div className="conseil__scope-l">Conseil communautaire <span className="conseil__scope-tag">CAPCA</span></div>
          <div className="conseil__scope-s">Communauté d'Agglomération Privas Centre Ardèche</div>
        </button>
      </div>

      {scope === "capca" && (
        <div className="capca-notice">
          <strong>À propos de la CAPCA</strong> — La Communauté d'Agglomération Privas Centre Ardèche regroupe 42 communes dont Freyssenet. Elle exerce des compétences essentielles pour notre quotidien : eau, assainissement, déchets, urbanisme, mobilités, développement économique. Trop souvent ignorée des habitants, c'est pourtant là que se prennent des décisions qui nous touchent directement.
        </div>
      )}

      <div className="conseil__filters">
        {["Tout", "Convocations", "Ordres du jour", "Procès-verbaux", "Délibérations", scope === "capca" ? "Rapports" : "Budgets"].map((f, i) => (
          <button key={f} className={"chip " + (i === 0 ? "is-active" : "")}
            style={i === 0 ? { background: palette[2], color: palette[3], borderColor: palette[2] } : {}}>{f}</button>
        ))}
      </div>

      <div className="docs-list">
        {docs.map((d, i) => (
          <a key={i} className="doc-row">
            <div className="doc-row__icon" style={{ borderColor: palette[0], color: palette[0] }}>PDF</div>
            <div className="doc-row__main">
              <div className="doc-row__type" style={{ color: palette[0] }}>{d.type}</div>
              <div className="doc-row__title" style={{ fontFamily: headingFont }}>{d.title}</div>
              <div className="doc-row__meta">{d.date} · {d.size}</div>
            </div>
            <div className="doc-row__action">Télécharger ↓</div>
          </a>
        ))}
      </div>

      <div className="conseil__next">
        <div className="conseil__next-label" style={{ color: palette[0] }}>
          {scope === "municipal" ? "Prochaine séance — Conseil municipal" : "Prochaine séance — Conseil communautaire CAPCA"}
        </div>
        <h3 style={{ fontFamily: headingFont }}>
          {scope === "municipal"
            ? "Mercredi 20 mai 2026 · 20h00 · Salle du conseil"
            : "Jeudi 14 mai 2026 · 18h30 · Siège CAPCA, Privas"}
        </h3>
        <p>
          {scope === "municipal"
            ? "Séance publique. 9 délibérations à l'ordre du jour, dont la révision du PLU et la subvention 2026 aux associations."
            : "Séance publique. 22 délibérations dont le vote du budget supplémentaire et le schéma directeur d'assainissement intercommunal."}
        </p>
        <button className="btn btn--ghost">Ajouter à mon agenda →</button>
      </div>
    </section>
  );
}

function Opposition({ palette, headingFont }) {
  return (
    <section className="opposition" data-screen-label="Documents opposition">
      <SectionTitle kicker="Mon action au conseil" title="Tribunes, propositions, votes : ce que je porte." palette={palette} headingFont={headingFont} />
      <div className="oppo__grid">
        {DOCS_OPPO.map((d, i) => (
          <article key={i} className="card oppo-card">
            <div className="oppo-card__head">
              <span className="oppo-card__type" style={{ background: palette[0], color: palette[3] }}>{d.type}</span>
              <span className="oppo-card__date">{d.date} 2026</span>
            </div>
            <h3 style={{ fontFamily: headingFont }}>{d.title}</h3>
            <p>{d.excerpt}</p>
            <div className="oppo-card__foot">
              <a style={{ color: palette[0] }}>Lire le texte →</a>
            </div>
          </article>
        ))}
      </div>

      <div className="vote-record">
        <h3 style={{ fontFamily: headingFont, color: palette[2] }}>Notre registre de vote</h3>
        <p>Sur les 48 délibérations soumises au conseil depuis le début du mandat, voici la répartition de mes votes :</p>
        <div className="vote-bars">
          <VoteBar label="Pour" pct={62} count={30} color={palette[1]} />
          <VoteBar label="Contre" pct={25} count={12} color={palette[0]} />
          <VoteBar label="Abstention" pct={13} count={6} color="#c9a227" />
        </div>
        <p className="vote-record__note">
          Je ne m'oppose pas par principe : je vote pour ce qui sert l'intérêt général. Détail des votes consultable pour chaque délibération.
        </p>
      </div>
    </section>
  );
}

function VoteBar({ label, pct, count, color }) {
  return (
    <div className="vote-bar">
      <div className="vote-bar__head"><span>{label}</span><span>{count} votes · {pct}%</span></div>
      <div className="vote-bar__track"><div style={{ width: `${pct}%`, background: color }} /></div>
    </div>
  );
}

function Expression({ palette, headingFont }) {
  const [tab, setTab] = useState("temoignages");
  const [text, setText] = useState("");
  return (
    <section className="expression" data-screen-label="Expression citoyens">
      <SectionTitle kicker="Vous avez la parole" title="L'espace d'expression des Freyssenetois." palette={palette} headingFont={headingFont} />
      <p className="expression__intro">
        Trois manières de vous exprimer : témoigner publiquement, soutenir des idées, ou m'écrire confidentiellement. Tous les messages sont lus. Aucune censure, sauf injures et propos contraires à la loi.
      </p>

      <div className="expression__tabs">
        {[["temoignages", "Témoignages"], ["idees", "Boîte à idées"], ["ecrire", "Nous écrire"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={"expression__tab " + (tab === k ? "is-active" : "")}
            style={tab === k ? { borderColor: palette[0], color: palette[0] } : {}}>{l}</button>
        ))}
      </div>

      {tab === "temoignages" && (
        <div className="expression__col">
          <div className="testimony-form">
            <textarea placeholder="Partagez votre témoignage… (ce que vous voyez, ce qui vous concerne, ce que vous voulez voir changer)"
              value={text} onChange={(e) => setText(e.target.value)} />
            <div className="testimony-form__row">
              <label className="check"><input type="checkbox" /> Publier de manière anonyme</label>
              <button className="btn btn--primary" style={{ background: palette[0] }}>Publier mon témoignage →</button>
            </div>
          </div>
          <div className="testimonies">
            {TEMOIGNAGES.map((t, i) => (
              <article key={i} className="testimony">
                <div className="testimony__head">
                  <div className="testimony__avatar" style={{ background: palette[1], color: palette[3] }}>
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <div className="testimony__author">{t.author}</div>
                    <div className="testimony__meta">{t.lieu} · {t.date}</div>
                  </div>
                </div>
                <p>« {t.text} »</p>
                <div className="testimony__foot">
                  <button className="testimony__vote" style={{ borderColor: palette[0], color: palette[0] }}>♥ {t.votes} habitants soutiennent</button>
                  <a className="testimony__reply">Répondre</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {tab === "idees" && (
        <div className="ideas">
          <div className="ideas__form">
            <input placeholder="Proposez une idée pour Freyssenet…" />
            <button className="btn btn--primary" style={{ background: palette[0] }}>Soumettre →</button>
          </div>
          {IDEES.map((i, idx) => (
            <article key={idx} className="idea-row">
              <div className="idea-row__votes">
                <button className="idea-row__up" style={{ borderColor: palette[0], color: palette[0] }}>▲</button>
                <span style={{ fontFamily: headingFont }}>{i.votes}</span>
              </div>
              <div className="idea-row__main">
                <h4 style={{ fontFamily: headingFont }}>{i.title}</h4>
                <div className="idea-row__meta">Proposée par {i.auteur} · <span style={{ color: palette[0] }}>{i.statut}</span></div>
              </div>
              <a className="idea-row__more" style={{ color: palette[0] }}>Voir le débat →</a>
            </article>
          ))}
        </div>
      )}

      {tab === "ecrire" && (
        <div className="contact">
          <div className="contact__form card">
            <h3 style={{ fontFamily: headingFont }}>Écrivez-nous directement</h3>
            <p>Vos messages me sont adressés directement. Confidentialité garantie.</p>
            <div className="contact__row">
              <label>Votre nom (facultatif)<input placeholder="Marie ou anonyme" /></label>
              <label>Hameau / lieu-dit<input placeholder="Le Bourg, Cluzel…" /></label>
            </div>
            <label>Email pour vous répondre<input placeholder="vous@exemple.fr" type="email" /></label>
            <label>Sujet
              <select>
                <option>Une question sur le conseil municipal</option>
                <option>Un signalement (route, patrimoine…)</option>
                <option>Une idée à soumettre</option>
                <option>Demander un rendez-vous</option>
                <option>Autre</option>
              </select>
            </label>
            <label>Votre message<textarea rows="6" /></label>
            <button className="btn btn--primary" style={{ background: palette[0] }}>Envoyer →</button>
          </div>
          <aside className="contact__side">
            <h4 style={{ fontFamily: headingFont }}>Permanence physique</h4>
            <p>Salle des fêtes, premier samedi du mois<br />de 10h à 12h. Sans rendez-vous.</p>
            <h4 style={{ fontFamily: headingFont }}>Téléphone</h4>
            <p>06 12 34 56 78<br />(en soirée)</p>
            <h4 style={{ fontFamily: headingFont }}>Courrier</h4>
            <p>Freyssenet Ensemble<br />Mairie de Freyssenet<br />07000 Freyssenet</p>
          </aside>
        </div>
      )}
    </section>
  );
}

function Commune({ palette, headingFont }) {
  return (
    <section className="commune" data-screen-label="Commune">
      <SectionTitle kicker="Notre commune" title="Freyssenet, ses richesses, sa vie associative." palette={palette} headingFont={headingFont} />
      <div className="commune__hero">
        <div className="placeholder placeholder--wide">
          <div className="placeholder__label">photo · panorama de Freyssenet et chaîne ardéchoise au fond</div>
        </div>
        <div className="commune__intro">
          <p style={{ fontFamily: headingFont, fontSize: 22, lineHeight: 1.4, color: palette[2] }}>
            « 46 habitants, 1 482 hectares, mille raisons d'aimer Freyssenet. »
          </p>
          <p>
            Aux portes de l'Ardèche méridionale, Freyssenet conjugue patrimoine bâti remarquable, terroir vivant et tissu associatif riche. Cette section met en valeur ce qui fait notre fierté commune — au-delà des clivages politiques.
          </p>
        </div>
      </div>

      <div className="commune__patrimoine">
        <h3 style={{ fontFamily: headingFont, color: palette[2] }}>Patrimoine remarquable</h3>
        <div className="patrimoine-grid">
          {[
            ["Chapelle Saint-Roch", "XIIᵉ siècle"],
            ["Le four banal restauré", "XVIIᵉ siècle"],
            ["Lavoir du village", "1842"],
            ["Croix de mission", "1856"],
          ].map(([t, d], i) => (
            <div key={i} className="patrimoine-card">
              <div className="placeholder placeholder--square">
                <div className="placeholder__label">photo</div>
              </div>
              <div className="patrimoine-card__t" style={{ fontFamily: headingFont }}>{t}</div>
              <div className="patrimoine-card__d">{d}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="commune__assos">
        <h3 style={{ fontFamily: headingFont, color: palette[2] }}>Vie associative</h3>
        <div className="assos-list">
          {ASSOS.map((a, i) => (
            <article key={i} className="card asso-card">
              <h4 style={{ fontFamily: headingFont }}>{a.name}</h4>
              <div className="asso-card__focus">{a.focus}</div>
              <div className="asso-card__next" style={{ color: palette[0] }}>→ {a.next}</div>
            </article>
          ))}
        </div>
      </div>

      <div className="commune__sondage card" style={{ borderColor: palette[0] }}>
        <div className="sondage__head">
          <div className="sondage__pill" style={{ background: palette[0], color: palette[3] }}>Sondage en cours</div>
          <h3 style={{ fontFamily: headingFont }}>Quelle priorité pour les 6 mois à venir ?</h3>
        </div>
        <div className="sondage__opts">
          {[
            ["Réfection des chemins ruraux", 47],
            ["Sauvegarde de la chapelle Saint-Roch", 32],
            ["Création d'un marché de producteurs", 28],
            ["Diffusion vidéo du conseil municipal", 51],
          ].map(([l, pct], i) => (
            <button key={i} className="sondage__opt">
              <div className="sondage__opt-bar" style={{ width: `${pct}%`, background: palette[0] }} />
              <div className="sondage__opt-l">{l}</div>
              <div className="sondage__opt-pct" style={{ fontFamily: headingFont }}>{pct}%</div>
            </button>
          ))}
        </div>
        <div className="sondage__foot">28 votes sur 46 habitants · clos le 31 mai 2026</div>
      </div>
    </section>
  );
}

function Meteo({ palette, headingFont }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  useEffect(() => {
    // Coordonnées approximatives de Freyssenet (07000)
    const url = "https://api.open-meteo.com/v1/forecast?latitude=44.65&longitude=4.55&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=Europe%2FParis&forecast_days=7";
    fetch(url).then(r => r.json()).then(setData).catch(e => setErr(String(e)));
  }, []);

  const codeLabel = (c) => {
    if (c == null) return "—";
    if (c === 0) return "Ciel dégagé";
    if (c <= 3) return "Partiellement nuageux";
    if (c <= 48) return "Brouillard";
    if (c <= 67) return "Pluie";
    if (c <= 77) return "Neige";
    if (c <= 82) return "Averses";
    if (c <= 99) return "Orages";
    return "—";
  };
  const codeIcon = (c) => {
    if (c == null) return "—";
    if (c === 0) return "☀";
    if (c <= 3) return "⛅";
    if (c <= 48) return "🌫";
    if (c <= 67) return "🌧";
    if (c <= 77) return "❄";
    if (c <= 82) return "🌦";
    return "⛈";
  };
  const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  return (
    <section className="meteo-sect" data-screen-label="Météo">
      <SectionTitle kicker="Météo de Freyssenet" title="Le ciel sur le Coiron, en direct." palette={palette} headingFont={headingFont} />
      <p className="meteo-sect__intro">
        Données ouvertes Open-Meteo, mises à jour toutes les heures. Coordonnées : 44,65° N — 4,55° E, altitude 800 m env.
      </p>
      {err && <div className="meteo-err">Données indisponibles : {err}</div>}
      {!data && !err && <div className="meteo-load">Chargement des relevés…</div>}
      {data && (
        <>
          <div className="meteo-now card">
            <div className="meteo-now__main">
              <div className="meteo-now__icon" style={{ color: palette[0] }}>{codeIcon(data.current.weather_code)}</div>
              <div>
                <div className="meteo-now__t" style={{ fontFamily: headingFont, color: palette[2] }}>
                  {Math.round(data.current.temperature_2m)}<span>°C</span>
                </div>
                <div className="meteo-now__l">{codeLabel(data.current.weather_code)} · ressenti {Math.round(data.current.apparent_temperature)}°</div>
              </div>
            </div>
            <div className="meteo-now__side">
              <Metric l="Humidité" v={data.current.relative_humidity_2m + " %"} headingFont={headingFont} />
              <Metric l="Vent" v={Math.round(data.current.wind_speed_10m) + " km/h"} headingFont={headingFont} />
              <Metric l="Direction" v={data.current.wind_direction_10m + "°"} headingFont={headingFont} />
            </div>
          </div>
          <h3 className="meteo-fc__h" style={{ fontFamily: headingFont, color: palette[2] }}>Prévisions à 7 jours</h3>
          <div className="meteo-fc">
            {data.daily.time.map((d, i) => {
              const dd = new Date(d);
              return (
                <div key={d} className="meteo-fc__d">
                  <div className="meteo-fc__day">{days[dd.getDay()]} {dd.getDate()}</div>
                  <div className="meteo-fc__icon" style={{ color: palette[0] }}>{codeIcon(data.daily.weather_code[i])}</div>
                  <div className="meteo-fc__t" style={{ fontFamily: headingFont }}>
                    <b>{Math.round(data.daily.temperature_2m_max[i])}°</b>
                    <span>{Math.round(data.daily.temperature_2m_min[i])}°</span>
                  </div>
                  <div className="meteo-fc__rain">{data.daily.precipitation_sum[i]?.toFixed(1) || 0} mm</div>
                </div>
              );
            })}
          </div>
          <p className="meteo-note">
            <b>À propos de l'API.</b> Le module Python <i>meteociel_api</i> (Github : Meteo-API/meteociel_api) nécessite un serveur ; ce site étant statique, nous utilisons Open-Meteo, libre et gratuite, qui couvre Freyssenet avec la même qualité de données. Une bascule vers Meteociel sera possible si vous mettez en place un mini-serveur.
          </p>
        </>
      )}
    </section>
  );
}
function Metric({ l, v, headingFont }) {
  return <div className="metric"><div className="metric__l">{l}</div><div className="metric__v" style={{ fontFamily: headingFont }}>{v}</div></div>;
}

function Nous({ palette, headingFont }) {
  return (
    <section className="nous" data-screen-label="Qui sommes-nous">
      <SectionTitle kicker="L'élu d'opposition" title="Une voix au conseil, une conviction." palette={palette} headingFont={headingFont} />
      <p className="nous__intro">
        Seul élu d'opposition au conseil municipal de Freyssenet, je siège en minorité sur la liste « Freyssenet Ensemble ». Sans étiquette politique nationale, je porte une démarche claire : transparence, écoute, exigence.
      </p>
      <div className="elus-grid">
        {ELUS.map((e, i) => (
          <article key={i} className="card elu-card">
            <div className="placeholder placeholder--portrait">
              <div className="placeholder__label">portrait · {e.initials}</div>
            </div>
            <h3 style={{ fontFamily: headingFont }}>{e.name}</h3>
            <div className="elu-card__role" style={{ color: palette[0] }}>{e.role}</div>
            <p>« {e.quote} »</p>
          </article>
        ))}
      </div>

      <div className="charte">
        <h3 style={{ fontFamily: headingFont, color: palette[2] }}>Ma charte en quatre engagements</h3>
        <ol className="charte__list">
          <li><span style={{ color: palette[0], fontFamily: headingFont }}>01</span><div><b>Transparence intégrale.</b> Tous les documents publics sont publiés ici dès leur disponibilité, sans tri.</div></li>
          <li><span style={{ color: palette[0], fontFamily: headingFont }}>02</span><div><b>Écoute permanente.</b> Permanence mensuelle, ligne directe, courrier ouvert : aucun sujet n'est tabou.</div></li>
          <li><span style={{ color: palette[0], fontFamily: headingFont }}>03</span><div><b>Opposition constructive.</b> Je vote pour tout ce qui sert l'intérêt général, peu importe l'auteur de la proposition.</div></li>
          <li><span style={{ color: palette[0], fontFamily: headingFont }}>04</span><div><b>Démocratie vivante.</b> Sondages, consultations, budgets participatifs : je teste, je propose, j'insiste.</div></li>
        </ol>
      </div>
    </section>
  );
}

function Newsletter({ palette, headingFont }) {
  return (
    <section className="newsletter" style={{ background: palette[2], color: palette[3] }} data-screen-label="Newsletter">
      <div className="newsletter__inner">
        <div>
          <div className="newsletter__kick" style={{ color: palette[0] }}>Restons en lien</div>
          <h2 style={{ fontFamily: headingFont }}>Une lettre d'information mensuelle, sans concession.</h2>
          <p>L'essentiel du conseil, nos prochaines actions, les sondages en cours. Pas de spam, pas de récup' politique. Désabonnement en un clic.</p>
        </div>
        <form className="newsletter__form" onSubmit={(e) => e.preventDefault()}>
          <input placeholder="votre@email.fr" type="email" />
          <button style={{ background: palette[0], color: palette[3] }}>S'abonner →</button>
        </form>
      </div>
    </section>
  );
}

function Footer({ palette, headingFont }) {
  return (
    <footer className="site-footer" data-screen-label="Footer">
      <div className="site-footer__inner">
        <div>
          <div className="site-brand__name" style={{ fontFamily: headingFont, fontSize: 20 }}>Freyssenet Ensemble</div>
          <p className="site-footer__about">
            Site édité par l'élu d'opposition au conseil municipal de Freyssenet (Ardèche).
            Indépendant de la mairie. Hébergement OVH France.
          </p>
        </div>
        <div className="site-footer__cols">
          <div>
            <h5>Le site</h5>
            <a>Accueil</a><a>Conseil municipal</a><a>Bilan de la majorité</a><a>Mon action</a>
          </div>
          <div>
            <h5>Participer</h5>
            <a>Témoigner</a><a>Boîte à idées</a><a>Nous écrire</a><a>Newsletter</a>
          </div>
          <div>
            <h5>Mentions</h5>
            <a>Mentions légales</a><a>Politique de confidentialité</a><a>Modération</a><a>Contact</a>
          </div>
        </div>
      </div>
      <div className="site-footer__bottom">
        <span>© 2026 Freyssenet Ensemble — Tous droits réservés</span>
        <span>Site indépendant · n'engage pas la mairie de Freyssenet</span>
      </div>
    </footer>
  );
}

// ───────────────────────────── APP ─────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [section, setSection] = useState("accueil");
  const palette = t.palette;

  // Apply CSS vars for fonts/cards
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--fs-heading", `'${t.headingFont}', ui-serif, Georgia, serif`);
    r.style.setProperty("--fs-body", `'${t.bodyFont}', ui-sans-serif, system-ui, sans-serif`);
    r.style.setProperty("--c-primary", palette[0]);
    r.style.setProperty("--c-secondary", palette[1]);
    r.style.setProperty("--c-ink", palette[2]);
    r.style.setProperty("--c-paper", palette[3]);
    r.style.setProperty("--card-border", t.cardStyle === "bordered" ? "1px solid rgba(0,0,0,.1)" : "1px solid transparent");
    r.style.setProperty("--card-shadow", t.cardStyle === "shadow" ? "0 4px 20px rgba(0,0,0,.06)" : "none");
    r.style.setProperty("--card-bg", t.cardStyle === "filled" ? "rgba(0,0,0,.025)" : "transparent");
  }, [t]);

  // Scroll to top on section change
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [section]);

  return (
    <div className="site" style={{ background: palette[3], color: palette[2] }}>
      <Header section={section} setSection={setSection} palette={palette} headingFont={t.headingFont} />
      <main>
        {section === "accueil" && <>
          <Hero palette={palette} headingFont={t.headingFont} setSection={setSection} tone={t.tone} />
          <Actus palette={palette} headingFont={t.headingFont} />
        </>}
        {section === "conseil" && <Conseil palette={palette} headingFont={t.headingFont} />}
        {section === "bilan" && <KPI palette={palette} headingFont={t.headingFont} format={t.kpiFormat} />}
        {section === "opposition" && <Opposition palette={palette} headingFont={t.headingFont} />}
        {section === "expression" && <Expression palette={palette} headingFont={t.headingFont} />}
        {section === "commune" && <Commune palette={palette} headingFont={t.headingFont} />}
        {section === "meteo" && <Meteo palette={palette} headingFont={t.headingFont} />}
        {section === "nous" && <Nous palette={palette} headingFont={t.headingFont} />}
      </main>
      <Newsletter palette={palette} headingFont={t.headingFont} />
      <Footer palette={palette} headingFont={t.headingFont} />

      <TweaksPanel>
        <TweakSection label="Palette" />
        <TweakColor label="Couleurs" value={t.palette}
          options={[
            ["#8b2635", "#4a5d3a", "#1a1a1a", "#fafaf7"],
            ["#1e3a5f", "#b8956a", "#1a1a1a", "#fafafa"],
            ["#2d4a3e", "#c4633f", "#1a1a1a", "#f5f1e8"],
            ["#3d3024", "#a87d4f", "#1a1a1a", "#f0ede4"],
            ["#0d3b66", "#d62828", "#1a1a1a", "#ffffff"],
            ["#1a1a1a", "#c9a227", "#0a0a0a", "#f5f5f0"],
          ]}
          onChange={(v) => setTweak("palette", v)} />

        <TweakSection label="Typographie" />
        <TweakSelect label="Titres" value={t.headingFont}
          options={["Instrument Serif", "Fraunces", "Cormorant Garamond", "Playfair Display", "Public Sans"]}
          onChange={(v) => setTweak("headingFont", v)} />
        <TweakSelect label="Corps" value={t.bodyFont}
          options={["Public Sans", "Inter", "IBM Plex Sans", "Source Sans 3", "Work Sans"]}
          onChange={(v) => setTweak("bodyFont", v)} />

        <TweakSection label="Indicateurs (Bilan)" />
        <TweakRadio label="Format" value={t.kpiFormat}
          options={["jauges", "notes", "feux"]}
          onChange={(v) => setTweak("kpiFormat", v)} />

        <TweakSection label="Cartes" />
        <TweakRadio label="Style" value={t.cardStyle}
          options={["bordered", "shadow", "filled"]}
          onChange={(v) => setTweak("cardStyle", v)} />

        <TweakSection label="Ton éditorial" />
        <TweakRadio label="Ton" value={t.tone}
          options={["engage", "institutionnel"]}
          onChange={(v) => setTweak("tone", v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
