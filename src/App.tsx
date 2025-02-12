import React, { useState, useEffect, useRef } from "react";
import Step from "./components/Step";
import confetti from "canvas-confetti";

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0); // Paso 0 es la dedicatoria
  const [message, setMessage] = useState<string>("");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null); // Referencia para el audio

  // Fecha objetivo: 14 de febrero a las 05:00 AM
  const targetDate = new Date("2025-02-14T05:00:00");

  // Efecto para configurar el audio
  useEffect(() => {
    audioRef.current = new Audio("/romantic-music.mp3");
    audioRef.current.loop = true; // Reproducir en bucle

    // Detener la música al desmontar el componente
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Efecto para calcular el tiempo restante
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setGameStarted(true); // El juego puede comenzar
        clearInterval(interval);
        setTimeLeft("");
      } else {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  // Función para iniciar la música
  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error al reproducir la música:", error);
      });
    }
  };

  const steps = [
    {
      pista: "💖 Para mi amor 💖",
      password: "", // No necesita contraseña
      message: `Gracias por ser la persona más especial en mi vida, Paoli.  
                Eres mi razón para sonreír cada día,  
                desde que te conoci mi vida cambio.  
                ¡Te amo con todo mi corazón! 💕`,
    },
    {
      pista: "Pista 1: Busca en el poste frente al estudio, tenes que encontrar un codigo QR ¡Escanealo! 💕",
      password: "cafe",
      message: `¡Bien hecho, mi amor, jaja encontraste la primer contraseña!  
                La próxima pista está en la plaza frente al duomo, te acordas la tormenta
                y esa lluvia fria?. 🌍`,
    },
    {
      pista: "Pista 2: Busca en la plaza donde en el pasto frente al duomo, en algun arbol? jaja ✈️",
      password: "momentos",
      message: `¡Excelente, mi vida, sos buena para buscar tesoros!  
                La última pista está en el lugar donde te pedi para ser novios, 
                osea la plaza jaja.  
                Ese momento que cambió todo para siempre. 💋`,
    },
    {
      pista: "Pista 3: Busca en la plaza en el arbolito de siempre. 💏",
      password: "beso",
      message: `¡Felicidades, mi amor, encontraste todos las contraseñas!  
                Has encontrado el tesoro más valioso: nuestro amor.  
                Eres la persona más especial en mi vida,  
                y quiero pasar el resto de mis días a tu lado.  
                Te amo. 💖🎉`,
    },
  ];

  const playVictorySound = () => {
    const audio = new Audio("/victory.mp3");
    audio.play();
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handlePasswordSubmit = (step: number) => {
    if (step === 0) {
      // Si es el paso 0 (dedicatoria), simplemente avanzamos al siguiente paso
      setCurrentStep(1);
      startMusic(); // Iniciar la música al comenzar el juego
      return;
    }

    const input = document.getElementById(`password-${step}`) as HTMLInputElement;
    if (input.value === steps[step].password) {
      setMessage(steps[step].message || "");
      playVictorySound();
      triggerConfetti();
      setTimeout(() => {
        setCurrentStep(step + 1);
        setMessage("");
      }, 20000); // Espera 20 segundos antes de avanzar
    } else {
      alert("Contraseña incorrecta. ¡Segui buscando! 💔");
    }
  };

  return (
    <div className="app">
      {/* Fondo con corazones latiendo */}
      <div className="heart-background">
        <div className="heart red">💖</div>
        <div className="heart pink">💖</div>
        <div className="heart red">💖</div>
        <div className="heart pink">💖</div>
        <div className="heart red">💖</div>
      </div>

      {/* Contenido principal */}
      <div className="title-box">
        <h1>💖 Búsqueda del Tesoro 💖</h1>
      </div>

      {!gameStarted ? (
        <div className="countdown">
          <h2>El juego comenzará en:</h2>
          <p>{timeLeft}</p>
        </div>
      ) : currentStep === 0 ? (
        <div className="dedicatoria">
          <p className="dedicatoria-mensaje">{steps[0].message}</p>
          <button onClick={() => handlePasswordSubmit(0)} className="comenzar-button">
            Comenzar
          </button>
        </div>
      ) : currentStep <= steps.length ? (
        <Step
          step={currentStep}
          pista={steps[currentStep].pista}
          onPasswordSubmit={handlePasswordSubmit}
          message={message}
        />
      ) : (
        <div className="final-message">
          <h2>¡Felicidades! Terminaste el juego vos ganaste!. 💖🎉</h2>
          <p>Eres la persona más especial en mi vida. Te amo. 💕</p>
        </div>
      )}
    </div>
  );
};

export default App;