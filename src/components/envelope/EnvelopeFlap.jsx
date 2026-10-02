/**
 * Solapa superior del sobre (cara frontal y trasera para el giro 3D).
 */
export default function EnvelopeFlap() {
  return (
    <div className="envelope-flap" aria-hidden="true">
      <div className="envelope-flap-face" />
      <div className="envelope-flap-face envelope-flap-face--back" />
    </div>
  );
}
