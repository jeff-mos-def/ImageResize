const inputImage = document.getElementById('inputImage');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const resizeButton = document.getElementById('resizeButton');
const downloadLink = document.getElementById('downloadLink');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let originalWidth = 0;
let originalHeight = 0;

inputImage.addEventListener('change', () => {
    const fileReader = new FileReader();

    fileReader.onload = (e) => {
        const image = new Image();
        image.src = e.target.result;

        image.onload = () => {
            originalWidth = image.width;
            originalHeight = image.height;
            canvas.width = originalWidth;
            canvas.height = originalHeight;
            ctx.drawImage(image, 0, 0);
        };
    };

    fileReader.readAsDataURL(inputImage.files[0]);
});

resizeButton.addEventListener('click', () => {
    const newWidth = parseInt(widthInput.value);
    const newHeight = maintainAspectRatio(newWidth, originalWidth, originalHeight);
    heightInput.value = newHeight;
    const image = new Image();
    image.src = canvas.toDataURL();

    image.onload = () => {
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(image, 0, 0, newWidth, newHeight);

        // Enable the download link with the resized image data
        downloadLink.href = canvas.toDataURL('image/png');
        downloadLink.style.display = 'block';
    };
});

function maintainAspectRatio(newWidth, originalWidth, originalHeight) {
    const aspectRatio = originalHeight / originalWidth;
    const newHeight = Math.round(newWidth * aspectRatio);
    return newHeight;
}
