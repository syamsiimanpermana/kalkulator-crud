
const inputBtn = document.querySelectorAll(".inputBtn");
const output = document.querySelector(".kalkulasi");
const span = document.querySelector("span");

inputBtn.forEach((input) => {
  input.onclick = (event) => {
    output.value += event.target.textContent;
  };
});

function clearAll() {
  span.innerHTML = "";
  output.value = "";
}

function hasil() {
  const kalkulasi = eval(output.value);
  const hasil = kalkulasi.toLocaleString("id-ID");
  span.innerHTML = output.value;
  output.value = hasil;

  addData(span.innerHTML, hasil);
}

function hapus() {
  const hapus = output.value.substring(0, output.value.length - 1);
  output.value = hapus;
}
