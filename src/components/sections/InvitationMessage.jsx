import SectionContainer from '../layout/SectionContainer.jsx';
import SectionHeading from '../layout/SectionHeading.jsx';

/**
 * Mensaje de invitación.
 */
export default function InvitationMessage({ weddingData }) {
  const { copy } = weddingData;

  return (
    <SectionContainer id="mensaje" tone="white" as="section">
      <SectionHeading
        eyebrow="Invitación"
        title={copy.invitationTitle}
        description={copy.invitationBody}
      />
    </SectionContainer>
  );
}
