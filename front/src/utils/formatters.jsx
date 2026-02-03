// Função para formatar número de moeda para BRL (R$)
export function formatarParaBRL(valor) {
    const number = Number(valor) || 0;
    return number.toLocaleString('pt-BR', {
        style: 'currency',
        currency: "BRL"
    })
}


// Realizar o pagamento com a digitação correta no padrão pt-br
export function formatCurrency(raw) {
    const numbers = raw.replace(/\D/g, '');
    const cents = Number.parseInt(numbers || '0', 10) / 100;
    return {
        numero: cents,
        texto: cents.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
    }
}

export function createCurrencyChangeHandler(setNumero, setTexto) {
    return function handleChange(e) {
        const { numero, texto } = formatCurrency(e.target.value);
        setNumero(numero);
        setTexto(texto);
    };
}

export function formatarData(timestamp) {
    // Cria um objeto Date a partir do timestamp
    const data = new Date(timestamp);

    // Cria a formatação personalizada no formato pt-BR (data com hora, minutos e segundos)
    const formato = new Intl.DateTimeFormat('pt-BR', {
         year: 'numeric', // Ano completo
        month: '2-digit', // Mês por extenso
        day: '2-digit', // Dia do mês
        hour: '2-digit', // Hora com 2 dígitos
        minute: '2-digit', // Minutos com 2 dígitos
        second: '2-digit', // Segundos com 2 dígitos
        hour12: false // 24 horas
    });

    // Retorna a data formatada
    return formato.format(data);
}
