export const paymentCheckoutStyles = {
  container: "min-h-screen max-w-lg mx-auto flex flex-col pb-14 px-4",
  headlineSection: "mb-7 mt-20 text-center",
  headline: "headline mb-2",
  headlineSubtitle: "text-lg max-w-md mx-auto font-medium",
  timerSection: "w-full mb-7 flex flex-col items-center",
  timerBarBg: "w-full h-2 bg-peach-100 rounded-full overflow-hidden relative",
  timerBar: "h-2 bg-peach-600 rounded-full transition-all duration-300 animate-pulse",
  timerTextRow: "flex items-center gap-2 mt-2",
  timerLabel: "text-peach-600 font-semibold text-md tracking-[0.1em]",
  timerValue: "text-peach-700 font-bold text-lg tabular-nums",
  timerNote: "text-xs mt-1",
  deliveryWindowSection: "rounded-xl bg-black/75 backdrop-blur-md shadow-zen px-7 py-5 flex flex-col gap-2 mb-5 mt-2 border border-white/10",
  deliveryWindowLabel: "font-bold mr-3 text-leafgreen-700",
  deliveryWindowValue: "text-peach-800 font-semibold",
  paymentSection: "bg-black/60 backdrop-blur-md rounded-xl shadow px-7 py-4 mb-6 border border-white/10",
  paymentTitle: "font-semibold mb-2 text-leafgreen-200",
  paymentOptions: "flex flex-col gap-3",
  paymentOptionRow: "flex items-center gap-3",
  paymentRadio: "accent-peach-600 w-5 h-5",
  paymentOptionLabel: "font-medium",
  upiDetailsSection: "pl-8 flex flex-col gap-2",
  upiDetailsLabel: "text-sm text-muted-foreground",
  upiDetailsCodeRow: "flex items-center gap-2",
  upiDetailsCode: "bg-black/40 px-3 py-1.5 rounded-lg text-peach-400 font-medium",
  upiDetailsNote: "text-xs text-muted-foreground mt-1",
  actionButtonRow: "flex items-center justify-center gap-3",
  backButton: `
    font-manrope text-base px-7 py-3 rounded-lg font-normal
    shadow-none transition-all focus-visible:ring-2 ring-accent/20
    backdrop-blur-sm
  `,
  startPaymentButton: `
    bg-peach-600 hover:bg-peach-500 
    font-bold py-3 px-8 rounded-xl shadow-lg 
    transition-all text-xl shadow-zen
  `,
}; 