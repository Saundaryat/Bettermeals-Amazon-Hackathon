export const sharedPageStyles = {
  // Main container styles - Mobile First
  container: "min-h-screen max-w-6xl mx-auto py-3 flex flex-col px-4 sm:px-0 bg-white",
  
  // Loading container styles - Mobile First
  loadingContainer: "min-h-screen max-w-6xl mx-auto flex flex-col pb-20 sm:pb-32 px-4 bg-white",
  
  // Header section styles
  header: "mb-6 mt-5 text-center",
  title: "headline mb-1 text-black",
  subtitle: "text-lg text-muted-foreground max-w-xl mx-auto italic mb-2 text-black/70",
  loadingTitle: "headline mb-1 text-black",
  loadingSubtitle: "text-lg text-muted-foreground max-w-xl mx-auto italic mb-2 text-black/70",
  
  // Main content area styles - Mobile First
  mainContent: "rounded-2xl bg-white p-4 sm:p-5 shadow-zen flex-1 flex flex-col border border-black/10",
  
  // Footer container - Mobile First (sticky buttons)
  footer: "sticky bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-black/10 px-4 py-4 z-50",
  
  // Action buttons container - Mobile First
  actionButtonsContainer: "flex flex-col-reverse sm:flex-row items-center justify-end gap-3",
  
  // Button styles - Mobile First
  button: `
    font-manrope text-base px-6 sm:px-7 py-3 rounded-lg font-normal
    bg-[#f7e6cf] text-black hover:bg-[#f7e6cf]/90
    shadow-none border border-[#f7e6cf]
    transition-all outline-none focus-visible:ring-2 ring-accent/20
    backdrop-blur-sm w-full sm:w-auto
  `,
  backButton: `
    font-manrope text-base px-6 sm:px-7 py-3 rounded-lg font-normal
    bg-black/5 text-black hover:bg-black/10
    shadow-none border border-black/10
    transition-all outline-none focus-visible:ring-2 ring-accent/20
    backdrop-blur-sm w-full sm:w-auto
  `,
  
  // Mobile navigation dots styles
  navigationDots: "flex justify-center items-center gap-2 mt-4 mb-2 sm:hidden",
  navigationDot: (isActive: boolean) => `
    w-2 h-2 rounded-full transition-all
    ${isActive ? "bg-peach-400" : "bg-peach-200/30"}
  `,
};

