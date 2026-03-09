export const internalDashboardStyles = {
  // Login page styles
  loginContainer: "min-h-screen flex items-center justify-center px-5 bg-white",
  loginContainerStyle: { background: 'none' },
  
  loginBox: "bg-white rounded-2xl shadow-zen px-8 py-10 w-full max-w-sm border border-black/10",
  
  loginTitle: "headline mb-6 text-center text-2xl text-black",
  
  loginForm: "space-y-4",
  
  inputGroup: "",
  
  inputLabel: "block text-black mb-2 font-medium font-manrope",
  
  inputField: "w-full px-3 py-2 rounded-lg border border-black/10 bg-black/5 text-black placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-black/20 transition-all font-manrope",
  
  errorMessage: "text-red-500 text-center font-medium",
  
  loginButton: "w-full font-manrope text-base px-7 py-3 rounded-lg font-semibold bg-[#f7e6cf] hover:bg-[#f7e6cf]/90 text-black shadow-none border border-[#f7e6cf] transition-all mt-6",
  
  // Dashboard page styles
  dashboardContainer: "min-h-screen px-4 py-10 max-w-7xl mx-auto bg-white",
  dashboardContainerStyle: { background: 'none' },
  
  dashboardHeader: "flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4",
  
  dashboardTitle: "headline text-3xl sm:text-4xl pl-4 text-black",
  
  logoutButton: "font-manrope text-base px-6 py-2 rounded-lg font-medium bg-black/5 text-black hover:bg-black/10 border border-black/10 transition-all self-start sm:self-auto",
  
  // Search section styles
  searchContainer: "mb-6 max-w-md",
  
  searchInput: "w-full px-4 py-3 rounded-lg border border-black/10 bg-black/5 text-black placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-black/20 transition-all font-manrope",
  
  // Table styles
  tableContainer: "bg-white rounded-2xl shadow-zen border border-black/10 overflow-hidden",
  
  tableWrapper: "overflow-x-auto",
  
  table: "w-full",
  
  tableHeader: "bg-black/5 border-b border-black/10",
  
  tableHeaderCell: "px-6 py-4 text-left text-black font-semibold font-manrope",
  
  tableRow: (idx: number) => `border-b border-black/5 hover:bg-black/10 transition-colors ${idx % 2 === 0 ? 'bg-black/5' : 'bg-black/0'}`,
  
  tableCell: "px-6 py-4",
  
  tableCellPrimary: "text-black font-medium font-manrope",
  
  tableCellSecondary: "text-sm text-muted-foreground font-manrope mt-1",
  
  tableCellText: "text-black font-manrope",
  
  // Loading and empty states
  loadingCell: "text-center py-12 text-muted-foreground font-manrope",
  
  emptyCell: "text-center py-12 text-muted-foreground font-manrope",
  
  // Status badge styles
  statusBadge: (isPositive: boolean) => `inline-flex px-2 py-1 rounded-full text-xs font-medium ${isPositive ? 'bg-leafgreen-500/20 text-leafgreen-700' : 'bg-peach-500/20 text-peach-700'}`,
}; 