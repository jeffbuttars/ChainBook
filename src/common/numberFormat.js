
export const niceCryptoNum = (num) => {
  const fl = parseFloat(num)

  return fl < 10.0 ? fl.toFixed(4) : fl.toFixed(2)
}
