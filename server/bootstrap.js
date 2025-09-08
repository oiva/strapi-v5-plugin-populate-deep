"use strict";
const { getFullPopulateObject } = require("./helpers");

module.exports = ({ strapi }) => {
  // Subscribe to the lifecycles that we are intrested in.
  strapi.db.lifecycles.subscribe((event) => {
    if (event.action === "beforeFindMany" || event.action === "beforeFindOne") {
      const level = event.params?.pLevel;
      const includeDuplicatesParam = event.params?.includeDuplicates;

      const defaultDepth =
        strapi
          .plugin("strapi-v5-plugin-populate-deep")
          ?.config("defaultDepth") || 5;

      const defaultIncludeDuplicates =
        strapi
          .plugin("strapi-v5-plugin-populate-deep")
          ?.config("includeDuplicates") || false;

      if (level !== undefined) {
        const depth = level ?? defaultDepth;
        const includeDuplicates =
          includeDuplicatesParam !== undefined
            ? includeDuplicatesParam !== "false"
            : defaultIncludeDuplicates;
        const modelObject = getFullPopulateObject(event.model.uid, depth, [], includeDuplicates);
        event.params.populate = modelObject.populate;
      }
    }
  });
};
