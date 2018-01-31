
export const niceCryptoNum = (num) => {
  const fl = parseFloat(num)

  return Math.abs(fl) < 1.0 ? fl.toFixed(4) : fl.toFixed(2)
}
