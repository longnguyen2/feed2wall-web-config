function clearSource (source) {
  // using native JSON functions removes reactivity
  // so we can clone an object without mutating the original source
  return JSON.parse(JSON.stringify(source));
}

export { clearSource };