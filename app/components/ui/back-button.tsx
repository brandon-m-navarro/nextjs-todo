// app/components/ui/BackButton.tsx
'use client';

import { useRouter } from 'next/navigation';

interface BackButtonProps {
    text?: string;
    overrideRouter?: string | null;
}

export function BackButton(backButtonProps: BackButtonProps) {
  const router = useRouter();
  const { text = '', overrideRouter = null } = backButtonProps || {};

  const onClickHandler = function () {
    if (overrideRouter !== null) {
      router.replace(overrideRouter);
      router.refresh();
    } else {
      router.back();
    }
  }

  return (
    <button
      onClick={onClickHandler}
      className="inline-flex items-center text-blue-500 hover:text-blue-700 mb-6 transition-colors group cursor-pointer"
    >
      <svg 
        className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Back{text ? ` to ${text}` : ''}
    </button>
  );
}
