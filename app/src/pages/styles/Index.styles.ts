export const indexStyles = {
  container: "flex flex-col min-h-screen items-center justify-center px-5 text-center",
  containerStyle: { background: "none" }, // Keep gradient on body
  
  content: "flex flex-col gap-8 max-w-xl items-center",
  
  headline: "headline mb-4",
  
  // Commented out paragraph styles for reference
  // paragraph: "text-lg text-black max-w-md mx-auto font-medium",
  
  overviewCard: "bg-black/5 rounded-2xl p-6 shadow-zen max-w-lg mx-auto",
  
  overviewList: "text-left text-base text-black/90 leading-relaxed space-y-2",
  
  listItemNumber: "font-bold mr-2",

  logoContainer: "mb-12",
  
  ctaButton: `
    font-manrope text-base px-7 py-3 rounded-lg font-normal
    bg-[#f7e6cf] text-black hover:bg-[#f7e6cf]/90
    shadow-none border border-[#f7e6cf]
    transition-all outline-none focus-visible:ring-2 ring-accent/20 mt-6
    backdrop-blur-sm
  `,
  
  ctaButtonStyle: {
    boxShadow: "none",
    border: "1px solid #f7e6cf"
  }
}; 