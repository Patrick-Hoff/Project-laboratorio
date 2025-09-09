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
        texto: cents.toLocaleString("pe-BR", {
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