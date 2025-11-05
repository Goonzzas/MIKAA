class JardinParaMika {
    constructor() {
        this.canvas = document.getElementById('jardinCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.flores = [];
        this.estrellas = [];
        this.burbujas = [];
        this.tiempoRotacion = 15000;
        this.mensajesPorRonda = 3;
        this.velocidadBurbujas = 3.5;
        
        this.mensajesRomanticos = [
            "Gracias por brindarme tu amistad 💖",
            "Gracias por aguantar mis bobadas 😅",
            "Me alegra tenerte en mi vida, Mika 🌟",
            "Eres una persona increíble 💫",
            "Gracias por compartir tantos momentos conmigo 🎮",
            "Gracias Por ser mi tutora y esposita 💞",
            "Me encanta cómo siempre me entiendes 🤍",
            "Gracias por estar incluso cuando soy insoportable 😂",
            "Contigo todo se siente más bonito ✨",
            "Eres mi compañera de aventuras en Neverland 💍",
            "Gracias por hacerme reír cuando más lo necesito 😄",
            "Aprecio muchísimo todo lo que haces por mí 🙏",
            "Eres paz en medio del caos☀️",
            "Qué bonito es poder contar contigo 💌",
            "Gracias por seguir aquí, incluso cuando soy un desastre 😅",
            "Me encanta nuestra locura compartida 🤪",
            "Eres esa persona con la que siempre me siento cómodo 💗",
            "Nunca cambies, Mika, eres única 🌈",
            "Gracias por hacer de Neverland un lugar mas divertido 🎮",
            "Desde Colombia para ti, con mucho cariño 🇨🇴❤️",

        ];

        this.mensajesUsados = new Set();
        
        this.inicializar();
    }

    inicializar() {
        this.resize();
        this.inicializarEstrellas();
        this.crearFloresIniciales();
        this.actualizarFecha();
        this.mostrarMensajeColombia();
        
        this.iniciarRotacionMensajes();
        
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('click', (e) => this.crearFlorEnClick(e));
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.crearFlorEnClick(touch);
        }, { passive: false });

        this.animar();
        this.moverBurbujas();
    }

    mostrarMensajeColombia() {
        const mensajeColombia = document.getElementById('mensajeColombia');
        setTimeout(() => {
            mensajeColombia.style.opacity = '1';
            mensajeColombia.style.transform = 'translateX(-50%) scale(1)';
        }, 1000);
    }

    iniciarRotacionMensajes() {
        this.crearNuevaRondaMensajes();
        
        setInterval(() => {
            this.rotarMensajes();
        }, this.tiempoRotacion);
    }

    crearNuevaRondaMensajes() {
        this.removerTodosLosMensajes();
        
        const mensajesDisponibles = this.mensajesRomanticos.filter(
            mensaje => !this.mensajesUsados.has(mensaje)
        );
        
        if (mensajesDisponibles.length < this.mensajesPorRonda) {
            this.mensajesUsados.clear();
        }
        
        const mensajesSeleccionados = [];
        for (let i = 0; i < this.mensajesPorRonda; i++) {
            let mensaje;
            let intentos = 0;
            
            do {
                mensaje = this.mensajesRomanticos[
                    Math.floor(Math.random() * this.mensajesRomanticos.length)
                ];
                intentos++;
            } while (
                (this.mensajesUsados.has(mensaje) || mensajesSeleccionados.includes(mensaje)) && 
                intentos < 20
            );
            
            if (mensaje && !mensajesSeleccionados.includes(mensaje)) {
                mensajesSeleccionados.push(mensaje);
                this.mensajesUsados.add(mensaje);
            }
        }
        
        mensajesSeleccionados.forEach((mensaje, index) => {
            setTimeout(() => {
                this.crearBurbuja(mensaje);
            }, index * 300);
        });
    }

    rotarMensajes() {
        this.burbujas.forEach((burbuja, index) => {
            setTimeout(() => {
                burbuja.element.classList.add('saliendo');
                setTimeout(() => {
                    if (burbuja.element.parentNode) {
                        burbuja.element.parentNode.removeChild(burbuja.element);
                    }
                }, 600);
            }, index * 200);
        });

        setTimeout(() => {
            this.burbujas = [];
            this.crearNuevaRondaMensajes();
        }, 1000);
    }

    removerTodosLosMensajes() {
        this.burbujas.forEach(burbuja => {
            if (burbuja.element.parentNode) {
                burbuja.element.parentNode.removeChild(burbuja.element);
            }
        });
        this.burbujas = [];
    }

    crearBurbuja(mensajeEspecifico = null) {
        const mensaje = mensajeEspecifico || this.mensajesRomanticos[
            Math.floor(Math.random() * this.mensajesRomanticos.length)
        ];
        
        const burbujaElement = document.createElement('div');
        burbujaElement.className = 'burbuja entrando activa';
        burbujaElement.innerHTML = this.procesarEmojisEspeciales(mensaje);
        
        document.getElementById('burbujasContainer').appendChild(burbujaElement);
        
        burbujaElement.offsetHeight;
        
        const width = Math.min(260, this.canvas.width * 0.65);
        const height = 70;
        
        const speedBase = this.velocidadBurbujas;
        const speedX = (Math.random() - 0.5) * speedBase * 2;
        const speedY = (Math.random() - 0.5) * speedBase * 2;
        
        const burbuja = {
            element: burbujaElement,
            x: Math.random() * (this.canvas.width - width),
            y: Math.random() * (this.canvas.height - height - 120) + 80,
            width: width,
            height: height,
            speedX: Math.abs(speedX) < 1 ? (speedX < 0 ? -1 : 1) : speedX,
            speedY: Math.abs(speedY) < 1 ? (speedY < 0 ? -1 : 1) : speedY,
            maxX: this.canvas.width - width,
            maxY: this.canvas.height - height,
            tiempoCreacion: Date.now()
        };
        
        burbujaElement.style.left = burbuja.x + 'px';
        burbujaElement.style.top = burbuja.y + 'px';
        
        this.burbujas.push(burbuja);
        
        setTimeout(() => {
            if (this.burbujas.includes(burbuja)) {
                burbujaElement.classList.add('saliendo');
                setTimeout(() => {
                    if (burbujaElement.parentNode) {
                        burbujaElement.parentNode.removeChild(burbujaElement);
                        this.burbujas = this.burbujas.filter(b => b !== burbuja);
                    }
                }, 600);
            }
        }, this.tiempoRotacion);
        
        return burbuja;
    }

    procesarEmojisEspeciales(texto) {
        return texto
            .replace(/🇨🇴/g, '<span class="bandera-colombia">🇨🇴</span>')
            .replace(/🇻🇪/g, '<span class="bandera-venezuela">🇻🇪</span>')
            .replace(/💖/g, '<span style="font-size: 1.1em">💖</span>')
            .replace(/🎮/g, '<span style="font-size: 1.1em">🎮</span>');
    }

    moverBurbujas() {
        this.burbujas.forEach(burbuja => {
            if (!burbuja.element) return;
            
            burbuja.x += burbuja.speedX;
            burbuja.y += burbuja.speedY;
            
            let rebote = false;
            
            if (burbuja.x <= 0) {
                burbuja.speedX = Math.abs(burbuja.speedX) * 0.95;
                burbuja.x = 0;
                rebote = true;
            } else if (burbuja.x >= burbuja.maxX) {
                burbuja.speedX = -Math.abs(burbuja.speedX) * 0.95;
                burbuja.x = burbuja.maxX;
                rebote = true;
            }
            
            if (burbuja.y <= 60) {
                burbuja.speedY = Math.abs(burbuja.speedY) * 0.95;
                burbuja.y = 60;
                rebote = true;
            } else if (burbuja.y >= burbuja.maxY) {
                burbuja.speedY = -Math.abs(burbuja.speedY) * 0.95;
                burbuja.y = burbuja.maxY;
                rebote = true;
            }
            
            burbuja.element.style.left = burbuja.x + 'px';
            burbuja.element.style.top = burbuja.y + 'px';
            
            const flotacion = Math.sin(Date.now() * 0.003 + burbuja.x * 0.01) * 4;
            burbuja.element.style.transform = `translateY(${flotacion}px) scale(1)`;
            
            if (rebote) {
                burbuja.element.style.transform = `translateY(${flotacion}px) rotate(${burbuja.speedX * 0.5}deg)`;
                setTimeout(() => {
                    if (burbuja.element) {
                        burbuja.element.style.transform = `translateY(${flotacion}px) rotate(0deg)`;
                    }
                }, 200);
            }
        });
        
        requestAnimationFrame(() => this.moverBurbujas());
    }

    resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.canvas.width = width;
        this.canvas.height = height;
        
        this.burbujas.forEach(burbuja => {
            if (burbuja.element) {
                burbuja.maxX = width - burbuja.element.offsetWidth;
                burbuja.maxY = height - burbuja.element.offsetHeight;
                
                burbuja.x = Math.max(0, Math.min(burbuja.maxX, burbuja.x));
                burbuja.y = Math.max(60, Math.min(burbuja.maxY, burbuja.y));
                
                burbuja.element.style.left = burbuja.x + 'px';
                burbuja.element.style.top = burbuja.y + 'px';
            }
        });
    }

    inicializarEstrellas() {
        this.estrellas = [];
        const cantidad = Math.min(70, Math.floor((this.canvas.width * this.canvas.height) / 4000));
        
        for (let i = 0; i < cantidad; i++) {
            this.estrellas.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 1.3 + 0.5,
                brightness: Math.random() * 0.5 + 0.3,
                speed: Math.random() * 0.03 + 0.01
            });
        }
    }

    crearFloresIniciales() {
        const cantidad = Math.min(4, Math.floor(this.canvas.width / 150));
        const margin = 80;
        
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
            tamaño: Math.random() * 18 + 12,
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
        const oscilacion = Math.sin(flor.tiempo * flor.oscilacion) * 4;

        // Tallo
        this.ctx.strokeStyle = '#2e8b57';
        this.ctx.lineWidth = 2 * crecimiento;
        this.ctx.beginPath();
        this.ctx.moveTo(flor.x, flor.y);
        this.ctx.lineTo(flor.x + oscilacion, flor.y - 70 * crecimiento);
        this.ctx.stroke();

        // Hojas
        this.dibujarHoja(flor.x + oscilacion, flor.y - 25 * crecimiento, 12 * crecimiento, -1);
        this.dibujarHoja(flor.x + oscilacion, flor.y - 45 * crecimiento, 10 * crecimiento, 1);

        // Centro de la flor
        this.ctx.fillStyle = '#ffd700';
        this.ctx.beginPath();
        this.ctx.arc(flor.x + oscilacion, flor.y - 70 * crecimiento, tamaño * 0.2, 0, Math.PI * 2);
        this.ctx.fill();

        // Pétalos
        for (let i = 0; i < flor.pétalos; i++) {
            const angle = (i / flor.pétalos) * Math.PI * 2 + flor.tiempo * 0.0005;
            this.dibujarPétalo(flor.x + oscilacion, flor.y - 70 * crecimiento, tamaño, angle, flor.color);
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
        
        if (Math.random() > 0.7 && this.burbujas.length < 6) {
            setTimeout(() => this.crearBurbuja(), 500);
        }
    }

    actualizarFecha() {
        const ahora = new Date();
        const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
        const fechaFormateada = ahora.toLocaleDateString('es-ES', opciones);
    }

    animar() {
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
    new JardinParaMika();
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