export function generateMockData(template, rows = 8) {
  const keys = new Set()

  template.layout.tables?.forEach(t =>
    t.fields.forEach(f => keys.add(f.key))
  )

  template.layout.charts?.forEach(c => {
    keys.add(c.labelKey)
    c.valueKeys?.forEach(k => keys.add(k))
  })

  return Array.from({ length: rows }).map((_, i) => {
    const row = {}
    keys.forEach(k => {
      if (k.toLowerCase().includes("month")) {
        row[k] = ["Use Real Data","To See","Real Chart", "This's Example"][i % 4]
      } else {
        row[k] = Math.floor(Math.random() * 900) + 100
      }
    })
    return row
  })
}
