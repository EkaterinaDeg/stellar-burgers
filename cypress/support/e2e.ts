import './commands';

Cypress.on('uncaught:exception', (err, runnable) => {
  console.error('Uncaught exception:', err.message, err.stack);
  if (err.message.includes('Unexpected token') || err.message.includes('ERR_CONNECTION_REFUSED')) {
    return false; // Игнорируем ошибку
  }
  return true;
});