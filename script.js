let currentProject = "Home";
let currentIframe = null;

// Create initial iframe on page load
window.addEventListener('load', () => {
    const iframe = document.createElement('iframe');
    iframe.src = './credits.html';
    iframe.style.width = '100%';
    iframe.style.height = '100vh';
    iframe.style.border = 'none';
    document.getElementById('iframe-container').appendChild(iframe);
    currentIframe = iframe;
    container.classList.remove('hidden');
    container.classList.add('hidden');
});

function setup() {
    currentProject = 'Home';
    let canvas = createCanvas(1000, 1000);
    canvas.parent('canvas-container');
    noLoop();
}

document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
        currentProject = card.getAttribute('data-project');
        
        // Remove existing iframe if any
        if (currentIframe) {
            currentIframe.remove();
            currentIframe = null;
        }

        // Handle BIV project
        if (currentProject === 'BIV - Digital Fiction') {
            const iframe = document.createElement('iframe');
            iframe.src = './Inform/index.html';
            iframe.style.width = '100%';
            iframe.style.height = '100vh';
            iframe.style.border = 'none';
            
            document.getElementById('iframe-container').appendChild(iframe);
            currentIframe = iframe;
        } else if (currentProject === 'Plato Babbles') {
            const iframe = document.createElement('iframe');
            iframe.src = './grammar/index.html';
            iframe.style.width = '100%';
            iframe.style.height = '100vh';
            iframe.style.border = 'none';
            
            document.getElementById('iframe-container').appendChild(iframe);
            currentIframe = iframe;
        }  else if (currentProject === 'Hand Me Some Particles') {
            const iframe = document.createElement('iframe');
            iframe.src = './handme/index.html';
            iframe.style.width = '100%';
            iframe.style.height = '100vh';
            iframe.style.border = 'none';
            document.getElementById('iframe-container').appendChild(iframe);
            currentIframe = iframe;
        } else if (currentProject === 'Home') {
            const iframe = document.createElement('iframe'); 
            iframe.src = './credits.html';         
            iframe.style.width = '100%';
            iframe.style.height = '100vh';
            iframe.style.border = 'none';
            document.getElementById('iframe-container').appendChild(iframe);
            currentIframe = iframe;
        }
    });
});

const container = document.querySelector('.container');
const titleBlock = document.querySelector('.title-block');
const cards = document.querySelectorAll('.card');

// Handle card selection
cards.forEach(card => {
    card.addEventListener('click', () => {
            container.classList.add('hidden');
    });
});

// Handle title hover
titleBlock.addEventListener('mouseenter', () => {
    container.classList.remove('hidden');
});
