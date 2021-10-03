let db = null;
let objectStore = null;
let dbOpenRequest = indexedDB.open("test-db2", 8);

dbOpenRequest.addEventListener("error", (err) => {
  console.warn(err);
});

dbOpenRequest.addEventListener("success", (event) => {
  db = event.target.result;
  console.log("sukses", db);
  buildList();
});

dbOpenRequest.addEventListener("upgradeneeded", (event) => {
  db = event.target.result;
  console.log("upgrade", db);

  if (!db.objectStoreNames.contains("dataStore")) {
    // db.deleteObjectStore("dataStore");

    objectStore = db.createObjectStore("dataStore", {
      keyPath: "id",
    });

    objectStore.createIndex("hasilIdx", "hasil", { unique: false });
    objectStore.createIndex("kalkulasiIdx", "kalkulasi", { unique: false });
  }
});

function buildList() {
  const list = document.querySelector(".list-item");
  const tx = makeTransaction("dataStore", "readonly");
  const store = tx.objectStore("dataStore");
  const range = IDBKeyRange.lowerBound(15, true);
  const index = store.index("kalkulasiIdx");
  const getReq = index.getAll(range);

  getReq.onsuccess = (ev) => {
    const request = ev.target.result;
    const data = request.map((result) => {
      return `<li data-key="${result.id}">
      <span>${result.kalkulasi} = ${result.hasil}</span>
        <div class="aksi">
          <button class="edit" onclick="editData(event)">Edit</button>
          <button class="hapus" onclick="removeData(event)">Hapus</button>
        </div> 
        </li>`;
    });

    list.innerHTML = data;
  };
}

function addData(penjumlahan, hasilPenjumlahan) {
  const data = {
    id: +new Date(),
    kalkulasi: penjumlahan,
    hasil: hasilPenjumlahan,
  };

  const tx = makeTransaction("dataStore", "readwrite");
  const store = tx.objectStore("dataStore");
  const request = store.add(data);
  buildList();
}

function removeData(event) {
  const list = event.target.closest("[data-key]");
  const key = list.getAttribute("data-key");

  if (key) {
    const tx = makeTransaction("dataStore", "readwrite");
    const store = tx.objectStore("dataStore");
    const request = store.delete(Number(key));
    buildList();
  }
}

function editData(event) {
  const element = event.target.closest("[data-key]");
  const getKey = element.getAttribute("data-key");
  const output = document.querySelector(".kalkulasi");
  const hasil = document.querySelector(".hasil");

  const tx = makeTransaction("dataStore", "readwrite");
  const store = tx.objectStore("dataStore");
  const getReq = store.get(Number(getKey));

  getReq.onsuccess = (ev) => {
    const request = ev.target.result;
    const id = request.id;

    output.value = request.kalkulasi;
    hasil.textContent = "ok";
    hasil.setAttribute("onclick", `updateData(${id})`);
    window.scrollTo(0, -100);
  };
}

function updateData(key) {
  const btnHasil = document.querySelector(".hasil");
  const output = document.querySelector(".kalkulasi");
  const span = document.querySelector("span");
  const keyName = Number(key);

  const kalkulasi = eval(output.value);
  const hasil = kalkulasi.toLocaleString("id-ID");

  span.innerHTML = output.value;
  output.value = hasil;

  if (key) {
    const data = {
      id: keyName,
      kalkulasi: span.innerHTML,
      hasil: hasil,
    };

    const tx = makeTransaction("dataStore", "readwrite");
    const store = tx.objectStore("dataStore");
    const request = store.put(data);
    btnHasil.textContent = "=";
    btnHasil.setAttribute("onclick", `hasil()`);
    span.innerHTML = "";
    output.value = "";
    window.scrollBy(0, 200);
  }
  buildList();
}

function makeTransaction(storeName, mode) {
  const tx = db.transaction(storeName, mode);

  tx.onsuccess = (ev) => {
    console.log("berhasil menambahkan data ke object");
  };
  tx.onerror = (ev) => {
    console.log("gagal menambahkan data ke object");
  };
  return tx;
}
