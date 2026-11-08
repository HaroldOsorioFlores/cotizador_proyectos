if (window.tailwind) {
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
            mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
          },
          boxShadow: {
            soft: '0 18px 55px rgba(15, 23, 42, 0.08)'
          }
        }
      }
    };
}
