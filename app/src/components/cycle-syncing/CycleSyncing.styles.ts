export const CycleSyncingStyles = {
    // Page Layout
    pageContainer: "h-[100dvh] bg-white flex flex-col overflow-hidden",
    mainContent: "flex-1 relative flex flex-col min-h-0 max-w-screen-xl mx-auto w-full",
    carouselWrapper: "w-full flex-1 min-h-0 [&>div]:h-full",
    carouselContent: "h-full",
    carouselItemCentered: "flex flex-col items-center pt-2 md:pt-4 px-2 text-center h-full justify-center pb-4",
    carouselItemPadded: "flex flex-col items-center pt-4 md:pt-4 px-6 text-center h-full justify-center pb-4",

    // Header
    header: {
        container: "px-6 py-4 flex items-center justify-between shrink-0 max-w-screen-xl mx-auto w-full",
        menuIconWrapper: "flex items-center gap-2",
        menuIcon: "w-6 h-6 text-[#51754f] opacity-0",
        logoWrapper: "flex items-center gap-2",
        logoImg: "w-8 h-8 md:w-10 md:h-10",
        logoText: "text-xl md:text-2xl font-bold text-[#51754f]",
        spacer: "w-6",
    },

    // Typography
    headings: {
        h1: "text-xl md:text-3xl font-bold text-foreground mb-1 mt-1 md:mb-4",
        h1Large: "text-xl md:text-3xl font-bold text-foreground mb-2 md:mb-4",
        h3Title: "text-xl md:text-2xl font-bold text-[#51754f] transition-all duration-500 min-h-[2.5rem] md:min-h-[3rem] flex items-center justify-center leading-tight max-w-[280px] md:max-w-md",
        h3Card: "text-xs md:text-lg font-bold text-foreground",
        evidenceTitle: "font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2",
    },
    text: {
        body: "text-sm md:text-base text-foreground leading-relaxed mx-auto max-w-[320px] md:max-w-2xl mb-1 md:mb-4 px-4",
        bodySmall: "text-sm md:text-base text-foreground mb-2 md:mb-6 max-w-xs md:max-w-xl mx-auto px-4",
        captionPulse: "text-[10px] md:text-xs text-[#51754f] font-semibold mb-1 md:mb-2 animate-pulse",
        cardDesc: "text-[10px] md:text-sm text-gray-600 mt-0.5 leading-tight",
        beforeAfterTitle: "text-xs md:text-sm font-bold text-gray-800 leading-tight",
        evidenceLink: "block text-xs text-[#51754f] hover:underline truncate",
    },

    // Components
    featureShowcase: {
        container: "w-full flex flex-col items-center justify-start shrink-0 min-h-0",
        imageContainer: "relative w-[30vh] h-[30vh] max-w-[180px] max-h-[180px] md:max-w-[280px] md:max-h-[280px] mb-[2vh]",
        imageWrapper: (isActive: boolean) => `absolute inset-0 transition-opacity duration-1000 flex items-center justify-center border-4 border-white shadow-xl rounded-[2rem] overflow-hidden bg-white ${isActive ? "opacity-100 z-10" : "opacity-0 z-0"}`,
        image: "w-full h-full object-cover",
        textContainer: "flex flex-col items-center space-y-3 h-16",
        dotsContainer: "flex items-center space-x-2",
        dot: (isActive: boolean) => `w-2 h-2 rounded-full transition-all duration-300 ${isActive ? "bg-[#51754f] w-6" : "bg-[#51754f]/30"}`,
    },

    cycleChart: {
        container: "relative w-full max-w-[320px] md:max-w-[480px] h-[25vh] md:h-[35vh] min-h-[180px] max-h-[300px] mx-auto mt-1 md:mt-2 shrink-0",
        phaseItem: "absolute flex flex-col items-center cursor-pointer group",
        phaseImageWrapper: (isActive: boolean) => `transition-all duration-300 ${isActive ? "scale-110" : "scale-90 opacity-70"}`,
        phaseImageInner: (isActive: boolean, color: string, bgColor: string) => `w-14 h-14 md:w-20 md:h-20 rounded-full shadow-lg border-2 transition-colors duration-300 overflow-hidden flex items-center justify-center ${isActive ? `border-[${color}] bg-[${bgColor}]` : `border-[${bgColor}] bg-white`}`,
        phaseImage: "w-full h-full object-cover scale-[2.2]",
        phaseLabel: (isActive: boolean, color: string) => `text-[10px] md:text-sm font-bold mt-1 bg-white/60 backdrop-blur-sm px-1.5 rounded-sm transition-colors ${isActive ? `text-[${color}]` : "text-gray-500"}`,
        phaseDays: "text-[9px] md:text-xs text-gray-500 hidden sm:block",
    },

    detailsCard: {
        container: "w-[90%] max-w-[320px] md:max-w-[450px] bg-white/80 backdrop-blur-sm rounded-xl p-3 md:p-5 shadow-sm border border-gray-100 flex items-start gap-3 md:gap-4 text-left",
        iconWrapper: "p-2 md:p-2.5 rounded-lg shrink-0",
        icon: "w-4 h-4 md:w-6 md:h-6",
    },

    benefits: {
        listContainer: "flex flex-col space-y-2 w-full max-w-[340px] md:max-w-md mx-auto mb-2 px-2",
        itemContainer: "w-full",
        button: "flex items-center justify-start space-x-3 text-xs md:text-sm font-semibold text-[#51754f] bg-[#51754f]/10 px-4 py-2.5 rounded-full hover:bg-[#51754f]/20 transition-all active:scale-95 w-full shadow-sm border border-[#51754f]/10 text-left",
        checkWrapper: "rounded-full bg-[#51754f] p-1 shrink-0",
        checkIcon: "w-3 h-3 text-white",
        popoverContent: "w-64 p-3 bg-white border border-gray-100 shadow-xl rounded-xl",
    },

    beforeAfter: {
        container: "flex flex-col items-center w-full mb-2 md:mb-6 shrink-0",
        imageWrapper: "flex items-center justify-center w-full px-4 mb-3 md:mb-5",
        imageInner: "w-full max-w-[340px] md:max-w-[500px] flex items-center justify-center relative rounded-xl overflow-hidden shadow-sm",
        image: "w-full h-auto object-cover",
        textRow: "flex w-full max-w-[340px] md:max-w-[500px] px-1",
        textCol: "w-1/2 text-center px-2",
    },

    footer: {
        container: "px-6 pb-6 md:pb-8 w-full max-w-md md:max-w-xl mx-auto flex flex-col items-center space-y-4 md:space-y-6 shrink-0",
        dotsWrapper: "flex justify-center space-x-2 md:space-x-4",
        dot: (isActive: boolean) => `w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full transition-colors ${isActive ? "bg-[#51754f]" : "bg-[#E5E7EB]"}`,
        button: "w-full bg-[#51754f] hover:bg-[#4a6b46] text-white text-base md:text-lg h-11 md:h-14 rounded-full font-semibold shadow-lg transition-transform active:scale-95",
    },

    colors: {
        primary: "#51754f",
        menstrual: { border: "#C45E5E", bg: "#F5D0D0", text: "#C45E5E" },
        follicular: { border: "#5F8856", bg: "#D9EBD5", text: "#5F8856" },
        ovulation: { border: "#4A7A82", bg: "#CFE5E8", text: "#4A7A82" },
        luteal: { border: "#523E75", bg: "#DCD6E8", text: "#523E75" },
        estrogen: "#5BBAB5",
        progesterone: "#F4A261",
    }
};
