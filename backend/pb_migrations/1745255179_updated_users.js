/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("t7gxhibvatgo74j")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_5zj10xJ` ON `users` (`username`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("t7gxhibvatgo74j")

  collection.indexes = []

  return dao.saveCollection(collection)
})
