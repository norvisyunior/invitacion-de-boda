import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Analytics } from '@vercel/analytics/react';
import weddingData from './data/wedding.js';
import WeddingEnvelope from './components/envelope/WeddingEnvelope.jsx';
import HeroSection from './components/sections/HeroSection.jsx';
import InvitationMessage from './components/sections/InvitationMessage.jsx';
import OurStory from './components/sections/OurStory.jsx';
import CountdownSection from './components/sections/CountdownSection.jsx';
import CeremonyDetails from './components/sections/CeremonyDetails.jsx';
import DressCodeSection from './components/sections/DressCodeSection.jsx';
import ClosingSection from './components/sections/ClosingSection.jsx';
import { useReducedMotionPreference } from './hooks/useReducedMotionPreference.js';

const ENVELOPE_SEEN_KEY = 'wedding-envelope-opened-v1';

function readEnvelopeSeen() {
  try {
    return window.sessionStorage.getItem(ENVELOPE_SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

export default function App() {
  const reduced = useReducedMotionPreference();
  const [invitationReady, setInvitationReady] = useState(() => readEnvelopeSeen());
  const [envelopeVisible, setEnvelopeVisible] = useState(() => !readEnvelopeSeen());
  const mainRef = useRef(null);

  const handleEnvelopeComplete = useCallback(() => {
    setInvitationReady(true);
    setEnvelopeVisible(false);
  }, []);

  useEffect(() => {
    if (!invitationReady) return undefined;

    const id = window.setTimeout(() => {
      const target = document.getElementById('inicio') || mainRef.current;
      if (target && typeof target.focus === 'function') {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    }, reduced ? 50 : 450);

    return () => window.clearTimeout(id);
  }, [invitationReady, reduced]);

  return (
    <div className="relative min-h-[100svh] w-full bg-ivory">
      {envelopeVisible && !invitationReady ? (
        <WeddingEnvelope
          initials={weddingData.couple.initials}
          logo={weddingData.assets?.logo}
          onOpenComplete={handleEnvelopeComplete}
        />
      ) : null}

      <motion.main
        ref={mainRef}
        id="contenido-invitation"
        className="w-full"
        initial={false}
        animate={{
          opacity: invitationReady ? 1 : 0,
        }}
        transition={{ duration: reduced ? 0.15 : 0.55, ease: 'easeOut' }}
        aria-hidden={!invitationReady}
        style={{
          pointerEvents: invitationReady ? 'auto' : 'none',
        }}
      >
        <HeroSection weddingData={weddingData} />
        <InvitationMessage weddingData={weddingData} />
        <OurStory weddingData={weddingData} />
        <CountdownSection weddingData={weddingData} />
        <CeremonyDetails weddingData={weddingData} />
        <DressCodeSection weddingData={weddingData} />
        <ClosingSection weddingData={weddingData} />
      </motion.main>
      
      <Analytics />
    </div>
  );
}
