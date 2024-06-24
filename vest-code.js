//const vestibular = (criarOuatualizar) => {
//  return criarOuatualizar
//}

//module.exports = { criarOuatualizar};

// __mocks__/vest-code.test.js


// 


const { Vestibular } = require('../models');

async function criarOuAtualizarVestibular(vestibularId, novoVestibular, anoVestibular) {
    let vestibular = null;

    if (vestibularId && vestibularId !== "outro") {
        vestibular = await Vestibular.findOne({
            where: {
                id: vestibularId,
            }
        });
    }

    if (vestibular && ((vestibular.ano !== anoVestibular && anoVestibular !== 0) || novoVestibular)) {
        // Atualizar o vestibular existente
        vestibular.nome = novoVestibular || vestibular.nome;
        vestibular.ano = anoVestibular;
        await vestibular.save();
    } else if (!vestibular) {
        // Criar novo vestibular
        vestibular = await Vestibular.create({
            nome: novoVestibular,
            ano: anoVestibular,
        });
    }

    if (!vestibular) {
        return { id: null };
    }
    return vestibular;
}

module.exports = {
    criarOuAtualizarVestibular
};
