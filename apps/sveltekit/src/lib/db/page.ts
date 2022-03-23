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
    "eshop-description": string
  },
  pictures: {
    discover: string | null,
    move: string | null,
    "e-shop": string | null
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
      "eshop-description": "description de l'eshop"
    },
    pictures: {
      discover: null,
      move: null,
      "e-shop": null,
    }
  } as HomePage
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