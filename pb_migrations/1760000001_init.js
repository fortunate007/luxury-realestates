migrate((db) => {
  const dao = new Dao(db);
  const users = dao.findCollectionByNameOrId("users");
  users.schema.addField(new SchemaField({ name: "role", type: "select", options: { maxSelect: 1, values: ["agent", "manager"] } }));
  users.schema.addField(new SchemaField({ name: "phone", type: "text" }));
  users.createRule = null; // only the owner can create agent accounts
  dao.saveCollection(users);

  const own = "@request.auth.id != '' && (owner = @request.auth.id || @request.auth.role = 'manager')";
  const num = (name) => ({ name, type: "number", options: { min: 0 } });
  const listings = new Collection({
    id: "rlistings000001", name: "listings", type: "base",
    schema: [
      { name: "title", type: "text", required: true },
      num("price"),
      { name: "type", type: "select", options: { maxSelect: 1, values: ["sale", "rent", "land", "commercial"] } },
      { name: "status", type: "select", options: { maxSelect: 1, values: ["available", "sold", "rented", "hidden"] } },
      { name: "location", type: "text" }, num("size"), num("bedrooms"), num("bathrooms"),
      { name: "description", type: "text" },
      { name: "image", type: "file", options: { maxSelect: 1, maxSize: 5242880, mimeTypes: ["image/jpeg", "image/png", "image/webp"], thumbs: [] } },
      { name: "featured", type: "bool" },
      { name: "offer", type: "bool" }, num("old_price"), { name: "offer_note", type: "text" },
      { name: "owner", type: "relation", options: { collectionId: users.id, cascadeDelete: false, minSelect: null, maxSelect: 1, displayFields: null } },
    ],
    listRule: "status != 'hidden' || (" + own + ")",
    viewRule: "status != 'hidden' || (" + own + ")",
    createRule: "@request.auth.id != '' && @request.data.owner = @request.auth.id",
    updateRule: own, deleteRule: own,
  });
  dao.saveCollection(listings);

  const inq = "@request.auth.id != '' && (listing.owner = @request.auth.id || @request.auth.role = 'manager')";
  const inquiries = new Collection({
    id: "rinquiries00001", name: "inquiries", type: "base",
    schema: [
      { name: "name", type: "text", required: true }, { name: "email", type: "email" }, { name: "phone", type: "text" },
      { name: "message", type: "text" }, { name: "handled", type: "bool" },
      { name: "listing", type: "relation", options: { collectionId: listings.id, cascadeDelete: false, minSelect: null, maxSelect: 1, displayFields: null } },
    ],
    listRule: inq, viewRule: inq, createRule: "", updateRule: inq, deleteRule: null,
  });
  return dao.saveCollection(inquiries);
}, (db) => {
  const dao = new Dao(db);
  ["inquiries", "listings"].forEach((n) => { try { dao.deleteCollection(dao.findCollectionByNameOrId(n)); } catch (e) {} });
});
