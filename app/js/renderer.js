const path = require("path");
const os = require("os");
const { ipcRenderer } = require("electron");

const form = document.getElementById("image-form");
const slider = document.getElementById("slider");
const img = document.getElementById("img");
const quality = slider.value;

document.getElementById("output-path").innerText = path.join(
  os.homedir(),
  "imagescompressor"
);

// On submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const file = img.files[0];
  if (!file) {
    M.toast({
      html: `Please select an image file`,
    });
    return false;
  }

  document.getElementById("submit-btn").value = "Loading";
  document.getElementById("submit-btn").disabled = true;

  const imgPath = img.files[0].path;
  ipcRenderer.send("image:minimize", {
    imgPath: imgPath,
    quality,
  });
});

// On done
ipcRenderer.on("image:done", () => {
  document.getElementById("submit-btn").value = "Resize";
  document.getElementById("submit-btn").disabled = false;
  M.toast({
    html: `Image resized to ${slider.value}% quality`,
  });
});
