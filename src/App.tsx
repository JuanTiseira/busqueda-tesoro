import React, { useState, useEffect, useRef } from "react";
import Step from "./components/Step";
import confetti from "canvas-confetti";

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0); // Paso 0 es la dedicatoria
  const [message, setMessage] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null); // Referencia para el audio

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
                mi refugio en los momentos difíciles,  
                y mi mayor alegría en los buenos momentos.  
                ¡Te amo con todo mi corazón! 💕`,
    },
    {
      pista: "Pista 1: Busca en el lugar donde siempre tomamos café. 💕",
      password: "cafe",
      message: `¡Bien hecho, mi amor!  
                La próxima pista está en el lugar de nuestros recuerdos de viaje.  
                Recuerda aquel día en que todo comenzó a ser aún más especial. 🌍`,
    },
    {
      pista: "Pista 2: Busca en el lugar donde guardamos nuestros recuerdos de viaje. ✈️",
      password: "recuerdos",
      message: `¡Excelente, mi vida!  
                La última pista está en el lugar de nuestro primer beso.  
                Ese momento que cambió todo para siempre. 💋`,
    },
    {
      pista: "Pista 3: Busca en el lugar donde nos dimos nuestro primer beso. 💏",
      password: "beso",
      message: `¡Felicidades, mi amor!  
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
      }, 3000); // Espera 3 segundos antes de avanzar
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

      {currentStep === 0 ? (
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