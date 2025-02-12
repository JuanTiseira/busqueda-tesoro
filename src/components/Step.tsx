import React from "react";

interface StepProps {
  step: number;
  title: string
  pista: string;
  message: string;
  isPasswordCorrect: boolean;
  onPasswordSubmit: (step: number) => void;
  onNextStep: () => void;
}

const Step: React.FC<StepProps> = ({
  step,
  title,
  pista,
  message,
  isPasswordCorrect,
  onPasswordSubmit,
  onNextStep,
}) => {
  return (
    <div className="step dedicatoria">
      <h1>{title}</h1>
      {isPasswordCorrect || step === 4 ? "" : <div><h2>Pista {step}</h2>
      <p>{pista}</p></div>}
      
      {message && <p className="message">{message}</p>}
      
      <div>
      {isPasswordCorrect || step === 4 ? "" : <div><input
        type="password"
        id={`password-${step}`}
        placeholder="Ingresa la contraseña"
        className="password-input"
      />
      </div>}
      </div>
     
  
      <button
        onClick={() =>
          isPasswordCorrect ? onNextStep() : onPasswordSubmit(step)
        }
        className="comenzar-button"
      >
        {isPasswordCorrect ? "Siguiente" : "Verificar"}
      </button>
    </div>
  );
};

export default Step;