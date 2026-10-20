// The words on each App Store screenshot, by language. screens.html shows one
// language at a time (screens.html?lang=fr) and `npm run export` renders every
// language listed here. <br> is a line break and <strong> sets words in bold;
// a line a language leaves out falls back to English.
window.COPY = {
	en: {
		// The product page header (header.html), not a screenshot. Every
		// language uses this English one.
		header: {
			tag: 'skelly',
			headline: 'Surf the web<br>in bare bones',
		},
		hero: {
			tag: 'skelly',
			headline: 'Surf the web<br>in bare bones',
			sub: 'The browser that strips websites<br>down to the bone.',
		},
		bareBones: {
			tag: 'bare bones',
			headline: 'No ads. No trackers.<br>No pop-ups.',
			sub: 'JavaScript is off by default.<br><strong>Skelly clears away most of the clutter<br>that gets between you and what<br>you came to read.</strong>',
		},
		home: {
			tag: 'quick dial & news',
			headline: 'Your news,<br>one tap away',
			sub: 'Pin your favorite sites and catch up<br>on all of them in one <strong>feed</strong>.',
		},
		reader: {
			tag: 'reader',
			headline: 'Just the<br>article',
			sub: 'Pick your font and <strong>theme</strong>, or save<br>the article to read <strong>offline</strong>.',
		},
		listen: {
			tag: 'read aloud',
			headline: 'Turn your news<br>into a podcast',
			sub: 'Sit back and let Skelly read<br><strong>any page</strong> to you.',
		},
		privacy: {
			tag: 'privacy first',
			headline: 'Collects<br>nothing',
			sub: 'Zero data collected. Not even analytics.<br><strong>What you read in Skelly is yours.</strong>',
		},
	},
	// Neutral Spanish (tú, no Spain-only words), so one set serves Spain and
	// Latin America. Terms follow the app's own Spanish: Lector, Escuchar,
	// tipo de letra, sin conexión; "Bare Bones" stays in English as in the app.
	es: {
		hero: {
			tag: 'skelly',
			headline: 'Surfea la web<br>en los huesos',
			sub: 'El navegador que deja cada web<br>en lo esencial.',
		},
		bareBones: {
			tag: 'bare bones',
			headline: 'Adiós a anuncios,<br>rastreo y pop-ups',
			sub: 'JavaScript está desactivado por defecto.<br><strong>Skelly quita casi todo lo que<br>se interpone entre tú y lo que<br>quieres leer.</strong>',
		},
		home: {
			tag: 'acceso rápido y noticias',
			headline: 'Tus noticias,<br>a un toque',
			sub: 'Fija tus sitios favoritos y ponte al día<br>con todos en un solo <strong>feed</strong>.',
		},
		reader: {
			tag: 'lector',
			headline: 'Solo el<br>artículo',
			sub: 'Elige el tipo de letra y el <strong>tema</strong>,<br>o guárdalo para leerlo <strong>sin conexión</strong>.',
		},
		listen: {
			tag: 'escuchar',
			headline: 'Escucha tus noticias<br>como un podcast',
			sub: 'Relájate y deja que Skelly te lea<br><strong>cualquier página</strong>.',
		},
		privacy: {
			tag: 'privacidad primero',
			headline: 'No recopila<br>nada',
			sub: 'Cero datos. Ni siquiera analíticas.<br><strong>Lo que lees en Skelly es solo tuyo.</strong>',
		},
	},
	// Terms follow the app's own Italian: Lettore, Ascolta, font, offline.
	it: {
		hero: {
			tag: 'skelly',
			headline: 'Naviga il web<br>ridotto all’osso',
			sub: 'Il browser che lascia di ogni sito<br>solo l’essenziale.',
		},
		bareBones: {
			tag: 'bare bones',
			headline: 'Niente pubblicità,<br>tracker e pop-up',
			sub: 'JavaScript è disattivato di default.<br><strong>Skelly toglie quasi tutto ciò che<br>si mette tra te e quello che<br>vuoi leggere.</strong>',
		},
		home: {
			tag: 'accesso rapido e notizie',
			headline: 'Le tue notizie,<br>a portata di tocco',
			sub: 'Fissa i tuoi siti preferiti e seguili<br>tutti in un unico <strong>feed</strong>.',
		},
		reader: {
			tag: 'lettore',
			headline: 'Solo<br>l’articolo',
			sub: 'Scegli il font e il <strong>tema</strong>, o salva<br>l’articolo per leggerlo <strong>offline</strong>.',
		},
		listen: {
			tag: 'ascolta',
			headline: 'Le tue notizie<br>come un podcast',
			sub: 'Rilassati e lascia che Skelly ti legga<br><strong>qualsiasi pagina</strong>.',
		},
		privacy: {
			tag: 'privacy prima di tutto',
			headline: 'Non raccoglie<br>nulla',
			sub: 'Zero dati raccolti. Nemmeno statistiche.<br><strong>Quello che leggi su Skelly è solo tuo.</strong>',
		},
	},
	// Addressed as "vous", as App Store French usually is. Terms follow the
	// app's own French: Lecteur, Écouter, police, hors ligne.
	fr: {
		hero: {
			tag: 'skelly',
			headline: 'Surfez sur le web<br>jusqu’à l’os',
			sub: 'Le navigateur qui réduit chaque site<br>à l’essentiel.',
		},
		bareBones: {
			tag: 'bare bones',
			headline: 'Ni pubs, ni pisteurs,<br>ni pop-ups',
			sub: 'JavaScript est désactivé par défaut.<br><strong>Skelly retire presque tout ce qui<br>se dresse entre vous et ce que<br>vous venez lire.</strong>',
		},
		home: {
			tag: 'accès rapide et actus',
			headline: 'Vos actus,<br>en un geste',
			sub: 'Épinglez vos sites préférés et suivez-les<br>tous dans un seul <strong>fil</strong>.',
		},
		reader: {
			tag: 'lecteur',
			headline: 'Juste<br>l’article',
			sub: 'Choisissez la police et le <strong>thème</strong>,<br>ou gardez-le pour le lire <strong>hors ligne</strong>.',
		},
		listen: {
			tag: 'écouter',
			headline: 'Vos actus<br>en podcast',
			sub: 'Installez-vous et laissez Skelly<br>vous lire <strong>n’importe quelle page</strong>.',
		},
		privacy: {
			tag: 'confidentialité d’abord',
			headline: 'Ne collecte<br>rien',
			sub: 'Aucune donnée collectée. Aucune statistique.<br><strong>Ce que vous lisez dans Skelly reste à vous.</strong>',
		},
	},
	// Addressed as "du", as most consumer apps in the German App Store are.
	// Terms follow the app's own German: Reader, Anhören, Schrift, offline.
	de: {
		hero: {
			tag: 'skelly',
			headline: 'Surf durchs Web<br>bis auf die Knochen',
			sub: 'Der Browser, der jede Website<br>aufs Wesentliche reduziert.',
		},
		bareBones: {
			tag: 'bare bones',
			headline: 'Ohne Werbung,<br>Tracker und Pop-ups',
			sub: 'JavaScript ist standardmäßig aus.<br><strong>Skelly räumt fast alles weg, was<br>zwischen dir und dem steht,<br>was du lesen willst.</strong>',
		},
		home: {
			tag: 'schnellzugriff & news',
			headline: 'Deine News,<br>nur einen Tipp entfernt',
			sub: 'Pinne deine Lieblingsseiten und lies<br>sie alle in einem einzigen <strong>Feed</strong>.',
		},
		reader: {
			tag: 'reader',
			headline: 'Nur der<br>Artikel',
			sub: 'Wähle Schrift und <strong>Design</strong>, oder speichere<br>den Artikel, um ihn <strong>offline</strong> zu lesen.',
		},
		listen: {
			tag: 'anhören',
			headline: 'Deine News<br>als Podcast',
			sub: 'Lehn dich zurück und lass dir von Skelly<br><strong>jede Seite</strong> vorlesen.',
		},
		privacy: {
			tag: 'privatsphäre zuerst',
			headline: 'Sammelt<br>nichts',
			sub: 'Null Daten. Nicht mal Statistiken.<br><strong>Was du in Skelly liest, gehört nur dir.</strong>',
		},
	},
	// Addressed as "je", the usual tone in Dutch apps. Terms follow the app's
	// own Dutch: Lezer, Luister, lettertype, offline.
	nl: {
		hero: {
			tag: 'skelly',
			headline: 'Surf het web<br>tot op het bot',
			sub: 'De browser die elke website<br>terugbrengt tot de kern.',
		},
		bareBones: {
			tag: 'bare bones',
			headline: 'Geen advertenties,<br>trackers of pop-ups',
			sub: 'JavaScript staat standaard uit.<br><strong>Skelly haalt bijna alles weg wat<br>tussen jou en wat je wilt<br>lezen in staat.</strong>',
		},
		home: {
			tag: 'snelkeuze & nieuws',
			headline: 'Je nieuws,<br>met één tik',
			sub: 'Zet je favoriete sites vast en volg ze<br>allemaal in één <strong>feed</strong>.',
		},
		reader: {
			tag: 'lezer',
			headline: 'Alleen het<br>artikel',
			sub: 'Kies je lettertype en <strong>thema</strong>, of bewaar<br>het artikel om <strong>offline</strong> te lezen.',
		},
		listen: {
			tag: 'luister',
			headline: 'Je nieuws<br>als podcast',
			sub: 'Leun achterover en laat Skelly<br><strong>elke pagina</strong> voorlezen.',
		},
		privacy: {
			tag: 'privacy voorop',
			headline: 'Verzamelt<br>niets',
			sub: 'Geen data verzameld. Zelfs geen statistieken.<br><strong>Wat je in Skelly leest, is van jou.</strong>',
		},
	},
};
