import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';

export default function CountUp({ end, duration = 2, suffix = '+' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const value = useMotionValue(0);
  const rounded = useTransform(value, (v) => Math.floor(v));

  useEffect(() => {
    if (inView) {
      const controls = animate(value, end, { duration, ease: 'easeOut' });
      return controls.stop;
    }
  }, [inView, end, duration, value]);

  return (
    <span ref={ref} className="inline-flex items-baseline">
      <motion.span>{rounded}</motion.span>
      <span>{suffix}</span>
    </span>
  );
}
