const log = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅  ${msg}`),
  error: (msg) => console.error(`❌  ${msg}`),
  warn: (msg) => console.warn(`⚠️  ${msg}`),
};

export default log;
