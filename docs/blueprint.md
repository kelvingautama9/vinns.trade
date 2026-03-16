# **App Name**: Vinns Trade

## Core Features:

- Investment Calculation Engine: Robust TypeScript functions to calculate nominal and real future values for lump sums and monthly annuities (both ordinary and due), incorporating the Fisher Equation for the real rate of return and error handling for zero/negative rates.
- Interactive Input & Parameters: An intuitive user interface with sliders and input fields for essential financial parameters: Current Savings, Monthly Savings, Expected Return, Inflation Rate, and Time Horizon.
- Performance Visualization Chart: A dual-line chart visualizing the projection of both nominal growth and inflation-adjusted (real) growth of investments over time for clear financial insight.
- Inflation Impact Insight Tool: A dynamic generative AI tool providing personalized explanations of the 'Loss of Purchasing Power' in Rupiah, comparing a standard savings account with the user's proposed investment strategy.
- Secure User Simulation Management: Allows authenticated users to securely create, save, retrieve, and delete their personal investment simulation scenarios. Implemented with Firebase Authentication and Firestore Security Rules to ensure data ownership and privacy.
- Core Application Navigation: A structured navigation menu for essential pages including 'Home', 'Real-Rate Investment Engine', and placeholder links for future features like 'Financial Freedom Calculator'.

## Style Guidelines:

- Black: #000000 (Pure Black)
- White: #FFFFFF (Pure White)
- Light Gray: #CCCCCC (for borders/dividers)
- Medium Light Gray: #999999
- Medium Dark Gray: #666666
- Text Gray: #333333 (Primary body text)
- Dark Gray: #262626 (Secondary background)
- Amber: #FC9D0F (for warnings/medium risk)
- Green: #029D06 (for success/positive growth)
- Red: #BC0202 (for danger/loss/inflation alert)
- Primary font: 'Inter' (sans-serif) for all text elements, chosen for its modern, legible, and objective aesthetic, suitable for financial data.
- Size hierarchy: Carefully scaled font sizes ranging from 24px/32px for H1 headings to 14px for labels and 16px for input values, ensuring optimal readability across devices.
- Container: Max-width 1200px with responsive side padding (16px mobile, 32px desktop) to maintain a focused content area.
- Header: Sticky header with a Glassmorphism effect (semi-transparent background and blur filter) and a subtle bottom border, providing modern visual depth.
- Main Card elements: Employ a 'Rounded-xl' (12px) border-radius with a distinct box-shadow for prominent content containers.
- Responsiveness: A two-column layout for desktop (input form on left, summary/output on right) transitioning to a single, full-width column for tablets and mobile devices with adjusted spacing and font sizes for mobile-friendliness.
- Clean, minimalist line icons for navigation elements, input add-ons, and other functional UI components to complement the modern, utilitarian aesthetic.
- Micro-interactions: Smooth count-up animations for changing numerical results, subtle hover states for data rows to enhance readability, and eased transitions for buttons.