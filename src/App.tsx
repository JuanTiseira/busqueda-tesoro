import React, { useState, useEffect, useRef } from "react";
import Step from "./components/Step";
import confetti from "canvas-confetti";

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0); // Paso 0 es la dedicatoria
  const [message, setMessage] = useState<string>("");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isPasswordCorrect, setIsPasswordCorrect] = useState<boolean>(false); // Nuevo estado
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
      title: "A jugar!!",
      pista: "💖 Para mi amor 💖",
      password: "", // No necesita contraseña
      message: `Gracias por ser la persona más especial en mi vida, Paoli.  
                Sos mi razón para sonreír cada día,  
                desde que te conocí mi vida cambió (ahora no duermo).  
                ¡Te amo, corazón! 💕`,
    },
    {
      title: "Pasantias",
      pista: `Muy bien jaja, decidiste comenzar con el juego.  
              Pista 1: Busca en el poste frente al estudio,  
              tenés que encontrar un código QR. ¡Escanealo! 💕`,
      password: "primerbeso",
      message: `¡Bien hecho, mi amor, jaja encontraste la primera contraseña!  
                La próxima pista está en la plaza frente al Duomo, ¿te acordás de la tormenta  
                y esa lluvia fría? 🌍`,
    },
    {
      title: "Tormenta",
      pista: `Pista 2: Busca en la plaza, en el pasto frente al Duomo,  
              ¿en algún árbol? jaja ✈️`,
      password: "momentos",
      message: `¡Excelente, mi vida, sos buena para buscar tesoros!  
                La última pista está en el lugar donde te pedí para ser novios,  
                o sea, la plaza jaja.  
                Ese momento que cambió todo para siempre. 💋`,
    },
    {
      title: "Novios",
      pista: `Pista 3: Busca en la plaza, en el arbolito de siempre. 💏`,
      password: "beso",
      message: `¡Felicidades, mi amor, encontraste todas las contraseñas!  
                Has encontrado el tesoro más valioso: nuestro amor.  
                Sos la persona más especial en mi vida, y quiero pasar el resto de mis días a tu lado.  
                Te amo. 💖🎉`,
    },
    {
      title: "Lo lograste!",
      pista: "💖 Podes reclamarme tu premio 💖",
      password: "", // No necesita contraseña
      message: `La verdad no esperaba que lo completes jaja, 
                pero bueno ahora estoy en deuda, enviame las contraseñas y vas a obtener tu regalo💕`,
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
      setIsPasswordCorrect(true); // Cambiar el estado a "correcto"
    } else {
      alert("Contraseña incorrecta. ¡Seguí buscando! 💔");
    }
  };

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1); // Avanzar al siguiente paso
    setMessage(""); // Limpiar el mensaje
    setIsPasswordCorrect(false); // Reiniciar el estado del botón
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
      ) : currentStep < steps.length - 1 ? (
        <Step
          step={currentStep}
          title={steps[currentStep].title}
          pista={steps[currentStep].pista}
          onPasswordSubmit={handlePasswordSubmit}
          onNextStep={handleNextStep} // Pasar la función para avanzar
          message={message}
          isPasswordCorrect={isPasswordCorrect} // Pasar el estado de la contraseña
        />
      ) : (
        <div className="final-message dedicatoria">
          <h1>{steps[steps.length - 1].title}</h1>
          <p className="dedicatoria-mensaje">{steps[steps.length - 1].message}</p>
        </div>
      )}
    </div>
  );
};

export default App;