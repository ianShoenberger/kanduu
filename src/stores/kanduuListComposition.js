import { defineStore } from "pinia";
import { ref } from "vue";
import { useIndexedDb } from "./indexedDb";

const indexedDb = useIndexedDb();

class KanduuModel {  
  constructor(newId, name, parent, isLeaf = false) {
    this.id = newId
    this.name = name
    this.completed = false
    this.items = []
    this.parent = parent
    this.dateCreated = Date.now()
    this.dateModified = Date.now()
    this.datesDone = []
    this.show = true
    this.isLeaf = isLeaf
  }
}

function createPlainKanduu(kanduu) {
  // vue is adding other kinds of data to the object
  const plainKanduu = { ...kanduu };
  plainKanduu.items = [...kanduu.items];
  plainKanduu.datesDone = [...kanduu.datesDone]
  return plainKanduu;
}

export const useKanduuListStore = defineStore("kanduuList", () => {
  // state
  const kanduuList = ref([]);
  const id = ref(0);
  // getters
  async function getKanduuList() {
    // -- this really isn't a getter since it's not a computed
    const kanduus = await indexedDb.getKanduuStore();
    kanduuList.value = kanduus;
    if (kanduus.length) {
      id.value = kanduus[kanduus.length - 1].id + 1;
    }
    return kanduuList;
  }
  async function getKanduu(kanduuId) {
    // this primes the store
    await getKanduuList();
    const kanduu = kanduuList.value.find((kanduu) => kanduu.id === kanduuId);
    return kanduu;
  }

  async function getKanduuChildren(parentKanduuId) {
    await getKanduuList();
    const children = kanduuList.value.filter((kanduu) => kanduu.parent === parentKanduuId)
    return children;
  }
  // actions
  async function addKanduu(name, parent = null) {
    const newKanduu = new KanduuModel(id.value++, name, parent);
    kanduuList.value.push(newKanduu);
    await indexedDb.saveKanduu(newKanduu);
    return newKanduu;
  }
  async function deleteKanduu(itemId) {
    kanduuList.value = kanduuList.value.filter((kanduu) => kanduu.id !== itemId);
    await indexedDb.deleteKanduu(itemId);
  }
  async function toggleCompleted(idToFind) {
    const kanduu = kanduuList.value.find((obj) => obj.id === idToFind);
    if (kanduu) {
      kanduu.completed = !kanduu.completed;
    }
    const plainKanduu = createPlainKanduu(kanduu);
    await indexedDb.saveKanduu(plainKanduu);
  }
  async function duuKanduu(itemId) {
    const kanduu = kanduuList.value.find((obj) => obj.id === itemId);
    if (kanduu) {
      kanduu.datesDone.push(Date.now());
    }
    const plainKanduu = createPlainKanduu(kanduu);
    await indexedDb.saveKanduu(plainKanduu);
  }
  async function editName(idToFind, newName) {
    const kanduu = kanduuList.value.find((obj) => obj.id === idToFind);
    if (kanduu) {
      kanduu.name = newName;
    }
    const plainKanduu = createPlainKanduu(kanduu);
    await indexedDb.saveKanduu(plainKanduu);
  }
  async function addCategoryItem(idToFind, newItem) {
    const kanduu = kanduuList.value.find((obj) => obj.id === idToFind);
    if (kanduu) {
      const newCategoryItem = await addKanduu(newItem, idToFind);
      const plainKanduu = createPlainKanduu(kanduu);
      if (plainKanduu.items) {
        plainKanduu.items = [...plainKanduu.items, newCategoryItem.id];
        kanduu.items.push(newCategoryItem.id); // also save the new item on the 'ref'
      } else {
        plainKanduu.items = [newCategoryItem.id];
        kanduu.items = [newCategoryItem.id];
      }
      await indexedDb.saveKanduu(plainKanduu);
    }
  }
  return {
    kanduuList,
    getKanduuList,
    getKanduu,
    getKanduuChildren,
    id,
    addKanduu,
    deleteKanduu,
    toggleCompleted,
    duuKanduu,
    editName,
    addCategoryItem,
  };
});
