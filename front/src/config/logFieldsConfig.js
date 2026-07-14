// config/logFieldsConfig.js

export const logFieldsConfig = {
    exame: {
        idLabel: 'ID Exame',
        idKey: 'exameid',
        fields: [
            { key: 'codigo', label: 'Código' },
            { key: 'exame', label: 'Exame' },
            { key: 'duplicar', label: 'Duplicar exame' },
        ],
    },
    paciente: {
        idLabel: 'ID Paciente',
        idKey: 'pacienteid',
        fields: [
            { key: 'nome', label: 'Nome' },
            { key: 'nascimento', label: 'Data de nascimento' },
        ],
    },
};