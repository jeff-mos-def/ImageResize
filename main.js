const inputImage = document.getElementById('inputImage');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const resizeButton = document.getElementById('resizeButton');
const downloadLink = document.getElementById('downloadLink');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

inputImage.addEventListener('change', () => {
    const fileReader = new FileReader();

    fileReader.onload = (e) => {
        const image = new Image();
        image.src = e.target.result;

        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
            updateDownloadLink();
        };
    };

    fileReader.readAsDataURL(inputImage.files[0]);
});

widthInput.addEventListener('input', resizeImage);
heightInput.addEventListener('input', resizeImage);

function resizeImage() {
    const width = parseInt(widthInput.value);
    const height = parseInt(heightInput.value);
    const image = new Image();
    image.src = canvas.toDataURL();

    image.onload = () => {
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(image, 0, 0, width, height);
        updateDownloadLink();
    };
}

function updateDownloadLink() {
    downloadLink.href = canvas.toDataURL('image/png');
    downloadLink.style.display = 'block';
}
