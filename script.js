const fonts = ['Times New Roman', 'Cooper Black', 'ITC Avant Garde Gothic'];

const elements = document.querySelectorAll('.fonttext');

elements.forEach(textContainer => {
    const characters = textContainer.textContent.split('');

    textContainer.textContent = '';
    characters.forEach((char, index) => {
        const span = document.createElement('span');
        span.classList.add('textchar');
        span.textContent = char;
        span.style.fontFamily = fonts[index % fonts.length]; 
        textContainer.appendChild(span);
    });
});
