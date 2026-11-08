if (window.tailwind) {
  tailwind.config = {
    theme: {
      extend: {
        fontFamily: {
          display: ['Calistoga', 'Georgia', 'serif'],
          body: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
          mono: ['JetBrains Mono', 'Consolas', 'monospace']
        },
        colors: {
          paper: '#f7f4ee',
          ink: '#171717',
          line: '#e4ded2'
        }
      }
    }
  };
}
