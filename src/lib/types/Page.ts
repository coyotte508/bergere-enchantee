import type { Timestamps } from './Timestamps';

export interface Page extends Timestamps {
	_id: string;
	name: string;
	text: Record<string, string | undefined>;
	pictures: Record<string, string | null | undefined>;
}

export interface HomePage extends Page {
	_id: '/';
	name: "Bergère Enchantée - Tapisserie d'ameublement";
	text: {
		presentation: string;
		'eshop-description': string;
		'search-engine-description': string;
	};
	pictures: {
		discover: string | null;
		move: string | null;
		'e-shop': string | null;
	} & Partial<Record<`realisation-${number}`, string | null>>;
}

export interface CreationsPage extends Page {
	_id: '/realisations';
	name: 'Réalisations';
	text: {
		'search-engine-description': string;
	} & Partial<Record<`realisation-${number}`, string>>;
	pictures: Partial<Record<`realisation-${number}`, string | null>>;
}

export interface FabricsPage extends Page {
	_id: '/tissus-et-finitions';
	name: 'Tissus et finitions';
	text: {
		'search-engine-description': string;
	};
	pictures: {
		'photo-1': string | null;
		'photo-2': string | null;
		'photo-3': string | null;
		'photo-4': string | null;
		'photo-5': string | null;
		'photo-6': string | null;
		'photo-7': string | null;
		'photo-8': string | null;
		'photo-9': string | null;
		'photo-10': string | null;
		'photo-11': string | null;
		'photo-12': string | null;
		'photo-13': string | null;
		'photo-14': string | null;
		'photo-15': string | null;
		'photo-16': string | null;
		'photo-17': string | null;
		'photo-18': string | null;
		'photo-19': string | null;
		'photo-20': string | null;
		'photo-21': string | null;
		'photo-22': string | null;
		'photo-23': string | null;
		'photo-24': string | null;
		'photo-25': string | null;
		'photo-26': string | null;
		'photo-27': string | null;
		'photo-28': string | null;
		'photo-29': string | null;
		'photo-30': string | null;
	};
}

export interface ContactPage extends Page {
	_id: '/contact';
	name: 'Contact';
	text: {
		description: string;
		'search-engine-description': string;
	};
	pictures: {
		'photo-garde': string | null;
	};
}

export interface WorkshopPage extends Page {
	_id: '/atelier';
	name: "L'Atelier";
	text: {
		'search-engine-description': string;
		'texte-1': string;
		'texte-2': string;
	};
	pictures: {
		'photo-1': string | null;
		'photo-2': string | null;
		'photo-3': string | null;
	};
}

export interface PricingPage extends Page {
	_id: '/tarifs';
	name: 'Tarifs';
	text: {
		'search-engine-description': string;
	} & Partial<
		Record<
			`${'remplacement-tissu' | 'refection-complete' | 'coussin' | 'refection-partielle'}-${number}-${'prix' | 'titre'}`,
			string
		>
	>;
	pictures: {
		'remplacement-tissu': string | null;
		'refection-complete': string | null;
		'refection-partielle': string | null;
		coussin: string | null;
	};
}

export interface EshopPage extends Page {
	_id: '/e-shop';
	name: string;
	text: {
		'search-engine-description': string;
	};
	pictures: {
		background: string | null;
	};
}
