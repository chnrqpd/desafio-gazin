const { sequelize } = require('../../models');

beforeAll(async () => {
  process.env.NODE_ENV = 'test';

  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log('Banco de teste configurado');
  } catch (error) {
    console.error('Erro ao configurar banco de teste:', error);
  }
});

afterAll(async () => {
  try {
    await sequelize.close();
    console.log('Conexão com banco de teste fechada');
  } catch (error) {
    console.error('Erro ao fechar banco de teste:', error);
  }
});

beforeEach(async () => {
  try {
    await sequelize.query('DELETE FROM desenvolvedores');
    await sequelize.query('DELETE FROM niveis');
  } catch (error) {
    console.error('Erro na limpeza:', error);
  }
});
