export function formatCurrency(value: number): string {
    const formatter = new Intl.NumberFormat('kz-ru', {
        style: 'currency',
        currency: 'KZT',
        minimumFractionDigits: 0
    });
    return formatter.format(value);
}
