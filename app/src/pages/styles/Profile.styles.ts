export const profileStyles = {
  container: "bg-white p-4 lg:p-6 pb-24 min-h-screen",
  contentWrapper: "max-w-6xl mx-auto",

  content: "flex-1 flex flex-col gap-4 sm:gap-8",

  // Tabs
  tabItem:
    "px-4 py-2 sm:px-5 sm:py-2.5 text-gray-400 font-medium transition-all duration-200 text-sm sm:text-base rounded-full hover:text-gray-600",
  tabItemActive: "bg-[#51754f] text-white font-bold shadow-md ring-1 ring-[#51754f]/30",

  subNav:
    "flex flex-row w-full overflow-x-auto gap-2 p-2 md:flex-col md:w-64 md:p-3 md:gap-2 bg-white rounded-2xl shadow-sm border border-gray-100 h-fit scrollbar-hide",
  subNavItem:
    "px-3 py-2 sm:px-4 sm:py-3 rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer transition-all duration-200 whitespace-nowrap text-sm font-medium flex items-center justify-between group flex-shrink-0",
  subNavItemActive:
    "bg-[#51754f]/10 text-[#51754f] font-semibold shadow-sm border border-[#51754f]/20",

  // ⬇ Widen card and align it better
  userDetail: "bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 flex-1 transition-all duration-200 hover:shadow-md",
  avatarLg:
    "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl bg-gradient-to-br from-[#51754f]/10 to-[#51754f]/20 text-[#51754f] shadow-inner border border-[#51754f]/20 flex-shrink-0",

  userInfoRow: "flex flex-col gap-3 text-sm text-gray-600 md:flex-row md:items-center md:gap-8 p-3 sm:p-4 bg-gray-50/50 rounded-xl border border-gray-100",
  fieldLabel: "font-semibold text-gray-900 uppercase tracking-wide text-xs",

  tag: "inline-flex items-center px-2.5 py-0.5 sm:px-3 sm:py-1 bg-[#51754f]/10 text-[#51754f] rounded-full text-xs font-medium mr-2 mb-2 border border-[#51754f]/20 shadow-sm",

  detailRow: "flex flex-col gap-1 sm:gap-2 py-3 border-b border-gray-100 md:flex-row md:justify-between hover:bg-gray-50/30 px-2 rounded-lg transition-colors",
  detailKey: "text-sm font-medium text-gray-500",
  detailValue: "text-sm text-gray-900 font-medium",

  // ⬇ Make cards more uniform and slightly larger
  mealScheduleGrid: "grid grid-cols-1 gap-3 sm:gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-3",
  mealScheduleDay:
    "bg-white rounded-xl p-4 sm:p-5 text-sm text-gray-600 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#51754f]/20 transition-all duration-200 group",
  mealScheduleDayTitle: "font-bold mb-2 sm:mb-3 text-gray-900 capitalize flex items-center gap-2 group-hover:text-[#51754f] transition-colors",

  // Household card
  card: "bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 hover:shadow-md transition-shadow",
  cardTitle: "px-1 py-1 sm:py-2 text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-3",

  // Edit button styles - Made outline/ghost to start, or branding solid
  editButton: "px-4 py-2 sm:px-5 sm:py-2 bg-[#51754f] text-white rounded-xl hover:bg-[#51754f]/90 transition-all shadow-sm hover:shadow-md font-medium text-xs sm:text-sm active:scale-95 whitespace-nowrap",
  saveButton: "px-4 py-2 sm:px-5 sm:py-2.5 bg-[#51754f] text-white rounded-xl hover:bg-[#51754f]/90 transition-all shadow-sm hover:shadow-md font-medium text-xs sm:text-sm disabled:opacity-50 active:scale-95",
  cancelButton: "px-4 py-2 sm:px-5 sm:py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium text-xs sm:text-sm disabled:opacity-50 hover:border-gray-300",
  buttonGroup: "flex gap-2 sm:gap-3",

  // Form styles
  formGrid: "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6",
  formField: "space-y-1.5 sm:space-y-2",
  formLabel: "block text-sm font-semibold text-gray-700 mb-1",
  formInput: "w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#51754f]/20 focus:border-[#51754f] transition-all bg-white hover:border-gray-300 text-gray-900 placeholder:text-gray-400 text-sm sm:text-base",
  formSelect: "w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#51754f]/20 focus:border-[#51754f] transition-all bg-white hover:border-gray-300 text-sm sm:text-base",

  // Meal schedule form styles
  mealScheduleFormGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4",
  mealScheduleDayCard: "border border-gray-200 rounded-xl p-3 sm:p-4 hover:border-[#51754f]/30 hover:shadow-sm transition-all bg-white",
  mealScheduleFormDayTitle: "font-bold text-gray-900 mb-2 sm:mb-3 capitalize text-sm",
  mealScheduleOptions: "space-y-2",
  mealScheduleOption: "flex items-center group",
  mealScheduleCheckbox: "mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5 text-[#51754f] bg-white border-gray-300 rounded focus:ring-[#51754f] focus:ring-offset-0 transition-colors cursor-pointer group-hover:border-[#51754f]",

  // Header styles
  header: "mb-4 sm:mb-8 text-xl sm:text-2xl font-bold text-gray-900 flex items-center justify-between",
  headerIcon: "w-5 h-5 sm:w-6 sm:h-6 text-[#51754f]",
  headerTitleGroup: "flex items-center gap-2 sm:gap-3",

  // Navigation styles
  tabNavigation: "flex mb-4 sm:mb-8 gap-1 bg-gray-100 p-1 rounded-full w-fit",

  // User info styles
  userInfoContainer: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-100",
  userInfoLeft: "flex items-center gap-4 sm:gap-5 min-w-0",
  userInfoRight: "flex flex-col items-start sm:items-end gap-1 sm:gap-2 min-w-[180px]",
  userName: "text-xl sm:text-2xl font-bold text-gray-900 truncate tracking-tight",
  userDetails: "text-sm sm:text-base text-gray-500 font-medium",
  userContact: "text-xs sm:text-sm text-gray-500 flex items-center gap-2",
  userContactEmpty: "text-gray-400 italic text-xs sm:text-sm",

  // Layout styles
  mainLayout: "flex flex-col gap-6 sm:gap-8 md:flex-row md:items-start md:gap-8 w-full",
  editFormContainer: "space-y-6 sm:space-y-8 bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm",

  // Table styles
  tableContainer: "overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white mt-4 scrollbar-hide",
  table: "w-full text-sm min-w-[300px]", // ensure min width for scroll
  th: "bg-gray-50 text-left font-semibold text-gray-900 px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-200 uppercase tracking-wider text-[10px] sm:text-xs",
  td: "px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-100 last:border-0 text-gray-700",
  dayCell: "font-medium text-gray-900 capitalize text-xs sm:text-sm",
  checkCell: "text-center w-16 sm:w-24", // reduced width on mobile
  checkIcon: "inline-block w-4 h-4 sm:w-5 sm:h-5 text-[#51754f]",
  dashIcon: "inline-block w-3 h-3 sm:w-4 sm:h-4 text-gray-300",
};
