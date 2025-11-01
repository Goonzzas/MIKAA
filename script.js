class JardinMovilRomantico {
    constructor() {
        this.canvas = document.getElementById('jardinCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.flores = [];
        this.estrellas = [];
        this.burbujas = [];
        this.mensajesRomanticos = [
            "Cada flor representa un momento especial que hemos compartido 🌸",
            "Tu sonrisa ilumina mi mundo como estas flores ✨",
            "Eres más hermosa que el jardín más perfecto 💖",
            "Mi cariño por ti crece cada día como estas flores 🌱",
            "Eres la flor más hermosa en el jardín de mi vida 🌹",
            "Cada latido de mi corazón es un pétalo para ti 💓",
            "Tu amor es el sol que hace crecer este jardín ☀️",
            "Eres mi sueño más bonito hecho realidad 🌙",
            "Contigo hasta el infinito se queda corto 🚀",
            "Eres la razón por la que mi mundo tiene colores 🌈"
        ];
        
        this.inicializar();
    }

    inicializar() {
        this.resize();
        this.inicializarEstrellas();
        this.crearFloresIniciales();
        this.crearBurbujasIniciales();
        this.animar();
        this.actualizarFecha();
        
        // Event listeners para móvil
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('click', (e) => this.crearFlorEnClick(e));
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.crearFlorEnClick(touch);
        }, { passive: false });

        // Iniciar el movimiento de las burbujas
        this.moverBurbujas();
    }

    resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.canvas.width = width;
        this.canvas.height = height;
        
        // Ajustar las burbujas existentes a los nuevos límites
        this.burbujas.forEach(burbuja => {
            burbuja.maxX = width - burbuja.element.offsetWidth;
            burbuja.maxY = height - burbuja.element.offsetHeight;
        });
    }

    inicializarEstrellas() {
        this.estrellas = [];
        const cantidad = Math.min(80, Math.floor((this.canvas.width * this.canvas.height) / 4000));
        
        for (let i = 0; i < cantidad; i++) {
            this.estrellas.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 1.5 + 0.5,
                brightness: Math.random() * 0.5 + 0.3,
                speed: Math.random() * 0.03 + 0.01
            });
        }
    }

    crearFloresIniciales() {
        const cantidad = Math.min(5, Math.floor(this.canvas.width / 150));
        const margin = 100;
        
        for (let i = 0; i < cantidad; i++) {
            const x = margin + Math.random() * (this.canvas.width - 2 * margin);
            const y = this.canvas.height * 0.6 + Math.random() * (this.canvas.height * 0.4 - margin);
            this.crearFlorCompleja(x, y);
        }
    }

    crearFlorCompleja(x, y) {
        const colores = [
            '#ff6b6b', '#ff8e8e', '#ffd700', '#da70d6', 
            '#87ceeb', '#98fb98', '#ffa07a', '#dda0dd'
        ];
        
        const flor = {
            x: x,
            y: y,
            tamaño: Math.random() * 20 + 15,
            color: colores[Math.floor(Math.random() * colores.length)],
            pétalos: Math.floor(Math.random() * 6) + 5,
            tiempo: 0,
            crecimiento: 0,
            completa: false,
            oscilacion: Math.random() * 0.02
        };

        this.flores.push(flor);
        return flor;
    }

    crearBurbujasIniciales() {
        const cantidad = Math.min(4, Math.floor(this.canvas.width / 200));
        
        for (let i = 0; i < cantidad; i++) {
            setTimeout(() => {
                this.crearBurbuja();
            }, i * 1000);
        }
    }

    crearBurbuja() {
        const mensaje = this.mensajesRomanticos[
            Math.floor(Math.random() * this.mensajesRomanticos.length)
        ];
        
        const burbujaElement = document.createElement('div');
        burbujaElement.className = 'burbuja';
        burbujaElement.textContent = mensaje;
        burbujaElement.style.opacity = '0';
        
        document.getElementById('burbujasContainer').appendChild(burbujaElement);
        
        // Tamaño de la burbuja
        const width = Math.min(280, this.canvas.width * 0.7);
        const height = 80;
        
        const burbuja = {
            element: burbujaElement,
            x: Math.random() * (this.canvas.width - width),
            y: Math.random() * (this.canvas.height - height - 100) + 50,
            width: width,
            height: height,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            maxX: this.canvas.width - width,
            maxY: this.canvas.height - height,
            opacity: 0
        };
        
        // Animación de entrada
        setTimeout(() => {
            burbujaElement.style.opacity = '1';
            burbujaElement.style.transform = 'scale(1)';
            burbuja.opacity = 1;
        }, 100);
        
        this.burbujas.push(burbuja);
        return burbuja;
    }

    moverBurbujas() {
        this.burbujas.forEach(burbuja => {
            // Actualizar posición
            burbuja.x += burbuja.speedX;
            burbuja.y += burbuja.speedY;
            
            // Rebote en los bordes
            if (burbuja.x <= 0 || burbuja.x >= burbuja.maxX) {
                burbuja.speedX *= -1;
                burbuja.x = Math.max(0, Math.min(burbuja.maxX, burbuja.x));
            }
            
            if (burbuja.y <= 50 || burbuja.y >= burbuja.maxY) {
                burbuja.speedY *= -1;
                burbuja.y = Math.max(50, Math.min(burbuja.maxY, burbuja.y));
            }
            
            // Aplicar posición
            burbuja.element.style.left = burbuja.x + 'px';
            burbuja.element.style.top = burbuja.y + 'px';
            
            // Efecto de flotación suave
            burbuja.element.style.transform = `translateY(${Math.sin(Date.now() * 0.002 + burbuja.x) * 3}px)`;
        });
        
        requestAnimationFrame(() => this.moverBurbujas());
    }

    dibujarEstrellas() {
        this.estrellas.forEach(estrella => {
            this.ctx.save();
            const blink = Math.sin(Date.now() * 0.001 * estrella.speed) * 0.3;
            this.ctx.globalAlpha = estrella.brightness + blink;
            this.ctx.fillStyle = 'white';
            this.ctx.beginPath();
            this.ctx.arc(estrella.x, estrella.y, estrella.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    dibujarFlor(flor) {
        if (flor.crecimiento < 1) {
            flor.crecimiento += 0.03;
        } else {
            flor.completa = true;
        }

        const crecimiento = flor.crecimiento;
        const tamaño = flor.tamaño * crecimiento;
        const oscilacion = Math.sin(flor.tiempo * flor.oscilacion) * 5;

        // Tallo
        this.ctx.strokeStyle = '#2e8b57';
        this.ctx.lineWidth = 2 * crecimiento;
        this.ctx.beginPath();
        this.ctx.moveTo(flor.x, flor.y);
        this.ctx.lineTo(flor.x + oscilacion, flor.y - 80 * crecimiento);
        this.ctx.stroke();

        // Hojas
        this.dibujarHoja(flor.x + oscilacion, flor.y - 30 * crecimiento, 15 * crecimiento, -1);
        this.dibujarHoja(flor.x + oscilacion, flor.y - 50 * crecimiento, 12 * crecimiento, 1);

        // Centro de la flor
        this.ctx.fillStyle = '#ffd700';
        this.ctx.beginPath();
        this.ctx.arc(flor.x + oscilacion, flor.y - 80 * crecimiento, tamaño * 0.25, 0, Math.PI * 2);
        this.ctx.fill();

        // Pétalos
        for (let i = 0; i < flor.pétalos; i++) {
            const angle = (i / flor.pétalos) * Math.PI * 2 + flor.tiempo * 0.0005;
            this.dibujarPétalo(flor.x + oscilacion, flor.y - 80 * crecimiento, tamaño, angle, flor.color);
        }

        flor.tiempo += 16;
    }

    dibujarPétalo(x, y, tamaño, angle, color) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(angle);
        this.ctx.fillStyle = color;
        
        this.ctx.beginPath();
        for (let t = 0; t <= Math.PI * 2; t += 0.3) {
            const r = tamaño * (1 + 0.2 * Math.cos(4 * t));
            const petalX = r * Math.sin(t);
            const petalY = r * Math.cos(t) * 0.6;
            
            if (t === 0) {
                this.ctx.moveTo(petalX, petalY);
            } else {
                this.ctx.lineTo(petalX, petalY);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }

    dibujarHoja(x, y, tamaño, dirección) {
        this.ctx.fillStyle = '#3cb371';
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.scale(dirección, 1);

        this.ctx.beginPath();
        for (let t = 0; t <= Math.PI; t += 0.2) {
            const leafX = tamaño * Math.cos(t);
            const leafY = tamaño * Math.sin(t) * 0.5;
            if (t === 0) {
                this.ctx.moveTo(leafX, leafY);
            } else {
                this.ctx.lineTo(leafX, leafY);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }

    crearFlorEnClick(evento) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (evento.clientX || evento.touches[0].clientX) - rect.left;
        const y = (evento.clientY || evento.touches[0].clientY) - rect.top;
        
        this.crearFlorCompleja(x, y);
        
        // Ocasionalmente crear una burbuja nueva al tocar
        if (Math.random() > 0.7 && this.burbujas.length < 8) {
            setTimeout(() => this.crearBurbuja(), 500);
        }
    }

    actualizarFecha() {
        const ahora = new Date();
        const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
        const fechaFormateada = ahora.toLocaleDateString('es-ES', opciones);
        document.getElementById('fecha').textContent = fechaFormateada;
    }

    animar() {
        // Fondo con gradiente
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, Math.max(this.canvas.width, this.canvas.height) / 2
        );
        gradient.addColorStop(0, '#000010');
        gradient.addColorStop(1, '#16213e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.dibujarEstrellas();
        this.flores.forEach(flor => this.dibujarFlor(flor));
        
        requestAnimationFrame(() => this.animar());
    }
}

// Inicializar cuando la página cargue
window.addEventListener('load', () => {
    new JardinMovilRomantico();
});

// Prevenir zoom con doble toque
document.addEventListener('touchstart', function(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', function(e) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);