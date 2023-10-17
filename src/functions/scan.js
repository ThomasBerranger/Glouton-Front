function renameScanTexts() {
    let scanCameraPermission = document.getElementById('html5-qrcode-button-camera-permission');

    if (scanCameraPermission) {
        scanCameraPermission.innerHTML = `<button class="px-3 py-1 border-2 rounded mb-3">Autoriser l'accès à la caméra</button>`;
    }

    let scanTypeChange = document.getElementById('html5-qrcode-anchor-scan-type-change');
    let isCameraScan = true;

    if (scanTypeChange) {
        scanTypeChange.innerText = 'Scanner une image';
    }

    let chooseAnImage = document.getElementById('html5-qrcode-button-file-selection');
    chooseAnImage.parentElement.nextSibling.remove();

    scanTypeChange.addEventListener('click', () => {
        scanTypeChange.innerText = isCameraScan ? 'Utiliser la caméra' : 'Scanner une image';
        isCameraScan = !isCameraScan;

        chooseAnImage.innerText = 'Choisir une image';
    });
}

export {renameScanTexts};