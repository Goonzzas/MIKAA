class JardinRomantico {
    constructor() {
        this.canvas = document.getElementById('jardinCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.flores = [];
        this.estrellas = [];
        
        this.resize();
        this.inicializarEstrellas();
        this.crearFloresIniciales();
        this.animar();
        this.actualizarFecha();
        
        // Event listeners
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('click', (e) => this.crearFlorEnClick(e));
        
        // Efectos de sonido suaves (opcional)
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    inicializarEstrellas() {
        for (let i = 0; i < 100; i++) {
            this.estrellas.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                brightness: Math.random() * 0.5 + 0.3,
                speed: Math.random() * 0.05 + 0.02
            });
        }
    }

    crearFloresIniciales() {
        const posiciones = [
            { x: this.canvas.width * 0.2, y: this.canvas.height * 0.3 },
            { x: this.canvas.width * 0.8, y: this.canvas.height * 0.4 },
            { x: this.canvas.width * 0.3, y: this.canvas.height * 0.7 },
            { x: this.canvas.width * 0.7, y: this.canvas.height * 0.6 },
            { x: this.canvas.width * 0.5, y: this.canvas.height * 0.2 }
        ];

        posiciones.forEach(pos => {
            this.crearFlorCompleja(pos.x, pos.y);
        });
    }

    crearFlorCompleja(x, y) {
        const colores = [
            '#ff6b6b', '#ff8e8e', '#ffd700', '#da70d6', 
            '#87ceeb', '#98fb98', '#ffa07a', '#dda0dd'
        ];
        
        const flor = {
            x: x,
            y: y,
            tamaño: Math.random() * 30 + 20,
            color: colores[Math.floor(Math.random() * colores.length)],
            pétalos: Math.floor(Math.random() * 8) + 6,
            tiempo: 0,
            crecimiento: 0,
            completa: false
        };

        this.flores.push(flor);
        this.reproducirSonidoFlor();
        return flor;
    }

    dibujarEstrellas() {
        this.estrellas.forEach(estrella => {
            this.ctx.save();
            this.ctx.globalAlpha = estrella.brightness + Math.sin(Date.now() * 0.001 * estrella.speed) * 0.3;
            this.ctx.fillStyle = 'white';
            this.ctx.beginPath();
            this.ctx.arc(estrella.x, estrella.y, estrella.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    dibujarFlor(flor) {
        if (flor.crecimiento < 1) {
            flor.crecimiento += 0.02;
        } else {
            flor.completa = true;
        }

        const crecimiento = flor.crecimiento;
        const tamaño = flor.tamaño * crecimiento;

        // Tallo
        this.ctx.strokeStyle = '#2e8b57';
        this.ctx.lineWidth = 3 * crecimiento;
        this.ctx.beginPath();
        this.ctx.moveTo(flor.x, flor.y);
        this.ctx.lineTo(flor.x, flor.y - 120 * crecimiento);
        this.ctx.stroke();

        // Hojas
        this.dibujarHoja(flor.x, flor.y - 40 * crecimiento, 20 * crecimiento, -1);
        this.dibujarHoja(flor.x, flor.y - 80 * crecimiento, 15 * crecimiento, 1);

        // Centro de la flor
        this.ctx.fillStyle = '#ffd700';
        this.ctx.beginPath();
        this.ctx.arc(flor.x, flor.y - 120 * crecimiento, tamaño * 0.3, 0, Math.PI * 2);
        this.ctx.fill();

        // Pétalos en forma de corazón
        for (let i = 0; i < flor.pétalos; i++) {
            const angle = (i / flor.pétalos) * Math.PI * 2 + flor.tiempo * 0.001;
            this.dibujarPétalo(flor.x, flor.y - 120 * crecimiento, tamaño, angle, flor.color);
        }

        flor.tiempo += 16;
    }

    dibujarPétalo(x, y, tamaño, angle, color) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(angle);

        // Forma de corazón para los pétalos
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        
        for (let t = 0; t <= Math.PI * 2; t += 0.1) {
            const r = tamaño * (1 + 0.3 * Math.cos(4 * t));
            const petalX = r * Math.sin(t);
            const petalY = r * Math.cos(t) * 0.8;
            
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
        for (let t = 0; t <= Math.PI; t += 0.1) {
            const leafX = tamaño * Math.cos(t);
            const leafY = tamaño * Math.sin(t) * 0.6 * (1 + 0.3 * Math.sin(2 * t));
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
        const x = evento.clientX - rect.left;
        const y = evento.clientY - rect.top;
        
        this.crearFlorCompleja(x, y);
    }

    reproducirSonidoFlor() {
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // Nota Do
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.5);
        } catch (e) {
            // Silenciar errores de audio
        }
    }

    actualizarFecha() {
        const ahora = new Date();
        const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
        const fechaFormateada = ahora.toLocaleDateString('es-ES', opciones);
        document.getElementById('fecha').textContent = fechaFormateada;
    }

    animar() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
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

// Inicializar el jardín cuando la página cargue
window.addEventListener('load', () => {
    new JardinRomantico();
});

// Efecto de escritura para los mensajes
document.addEventListener('DOMContentLoaded', function() {
    const mensajes = document.querySelectorAll('.mensaje-flotante');
    
    mensajes.forEach((mensaje, index) => {
        setTimeout(() => {
            mensaje.style.opacity = '1';
            mensaje.style.transform = 'translateY(0)';
        }, index * 1000 + 500);
    });
});