// Meal Plan specific styles
export const mealPlanStyles = {
  ...sharedPageStyles,
  
  // Carousel styles
  carousel: "w-full relative",
  
  // Carousel item styles
  carouselItem: "flex flex-col items-center gap-3",
  
  // Day header styles - Mobile First
  dayHeader: "font-semibold text-lg md:text-xl text-black tracking-wide mb-1 text-center",
  
  // Day content container
  dayContent: "flex flex-col gap-4 w-full",
  
  // Empty state styles
  emptyState: "rounded-xl border-black/10 py-8 px-4 sm:px-5 bg-black/5 flex flex-col items-center justify-center",
  emptyStateText: "text-muted-foreground text-center text-black/70",
  
  // Meal container styles - Mobile First
  mealContainer: "rounded-xl border-black/10 py-4 px-4 sm:px-5 bg-black/5 flex flex-col gap-4",
  
  // Meal type header styles
  mealTypeHeader: "flex items-center gap-2",
  mealTypeIcon: "text-peach-600 flex-shrink-0",
  mealTypeText: "font-semibold text-black text-base sm:text-[18px]",
  
  // Dishes and add-ons grid - Mobile First
  dishesGrid: "grid grid-cols-1 md:grid-cols-2 gap-4",
  
  // Common dishes container - Mobile First
  commonDishesContainer: "flex flex-col md:flex-row gap-3 md:col-span-2",
  
  // Side dishes container (spans 1 column starting from md)
  sideDishesContainer: "flex flex-col gap-3 md:col-span-1",
  
  // Individual dish styles - Mobile First
  dishContainer: "flex items-center gap-3 bg-black/5 border-black/10 rounded-lg px-3 py-3 w-full max-w-md sm:flex-1",
  dishImage: "w-16 h-16 object-cover rounded-md border-black/5 flex-shrink-0",
  dishContent: "flex flex-col flex-1 min-w-0",
  dishName: "font-medium text-black text-sm leading-[1.2] break-words",
  dishQuantity: "text-xs text-peach-700",
  
  // Tag styles
  tagsContainer: "flex flex-wrap gap-1.5 mt-2",
  tag: "inline-flex items-center px-2.5 py-1 bg-leafgreen-500/10 text-leafgreen-700 rounded-full text-xs font-medium border border-black/10 backdrop-blur-sm hover:bg-black/10 hover:text-leafgreen-900 transition-all duration-200",
  
  // Personal add-ons container - Mobile First
  addonsContainer: "flex flex-col justify-start lg:justify-center",
  addonsTitle: "font-medium text-sm text-muted-foreground mb-2 text-black/80",
  addonsList: "flex flex-col gap-2",
  
  // Individual addon styles
  addonItem: "flex gap-2 items-start text-sm glassy px-3 py-2 rounded-lg bg-leafgreen-500/5 text-leafgreen-800",
  addonIcon: "flex-shrink-0 mt-0.5",
  addonContent: "flex flex-col min-w-0 flex-1",
  addonUserName: "font-semibold",
  addonText: "break-words",
  noAddonsText: "text-peach-700 text-sm",
  
  // Day navigation bar styles - optimized for 3-day centered layout
  dayNavigation: "flex items-center justify-center gap-2 sm:gap-3 mb-6 px-1 sm:px-0",
  dayNavButton: (isActive: boolean) => `
    flex-shrink-0 px-3 py-2 sm:px-4 sm:py-3 rounded-lg transition-all
    ${isActive 
      ? "bg-[#f7e6cf] border-peach-400/60 text-peach-900 shadow-sm scale-105 font-semibold" 
      : "bg-peach-200/30 border-black/10 text-black/70 hover:bg-black/10 hover:text-black/90 hover:scale-102"
    }
    text-center min-w-[70px] sm:min-w-[80px]
  `,
  dayNavButtonInner: "flex flex-col items-center gap-0.5",
  dayNavText: "text-xs sm:text-sm font-medium leading-tight text-black",
  dayNavDate: "text-xs opacity-70 leading-tight text-black/70",
  scrollIndicator: "text-black/70 hover:text-black/90 px-2 py-2 text-lg font-bold transition-all hover:scale-110",
  
  // Navigation buttons - Desktop only
  carouselPrevious: "hidden sm:flex",
  carouselNext: "hidden sm:flex",
  
  // Mobile navigation buttons styles
  mobileNavContainer: "flex justify-between items-center absolute top-1/2 -translate-y-1/2 w-full px-2 sm:hidden",
  mobileNavButton: "bg-black/10 hover:bg-black/20 text-black p-1.5 rounded-full backdrop-blur-sm border border-black/10 transition-all",
  mobileNavButtonDisabled: "bg-black/5 text-black/50 p-1.5 rounded-full backdrop-blur-sm border border-black/5 transition-all cursor-not-allowed",
  
  // Day header with navigation styles
  dayHeaderWithNav: "flex items-center justify-between w-full mb-1",
  dayTitle: "font-semibold text-lg md:text-xl text-black tracking-wide",
  mobileNavButtons: "flex items-center gap-2 sm:hidden",

  // Modal and alternate button styles
  modalContent: "sm:max-w-xl bg-white text-black backdrop-blur-md border border-black/10 rounded-2xl shadow-zen",
  modalTitle: "text-2xl text-black",
  alternateButton: "mt-2 w-full bg-[#f7e6cf] text-black hover:bg-[#f7e6cf]/90 border border-[#f7e6cf] py-3 text-base font-normal transition-all outline-none focus-visible:ring-2 ring-accent/20 backdrop-blur-sm shadow-none",
};

// Grocery List specific styles
export const groceryListStyles = {
  ...sharedPageStyles,
  
  // Grid layout styles - Mobile First
  gridContainer: `
    grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4
    w-full overflow-x-visible px-1
  `,
  
  // Aisle group styles - Mobile First
  aisleGroup: `
    flex flex-col items-center bg-black/5 backdrop-blur-md rounded-xl shadow-zen border border-black/10
    px-4 py-5 w-full h-fit
  `,
  aisleGroupMinHeight: {
    minHeight: "350px"
  },
  
  // Aisle header styles
  aisleHeader: "flex items-center gap-2 mb-4 text-black font-bold text-lg",
  aisleIcon: "text-2xl",
  
  // Item list styles
  itemList: "flex flex-col gap-3 w-full",
  emptyItem: "text-muted-foreground text-sm pl-2 text-black/70",
  
  // Individual item styles - Mobile First
  itemContainer: (checked: boolean) => `
    flex flex-col gap-1 w-full px-3 py-3 rounded-lg border transition shadow
    ${!checked ? 'bg-black/10 border-black/20 opacity-60' : 'bg-black/5 border-black/10'}
  `,
  
  // Item content styles - Mobile First
  itemContent: "flex items-center gap-3 min-w-0",
  
  // Checkbox styles
  checkbox: "w-4 h-4 rounded border-2 border-black/20 text-peach-600 focus:ring-peach-500 focus:ring-2",
  
  // Label styles - Mobile First
  itemLabel: (checked: boolean) => `font-manrope text-base truncate cursor-pointer
    ${!checked ? "line-through text-black/40" : "text-black"}
    transition
  `,
  
  // Item details styles - Mobile First
  itemDetails: "pl-9",
  itemQuantity: "text-xs text-peach-700 font-semibold block",
  priceUnavailable: "text-yellow-600 ml-2",
  
  // Cost display styles - Mobile First
  costDisplay: "text-lg font-semibold text-black flex-1 text-center sm:text-right",
  costAmount: "font-bold text-xl text-peach-700",
  unpricedItems: "text-sm text-muted-foreground ml-2 text-black/70",
};
