const inputImage = document.getElementById('inputImage');
const cropButton = document.getElementById('cropButton');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const resizeButton = document.getElementById('resizeButton');
const downloadLink = document.getElementById('downloadLink');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const undoButton = document.getElementById('undoButton');
let cropping = false;
let cropStartX, cropStartY, cropEndX, cropEndY;
let previousCanvasState = null;

inputImage.addEventListener('change', () => {
    const fileReader = new FileReader();

    fileReader.onload = (e) => {
        const image = new Image();
        image.src = e.target.result;

        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
        };
    };

    fileReader.readAsDataURL(inputImage.files[0]);
});

canvas.addEventListener('mousedown', (e) => {
    if (cropping) {
        cropStartX = e.clientX - canvas.getBoundingClientRect().left;
        cropStartY = e.clientY - canvas.getBoundingClientRect().top;
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (cropping) {
        cropEndX = e.clientX - canvas.getBoundingClientRect().left;
        cropEndY = e.clientY - canvas.getBoundingClientRect().top;
        cropImage();
        cropping = false;
    }
});

cropButton.addEventListener('click', () => {
    cropping = !cropping;
});

undoButton.addEventListener('click', () => {
    if (previousCanvasState) {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        tempCtx.drawImage(canvas, 0, 0);

        canvas.width = previousCanvasState.width;
        canvas.height = previousCanvasState.height;
        ctx.putImageData(previousCanvasState.data, 0, 0);

        previousCanvasState = {
            data: tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height),
            width: tempCanvas.width,
            height: tempCanvas.height
        };
    }
});

resizeButton.addEventListener('click', () => {
    saveCanvasState();

    const width = parseInt(widthInput.value);
    const height = parseInt(heightInput.value);
    const image = new Image();
    image.src = canvas.toDataURL();

    image.onload = () => {
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(image, 0, 0, width, height);

        // Enable the download link with the resized image data
        downloadLink.href = canvas.toDataURL('image/png');
        downloadLink.style.display = 'block';
    };
});

function cropImage() {
    saveCanvasState();

    const width = Math.abs(cropEndX - cropStartX);
    const height = Math.abs(cropEndY - cropStartY);
    const startX = Math.min(cropStartX, cropEndX);
    const startY = Math.min(cropStartY, cropEndY);

    const croppedImage = ctx.getImageData(startX, startY, width, height);
    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');
    croppedCanvas.width = width;
    croppedCanvas.height = height;
    croppedCtx.putImageData(croppedImage, 0, 0);

    const image = new Image();
    image.src = croppedCanvas.toDataURL();

    image.onload = () => {
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(image, 0, 0);
    };
}

function saveCanvasState() {
    previousCanvasState = {
        data: ctx.getImageData(0, 0, canvas.width, canvas.height),
        width: canvas.width,
        height: canvas.height
    };
}
