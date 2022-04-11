import _ from "lodash";
import type { Collection, Db, MongoClient } from "mongodb";
import type { Timestamps } from "./types";
export interface Page extends Timestamps {
  _id: string;
  name: string;
  text: Record<string, string>;
  pictures: Record<string, string | null>;
}

export interface HomePage extends Page {
  _id: "/",
  name: "Accueil"
  text: {
    "presentation": string,
    "eshop-description": string,
    google: string
  },
  pictures: {
    discover: string | null,
    move: string | null,
    "e-shop": string | null,
    "realisation-1": string | null,
    "realisation-2": string | null,
    "realisation-3": string | null,
    "realisation-4": string | null,
    "realisation-5": string | null,
    "realisation-6": string | null,
    "realisation-7": string | null,
    "realisation-8": string | null,
    "realisation-9": string | null,
    "realisation-10": string | null,
  }
}

export interface CreationsPage extends Page {
  _id: "/realisations",
  name: "Réalisations",
  text: {
    google: string,
    "realisation-1": string,
    "realisation-2": string,
    "realisation-3": string,
    "realisation-4": string,
    "realisation-5": string,
    "realisation-6": string,
    "realisation-7": string,
    "realisation-8": string,
    "realisation-9": string,
    "realisation-10": string,
  },
  pictures: {
    "realisation-1": string | null,
    "realisation-2": string | null,
    "realisation-3": string | null,
    "realisation-4": string | null,
    "realisation-5": string | null,
    "realisation-6": string | null,
    "realisation-7": string | null,
    "realisation-8": string | null,
    "realisation-9": string | null,
    "realisation-10": string | null,
  }
}

export interface ContactPage extends Page {
  _id: "/contact",
  name: "Contact",
  text: {
    description: string,
    google: string
  }
}

export interface WorkshopPage extends Page {
  _id: "/atelier",
  name: "L'Atelier"
  text: {
    google: string,
    "texte-1": string,
    "texte-2": string,
  },
  pictures: {
    "photo-1": string | null,
    "photo-2": string | null,
    "photo-3": string | null,
  }
}

export interface EshopPage extends Page {
  _id: "/vente",
  name: "E-shop",
  text: {
    google: string
  },
  pictures: {

  }
}

export const defaultPages = {
  "/": {
    _id: "/",
    name: "Accueil",
    text: {
      "presentation": `C'est dans son univers enchanteur que Daphné le Couls, tapissière d'ameublement qualifiée depuis 2019, vous propose la réfection de vos assises dans son atelier situé en Finistère, à logonna Daoulas (entre l'axe Brest Quimper).

Daphné se déplace à votre domicile afin de déterminer avec vous vos besoins, qu'il s'agisse d'une réfection de siège complète, ou bien de la création de coussins décoratifs. 

À l'atelier, nous vous proposons la réfection traditionnelle ou moderne de vos assises (crin ou mousse) selon vos besoins.

Nous vous proposons un service en ligne afin de concevoir à distance des coussins, et de vous les livrer n'importe où en France. 

Nous proposons à la vente également des assises déjà refectionnées dans la partie E-shop. 

Des tissus rigoureusement sélectionnés vous seront proposés pour habiller vos sièges/coussins. Mais vous êtes libre de commander du tissus pour vos projets personnels également. n'hésitez pas à regarder notre onglet tissus. 

Daphné ne travaille que sur rendez vous, alors n'hésitez pas à la contacter, par téléphone ou par mail pour toute demande.`,
      "eshop-description": "description de l'eshop",
      google: `C'est dans son univers enchanteur que Daphné le Couls, tapissière d'ameublement qualifiée depuis 2019, vous propose la réfection de vos assises dans son atelier situé en Finistère, à logonna Daoulas (entre l'axe Brest Quimper).

Daphné se déplace à votre domicile afin de déterminer avec vous vos besoins, qu'il s'agisse d'une réfection de siège complète, ou bien de la création de coussins décoratifs.`
    },
    pictures: {
      discover: null,
      move: null,
      "e-shop": null,
      "realisation-1": null,
      "realisation-2": null,
      "realisation-3": null,
      "realisation-4": null,
      "realisation-5": null,
      "realisation-6": null,
      "realisation-7": null,
      "realisation-8": null,
      "realisation-9": null,
      "realisation-10": null,
    }
  } as HomePage,
  "/contact": {
    _id: "/contact",
    name: "Contact",
    text: {"description": "Je me déplace à votre domicile dans le Finistère sur rendez-vous.", google: "Je me déplace à votre domicile dans le Finistère sur rendez-vous."},
    pictures: {}
  } as ContactPage,
  "/atelier": {
    _id: "/atelier",
    name: "L'Atelier",
    text: {
      "texte-1": `C'est dans son univers enchanteur que Daphné le Couls, tapissière d'ameublement qualifiée depuis 2019, vous propose la réfection de vos assises dans son atelier situé en Finistère, à logonna Daoulas (entre l'axe Brest Quimper).

Daphné se déplace à votre domicile afin de déterminer avec vous vos besoins, qu'il s'agisse d'une réfection de siège complète, ou bien de la création de coussins décoratifs. 

À l'atelier, nous vous proposons la réfection traditionnelle ou moderne de vos assises (crin ou mousse) selon vos besoins.`,
      "texte-2": `Nous vous proposons un service en ligne afin de concevoir à distance des coussins, et de vous les livrer n'importe où en France. 

Nous proposons à la vente également des assises déjà refectionnées dans la partie E-shop.`,
      google: "À l'atelier, nous vous proposons la réfection traditionnelle ou moderne de vos assises (crin ou mousse) selon vos besoins."
    },
    pictures: {
      "photo-1": null,
      "photo-2": null,
      "photo-3": null,
    }
  },
  "/realisations": {
    _id: "/realisations",
    name: "Réalisations",
    text: {
      google: "Admirez les sièges, fauteuils et coussins réalisés par Daphné, tapissière d'ameublement de la Bergère Enchantée",
      "realisation-1": "",
      "realisation-2": "",
      "realisation-3": "",
      "realisation-4": "",
      "realisation-5": "",
      "realisation-6": "",
      "realisation-7": "",
      "realisation-8": "",
      "realisation-9": "",
      "realisation-10": "",
    },
    pictures: {
      "realisation-1": null,
      "realisation-2": null,
      "realisation-3": null,
      "realisation-4": null,
      "realisation-5": null,
      "realisation-6": null,
      "realisation-7": null,
      "realisation-8": null,
      "realisation-9": null,
      "realisation-10": null,
    }
  } as CreationsPage,
  "/vente": {
    _id: "/vente",
    name: "E-shop",
    text: {
      google: "Liste des fauteuils, chaises, coussins... réalisés par Daphné et disponibles à la vente"
    },
    pictures: {

    }
  } as EshopPage
};

export let pages = defaultPages;

async function refreshPages(coll: Collection<Page>) {
  const dbPages = _.keyBy(await coll.find({}).toArray(), "_id");
  pages = _.merge({}, defaultPages, dbPages);
}

export function createPageCollection(db: Db, client: MongoClient): Collection<Page> {
  const coll = db.collection<Page>("pages");
  
  client.on("open", () => {
    refreshPages(coll).catch(console.error);

    coll.watch().on("change", () => {
      refreshPages(coll).catch(console.error);
    });
  });
  
  return coll;
}