document.addEventListener('DOMContentLoaded', () => {
    const styleTag = document.createElement('style');
    styleTag.textContent = `
        body {
            font-family: 'Courier New', monospace; 
            margin: 0;
            padding: 0;
            background-color: #000; 
            color: #0F0; 
            line-height: 1.6;
        }

        main {
            padding-top: 80px; 
        }

        .page-section {
            display: none; 
            padding: 20px;
            margin-top: 60px; 
            border-bottom: 1px dashed #050; 
        }

        .page-section.active {
            display: block; 
        }

        h2 {
            color: #0F0; 
            border-bottom: 2px solid #050; 
            padding-bottom: 10px;
            margin-bottom: 20px;
            text-shadow: 0 0 5px #0F0; 
        }

        nav ul {
            list-style: none;
            padding: 0;
            text-align: center;
            background-color: none; 
            border-bottom: 1px solid none; 
            position: fixed; 
            width: 100%;
            top: 0;
            left: 0;
            z-index: 1000;
            box-shadow: none; 
        }

        nav ul li {
            display: inline-block;
            margin: 0 15px;
            padding: 15px 0;
        }

        nav ul li a {
            text-decoration: none;
            color: #0F0; 
            font-weight: bold;
            transition: color 0.3s ease, text-shadow 0.3s ease; 
            text-transform: uppercase; 
            letter-spacing: 1px; 
        }

        nav ul li a:hover {
            color: #3F3; 
            text-shadow: 0 0 10px #0F0; 
        }

        p {
            color: #0F0;
        }

        #imagem-trajeto {
            display: block;
            margin-left: auto;
            margin-right: auto;
            max-width: 900px;   
            max-height: 600px;  
            height: auto;       
            padding: 5px;
            box-sizing: border-box;
            object-fit: contain; 
            cursor: pointer;    
            transition: transform 0.3s ease-in-out, max-width 0.3s ease-in-out, max-height 0.3s ease-in-out; 
            z-index: 1; 
            position: relative; 
        }
    `;
    document.head.appendChild(styleTag);

    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('.page-section');

    const showSection = (id) => {
        sections.forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(id);
        if (targetSection) {
            targetSection.classList.add('active');

            window.scrollTo({
                top: targetSection.offsetTop - (styleTag.textContent.includes('position: fixed') ? 80 : 0),
                behavior: 'smooth'
            });
        }
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = e.target.getAttribute('href').substring(1);
            history.pushState(null, '', '#' + targetId);
            showSection(targetId);
        });
    });

    const initialHash = window.location.hash.substring(1);
    if (initialHash) {
        showSection(initialHash);
    } else {
        showSection('regras'); 
    }

    window.addEventListener('popstate', () => {
        const currentHash = window.location.hash.substring(1);
        if (currentHash) {
            showSection(currentHash);
        } else {
            showSection('regras');
        }
    });
});