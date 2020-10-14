const cssVars = {
  colorPrimary: '--color-primary',
  colorText: '--color-text',
  background: '--background',
  shadowSmall: '--shadow-small',
  borderRadius: '--border-radius',
  maxWidth: '--max-width',
  spaceS: '--space-s',
  spaceM: '--space-m',
  spaceL: '--space-l',
  spaceXL: '--space-xl',
  fontMedium: '--font-medium',
  lineMedium: '--line-medium',
} as const

export const tokens = {
  [cssVars.colorPrimary]: '#f1c32d',
  [cssVars.colorText]: '#1A202C',
  [cssVars.background]: '#fff',
  [cssVars.shadowSmall]: '0 5px 10px rgba(0, 0, 0, 0.12)',
  [cssVars.borderRadius]: '5px',
  [cssVars.maxWidth]: '880px',
  [cssVars.spaceS]: '4px',
  [cssVars.spaceM]: '8px',
  [cssVars.spaceL]: '16px',
  [cssVars.spaceXL]: '32px',
  [cssVars.fontMedium]: '1rem',
  [cssVars.lineMedium]: '1.5rem',
} as const

export const token = (key: keyof typeof cssVars) => `var(${cssVars[key]})`

export const printVars = () => {
  const assignments = []
  for (const [varName, value] of Object.entries(tokens)) {
    assignments.push(`${varName}: ${value}`)
  }
  return assignments.join(';\n')
}
