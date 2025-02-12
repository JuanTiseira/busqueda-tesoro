import React from "react";

interface StepProps {
  step: number;
  pista: string;
  message?: string;
  onPasswordSubmit: (step: number) => void;
}

const Step: React.FC<StepProps> = ({ step, pista, onPasswordSubmit, message }) => {
  return (
    <div className="step-box">
      <p className="pista">{pista}</p>
      {message && <p className="message">💖 {message}</p>}
      {step !== 0 && ( // No mostrar el campo de contraseña en el paso 0
        <>
          <input
            type="text"
            placeholder="Introduce la contraseña"
            id={`password-${step}`}
            className="password-input"
          />
          <button onClick={() => onPasswordSubmit(step)} className="submit-button">
            Verificar
          </button>
        </>
      )}
    </div>
  );
};

export default Step;