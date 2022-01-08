'use strict';

/**
 * fabric-store service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::fabric-store.fabric-store');
