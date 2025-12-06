// tailwind.config.js
module.exports = {
    content: [
      "./node_modules/flowbite/**/*.js", // Add this line
      "./src/**/*.{html,js,jsx,ts,tsx}", // Your project paths
    ],
    theme: {
      extend: {
        // Standardized Typography Scale
        fontSize: {
          // Display sizes - for hero sections
          'display-lg': ['3.8125rem', { lineHeight: '1.1', fontWeight: '700' }],      // 61px (56+5)
          'display': ['3.3125rem', { lineHeight: '1.15', fontWeight: '700' }],        // 53px (48+5)
          'display-sm': ['2.8125rem', { lineHeight: '1.2', fontWeight: '700' }],      // 45px (40+5)
          
          // Heading sizes
          'h1': ['2.5625rem', { lineHeight: '1.25', fontWeight: '700' }],             // 41px (36+5)
          'h2': ['2.1875rem', { lineHeight: '1.3', fontWeight: '600' }],              // 35px (30+5)
          'h3': ['1.8125rem', { lineHeight: '1.35', fontWeight: '600' }],             // 29px (24+5)
          'h4': ['1.5625rem', { lineHeight: '1.4', fontWeight: '600' }],              // 25px (20+5)
          'h5': ['1.4375rem', { lineHeight: '1.45', fontWeight: '600' }],             // 23px (18+5)
          'h6': ['1.3125rem', { lineHeight: '1.5', fontWeight: '600' }],              // 21px (16+5)
          
          // Body text sizes
          'body-lg': ['1.4375rem', { lineHeight: '1.6' }],                            // 23px (18+5)
          'body': ['1.3125rem', { lineHeight: '1.6' }],                               // 21px (16+5)
          'body-sm': ['1.1875rem', { lineHeight: '1.5' }],                            // 19px (14+5)
          
          // Small/Caption sizes
          'caption': ['1.0625rem', { lineHeight: '1.4' }],                            // 17px (12+5)
          'caption-sm': ['1rem', { lineHeight: '1.4' }],                              // 16px (11+5)
          
          // Table text
          'table-header': ['1.1875rem', { lineHeight: '1.4', fontWeight: '500' }],    // 19px (14+5)
          'table-cell': ['1.1875rem', { lineHeight: '1.5' }],                         // 19px (14+5)
        },
        
        // Standardized Font Weights
        fontWeight: {
          'normal': '400',
          'medium': '500',
          'semibold': '600',
          'bold': '700',
          'extrabold': '800',
        },
        
        // Font Family
        fontFamily: {
          'sans': ['Inter', 'Roboto', 'system-ui', '-apple-system', 'sans-serif'],
          'heading': ['Inter', 'Roboto', 'system-ui', '-apple-system', 'sans-serif'],
        },
        
        // Letter Spacing
        letterSpacing: {
          'tighter': '-0.02em',
          'tight': '-0.01em',
          'normal': '0',
          'wide': '0.01em',
          'wider': '0.02em',
          'widest': '0.05em',
        },
      },
    },
    plugins: [
      require('flowbite/plugin'),
    ],
  }
  