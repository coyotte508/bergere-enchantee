import type {
	ContactPage,
	CreationsPage,
	EshopPage,
	FabricsPage,
	HomePage,
	Page
} from '$lib/types/Page';
import _ from 'lodash';
import type { Collection, Db, MongoClient } from 'mongodb';

export const defaultPages = {
	'/': {
		_id: '/',
		name: "Bergère Enchantée - Tapisserie d'ameublement",
		text: {
			presentation: `C'est dans son univers enchanteur que Daphné le Couls, tapissière d'ameublement qualifiée depuis 2019, vous propose la réfection de vos assises dans son atelier situé en Finistère, à logonna Daoulas (entre l'axe Brest Quimper).

Daphné se déplace à votre domicile afin de déterminer avec vous vos besoins, qu'il s'agisse d'une réfection de siège complète, ou bien de la création de coussins décoratifs. 

À l'atelier, nous vous proposons la réfection traditionnelle ou moderne de vos assises (crin ou mousse) selon vos besoins.

Nous vous proposons un service en ligne afin de concevoir à distance des coussins, et de vous les livrer n'importe où en France. 

Nous proposons à la vente également des assises déjà refectionnées dans la partie E-shop. 

Des tissus rigoureusement sélectionnés vous seront proposés pour habiller vos sièges/coussins. Mais vous êtes libre de commander du tissus pour vos projets personnels également. n'hésitez pas à regarder notre onglet tissus. 

Daphné ne travaille que sur rendez vous, alors n'hésitez pas à la contacter, par téléphone ou par mail pour toute demande.`,
			'eshop-description': "description de l'eshop",
			description: `C'est dans son univers enchanteur que Daphné le Couls, tapissière d'ameublement qualifiée depuis 2019, vous propose la réfection de vos assises dans son atelier situé en Finistère, à logonna Daoulas (entre l'axe Brest Quimper).

Daphné se déplace à votre domicile afin de déterminer avec vous vos besoins, qu'il s'agisse d'une réfection de siège complète, ou bien de la création de coussins décoratifs.`
		},
		pictures: {
			discover: null,
			move: null,
			'e-shop': null,
			'realisation-1': null,
			'realisation-2': null,
			'realisation-3': null,
			'realisation-4': null,
			'realisation-5': null,
			'realisation-6': null,
			'realisation-7': null,
			'realisation-8': null,
			'realisation-9': null,
			'realisation-10': null
		}
	} as HomePage,
	'/contact': {
		_id: '/contact',
		name: 'Contact',
		text: {
			description: 'Je me déplace à votre domicile dans le Finistère sur rendez-vous.'
		},
		pictures: {
			'photo-garde': null
		}
	} as ContactPage,
	'/atelier': {
		_id: '/atelier',
		name: "L'Atelier",
		text: {
			'texte-1': `C'est dans son univers enchanteur que Daphné le Couls, tapissière d'ameublement qualifiée depuis 2019, vous propose la réfection de vos assises dans son atelier situé en Finistère, à logonna Daoulas (entre l'axe Brest Quimper).

Daphné se déplace à votre domicile afin de déterminer avec vous vos besoins, qu'il s'agisse d'une réfection de siège complète, ou bien de la création de coussins décoratifs. 

À l'atelier, nous vous proposons la réfection traditionnelle ou moderne de vos assises (crin ou mousse) selon vos besoins.`,
			'texte-2': `Nous vous proposons un service en ligne afin de concevoir à distance des coussins, et de vous les livrer n'importe où en France. 

Nous proposons à la vente également des assises déjà refectionnées dans la partie E-shop.`,
			description:
				"À l'atelier, nous vous proposons la réfection traditionnelle ou moderne de vos assises (crin ou mousse) selon vos besoins."
		},
		pictures: {
			'photo-1': null,
			'photo-2': null,
			'photo-3': null
		}
	},
	'/realisations': {
		_id: '/realisations',
		name: 'Réalisations',
		text: {
			description:
				"Découvrez les sièges, fauteuils et coussins réalisés par Daphné, tapissière d'ameublement de la Bergère Enchantée",
			'realisation-1': '',
			'realisation-2': '',
			'realisation-3': '',
			'realisation-4': '',
			'realisation-5': '',
			'realisation-6': '',
			'realisation-7': '',
			'realisation-8': '',
			'realisation-9': '',
			'realisation-10': ''
		},
		pictures: {
			'realisation-1': null,
			'realisation-2': null,
			'realisation-3': null,
			'realisation-4': null,
			'realisation-5': null,
			'realisation-6': null,
			'realisation-7': null,
			'realisation-8': null,
			'realisation-9': null,
			'realisation-10': null
		}
	} as CreationsPage,
	'/tissus-et-finitions': {
		_id: '/tissus-et-finitions',
		name: 'Tissus et finitions',
		pictures: {
			'photo-1': null,
			'photo-2': null,
			'photo-3': null,
			'photo-4': null,
			'photo-5': null,
			'photo-6': null,
			'photo-7': null,
			'photo-8': null,
			'photo-9': null,
			'photo-10': null,
			'photo-11': null,
			'photo-12': null,
			'photo-13': null,
			'photo-14': null,
			'photo-15': null
		},
		text: {
			description:
				"Découvrez les finitions et tissus utilisés par Daphné, tapissière d'ameublement de la Bergère Enchantée"
		}
	} as FabricsPage,
	'/vente': {
		_id: '/vente',
		name: 'E-shop',
		text: {
			description:
				'Liste des fauteuils, chaises, coussins... réalisés par Daphné et disponibles à la vente'
		},
		pictures: {
			background: null
		}
	} as EshopPage
};

export let pages = defaultPages;

async function refreshPages(coll: Collection<Page>) {
	const dbPages = _.keyBy(await coll.find({}).toArray(), '_id');
	pages = _.merge({}, defaultPages, dbPages);
}

export function createPageCollection(db: Db, client: MongoClient): Collection<Page> {
	const coll = db.collection<Page>('pages');

	client.on('open', () => {
		refreshPages(coll).catch(console.error);

		coll.watch().on('change', () => {
			refreshPages(coll).catch(console.error);
		});
	});

	return coll;
}