const cssVars = {
  colorPrimary: '--color-primary',
  colorText: '--color-text',
  background: '--background',
  shadowSmall: '--shadow-small',
  borderRadius: '--border-radius',
} as const

export const tokens = {
  [cssVars.colorPrimary]: '#f1c32d',
  [cssVars.colorText]: '#3B3B3B',
  [cssVars.background]: '#fff',
  [cssVars.shadowSmall]: '0 5px 10px rgba(0, 0, 0, 0.12)',
  [cssVars.borderRadius]: '5px',
} as const

export const token = (key: keyof typeof cssVars) => `var(${cssVars[key]})`

export const printVars = () => {
  const assignments = []
  for (const [varName, value] of Object.entries(tokens)) {
    assignments.push(`${varName}: ${value}`)
  }
  return assignments.join(';\n')
}
