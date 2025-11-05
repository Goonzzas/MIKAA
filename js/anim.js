// Sincronizar las letras con la canción
var audio = document.querySelector("audio");
var lyrics = document.querySelector("#lyrics");

// Array de objetos que contiene cada línea y su tiempo de aparición en segundos
var lyricsData = [
  { text: "At the time", time: 15 },
  { text: "The whisper of birds", time: 18 },
  { text: "Lonely before the sun cried", time: 27 },
  { text: "Fell from the sky", time: 32 },
  { text: "Like water drops", time: 33 },
  { text: "Where I'm now? I don't know why", time: 41 },
  { text: "Nice butterflies in my hands", time: 47 },
  { text: "Too much light for twilight", time: 54 },
  { text: "In the mood for the flowers love", time: 59 },
  { text: "That vision", time: 67 },
  { text: "Really strong, blew my mind", time: 72 },
  { text: "Silence Let me see what it was", time: 78 },
  { text: "I only want to live in clouds", time: 83 },
  { text: "Where I'm now? I don't know why", time: 91 },
  { text: "Nice butterflies in my hands", time: 97 },
  { text: "Too much light for twilight", time: 104 },
  { text: "In the mood for the flowers love", time: 108 },
];

// Animar las letras
function updateLyrics() {
  var time = Math.floor(audio.currentTime);
  var currentLine = lyricsData.find(
    (line) => time >= line.time && time < line.time + 6
  );

  if (currentLine) {
    var fadeInDuration = 0.1;
    var opacity = Math.min(1, (time - currentLine.time) / fadeInDuration);
    lyrics.style.opacity = opacity;
    lyrics.innerHTML = currentLine.text;
  } else {
    lyrics.style.opacity = 0;
    lyrics.innerHTML = "";
  }
}

setInterval(updateLyrics, 1000);

// Efecto de escritura para el mensaje principal
const textos = {
  titulo: "Para Mika 💖",
  subtitulo: "Desde Colombia con cariño te mando estas flores",
  mensaje: "Gracias por ser esa amiga especial que ilumina mis días con su alegría. Nuestra amistad en Neverland ha sido una de las aventuras más bonitas, llena de risas, complicidad y momentos inolvidables. Eres única y siempre estaré agradecido por tenerte en mi vida. ¡Te quiero mucho! 🌸🎮✨"
};

function typeWriter(elemento, texto, velocidad, callback) {
  let i = 0;
  const elem = document.getElementById(elemento);
  
  function escribir() {
    if (i < texto.length) {
      elem.innerHTML += texto.charAt(i);
      i++;
      setTimeout(escribir, velocidad);
    } else if (callback) {
      callback();
    }
  }
  
  escribir();
}

// Esperar 2 segundos y luego iniciar el efecto de escritura
setTimeout(() => {
  typeWriter("titulo-typing", textos.titulo, 100, () => {
    setTimeout(() => {
      typeWriter("subtitulo-typing", textos.subtitulo, 50, () => {
        setTimeout(() => {
          typeWriter("mensaje-typing", textos.mensaje, 30);
        }, 300);
      });
    }, 300);
  });
}, 2000);