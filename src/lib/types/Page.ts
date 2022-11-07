import type { Timestamps } from './Timestamps';

export interface Page extends Timestamps {
	_id: string;
	name: string;
	text: Record<string, string>;
	pictures: Record<string, string | null>;
}

export interface HomePage extends Page {
	_id: '/';
	name: "Bergère Enchantée - Tapisserie d'ameublement";
	text: {
		presentation: string;
		'eshop-description': string;
		description: string;
	};
	pictures: {
		discover: string | null;
		move: string | null;
		'e-shop': string | null;
		'realisation-1': string | null;
		'realisation-2': string | null;
		'realisation-3': string | null;
		'realisation-4': string | null;
		'realisation-5': string | null;
		'realisation-6': string | null;
		'realisation-7': string | null;
		'realisation-8': string | null;
		'realisation-9': string | null;
		'realisation-10': string | null;
	};
}

export interface CreationsPage extends Page {
	_id: '/realisations';
	name: 'Réalisations';
	text: {
		description: string;
		'realisation-1': string;
		'realisation-2': string;
		'realisation-3': string;
		'realisation-4': string;
		'realisation-5': string;
		'realisation-6': string;
		'realisation-7': string;
		'realisation-8': string;
		'realisation-9': string;
		'realisation-10': string;
	};
	pictures: {
		'realisation-1': string | null;
		'realisation-2': string | null;
		'realisation-3': string | null;
		'realisation-4': string | null;
		'realisation-5': string | null;
		'realisation-6': string | null;
		'realisation-7': string | null;
		'realisation-8': string | null;
		'realisation-9': string | null;
		'realisation-10': string | null;
	};
}

export interface FabricsPage {
	_id: '/tissus-et-finitions';
	name: 'Tissus et finitions';
	text: {
		description: string;
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
	};
}

export interface ContactPage extends Page {
	_id: '/contact';
	name: 'Contact';
	text: {
		description: string;
	};
	pictures: {
		'photo-garde': string | null;
	};
}

export interface WorkshopPage extends Page {
	_id: '/atelier';
	name: "L'Atelier";
	text: {
		description: string;
		'texte-1': string;
		'texte-2': string;
	};
	pictures: {
		'photo-1': string | null;
		'photo-2': string | null;
		'photo-3': string | null;
	};
}

export interface EshopPage extends Page {
	_id: '/vente';
	name: 'E-shop';
	text: {
		description: string;
	};
	pictures: {
		background: string | null;
	};
}
