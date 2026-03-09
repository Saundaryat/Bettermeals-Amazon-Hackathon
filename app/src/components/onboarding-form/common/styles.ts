// Common onboarding styles and constants

export const COLORS = {
  primary: '#51754f',
  primaryHover: '#4a6b46',
  secondary: '#374151',
  background: 'white',
  border: 'gray-200',
  text: 'gray-900',
  textSecondary: 'gray-600',
  purple: 'purple-300'
} as const;

export const SPACING = {
  container: 'max-w-2xl mx-auto',
  padding: 'px-6 py-6 md:py-12',
  paddingSmall: 'px-6 py-4 md:py-8',
  margin: 'mb-8',
  marginSmall: 'mb-4'
} as const;

export const TYPOGRAPHY = {
  title: 'text-3xl font-bold text-gray-900 mb-4',
  subtitle: 'text-lg text-gray-600',
  sectionTitle: 'text-2xl font-bold text-gray-900 mb-8',
  label: 'text-lg font-semibold text-gray-900 mb-4 block',
  description: 'text-gray-600'
} as const;

export const BUTTONS = {
  primary: 'text-white rounded-lg py-3 px-6 font-medium flex items-center space-x-2',
  secondary: 'text-gray-700 border-gray-300 rounded-lg py-3 px-6 font-medium flex items-center space-x-2',
  card: 'cursor-pointer transition-all duration-200 border-gray-200 hover:border-gray-300',
  cardSelected: 'border-[#51754f] bg-green-50'
} as const;

export const CARDS = {
  base: 'border rounded-lg p-4',
  interactive: 'cursor-pointer transition-all duration-200 border-gray-200 hover:border-gray-300',
  selected: 'border-[#51754f] bg-green-50'
} as const;

export const FORMS = {
  input: 'w-full',
  textarea: 'min-h-[100px] resize-none',
  numberInput: 'w-32',
  checkbox: 'flex items-center space-x-2',
  radio: 'flex items-center space-x-2'
} as const;

export const LAYOUT = {
  container: 'min-h-screen bg-white flex flex-col',
  content: 'flex-1 flex items-center justify-center px-6 py-12',
  contentPadding: 'flex-1 px-6 py-12',
  centered: 'max-w-2xl w-full',
  grid: 'grid grid-cols-2 gap-4',
  flex: 'flex items-center space-x-4'
} as const;

// Common component classes
export const COMMON_CLASSES = {
  // Page containers
  pageContainer: 'min-h-screen bg-white flex flex-col',
  contentContainer: 'flex-1 flex flex-col items-center justify-start px-6 py-6 md:py-12 overflow-y-auto',
  onboardingContainer: 'flex-1 flex flex-col items-center justify-start px-6 py-6 md:py-12 overflow-y-auto w-full',
  contentContainerPadding: 'flex-1 px-6 py-8 md:py-12',

  // Heading styles
  headingContainer: 'text-left w-full mb-6 md:mb-8',
  headingContainerCentered: 'text-center w-full mb-8 md:mb-12',

  // Content areas
  centeredContent: 'max-w-2xl w-full',
  centeredContentSmall: 'max-w-md w-full',

  // Typography
  pageTitle: 'text-3xl font-bold text-gray-900 mb-4',
  pageSubtitle: 'text-lg text-gray-600',
  sectionTitle: 'text-2xl font-bold text-gray-900 mb-8',
  questionTitle: 'text-xl font-semibold text-gray-900 mb-4',
  label: 'text-lg font-semibold text-gray-900 mb-4 block',
  labelSmall: 'text-sm font-bold text-gray-700 mb-3 block',
  description: 'text-gray-600 text-sm',
  descriptionLarge: 'text-gray-600',
  helperText: 'text-sm text-gray-500 mt-3',
  memberTitle: 'text-lg font-semibold text-gray-900',
  cardTitle: 'text-lg font-semibold text-gray-900 mb-2',
  cardDescription: 'text-gray-600',

  // Cards
  card: 'border rounded-lg p-4',
  cardInteractive: 'cursor-pointer transition-all duration-200 border-gray-200 hover:border-gray-300',
  cardSelected: 'border-[#51754f] bg-green-50',

  // Buttons
  buttonPrimary: 'text-white rounded-lg py-3 px-6 font-medium flex items-center space-x-2',
  buttonSecondary: 'text-gray-700 border-gray-300 rounded-lg py-3 px-6 font-medium flex items-center space-x-2',

  // Forms
  input: 'w-full',
  textarea: 'min-h-[100px] resize-none',
  numberInput: 'w-32',

  // Layout
  grid: 'grid grid-cols-2 gap-4',
  flexRow: 'flex items-center space-x-4',
  flexCol: 'flex flex-col space-y-4',

  // Spacing
  marginBottom: 'mb-6 md:mb-8',
  marginBottomSmall: 'mb-4',
  padding: 'px-6 py-6 md:py-12',
  paddingSmall: 'px-6 py-4 md:py-8'
} as const;
