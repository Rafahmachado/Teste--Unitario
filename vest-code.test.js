// const { Vestibular } = require('./vest-code.test.js');

// //  mock substitui as chamadas reais ao banco de dados
// const findOneMock = jest.fn();
// const createMock = jest.fn();

// Vestibular.findOne = findOneMock;
// Vestibular.create = createMock;

// async function criarOuAtualizarVestibular(vestibularId, novoVestibular, anoVestibular) {
//   let vestibular = null;

//   if (vestibularId && vestibularId !== "outro") {
//     // Utiliza o mock aqui
//     vestibular = await findOneMock({
//       where: {
//         id: vestibularId,
//       }
//     });
//   }

//   if (vestibular && (vestibular.ano !== anoVestibular) && anoVestibular !== 0 || novoVestibular) {
//     // Utiliza o mock aqui
//     vestibular = await createMock({
//       nome: novoVestibular || vestibular.nome,
//       ano: anoVestibular,
//     });
//   }

//   if (!vestibular) {
//     return { id: null };
//   }
//   return vestibular;
// }

// module.exports = {
//   criarOuAtualizarVestibular
// };

// vestibular.test.js

// Primeiro, fazemos o mock do modelo Vestibular
// const { Vestibular } = require('../models');


const { criarOuAtualizarVestibular } = require('./vest-code');
const { Vestibular } = require('../models');

jest.mock('../models', () => ({
    Vestibular: {
        findOne: jest.fn(),
        create: jest.fn(),
    },
}));

describe('criarOuAtualizarVestibular', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve criar um novo vestibular se vestibularId for nulo e novoVestibular fornecido', async () => {
        const novoVestibular = 'Novo Vestibular';
        const anoVestibular = 2023;

        Vestibular.create.mockResolvedValue({ id: 1, nome: novoVestibular, ano: anoVestibular });

        const result = await criarOuAtualizarVestibular(null, novoVestibular, anoVestibular);

        expect(Vestibular.create).toHaveBeenCalledWith({
            nome: novoVestibular,
            ano: anoVestibular,
        });
        expect(result).toEqual({ id: 1, nome: novoVestibular, ano: anoVestibular });
    });

    it('deve atualizar o vestibular existente se vestibularId for fornecido e anoVestibular for diferente', async () => {
        const vestibularId = 1;
        const novoVestibular = 'Vestibular Atualizado';
        const anoVestibular = 2023;
        const vestibularExistente = { id: vestibularId, nome: 'Vestibular Antigo', ano: 2022, save: jest.fn() };

        Vestibular.findOne.mockResolvedValue(vestibularExistente);

        const result = await criarOuAtualizarVestibular(vestibularId, novoVestibular, anoVestibular);

        expect(Vestibular.findOne).toHaveBeenCalledWith({ where: { id: vestibularId } });
        expect(vestibularExistente.nome).toBe(novoVestibular);
        expect(vestibularExistente.ano).toBe(anoVestibular);
        expect(vestibularExistente.save).toHaveBeenCalled();
        expect(result).toEqual(vestibularExistente);
    });

    it('deve retornar null se não encontrar o vestibular e não for possível criar um novo', async () => {
        Vestibular.findOne.mockResolvedValue(null);
        Vestibular.create.mockResolvedValue(null);

        const result = await criarOuAtualizarVestibular('inexistente', null, 0);

        expect(result).toEqual({ id: null });
    });
});


