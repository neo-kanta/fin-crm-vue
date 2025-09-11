export const stats = {
    total: 1562,
    qualified: 418,
    inPipeline: 943,
    conversionRate: 23, // percent (number)
};

export function buildKeyMetrics(s = stats) {
    return [
        {
            title: 'Total Contacts',
            value: s.total,
            change: '+12%',
            trend: 'up',
            icon: 'i-carbon-user-multiple',
            color: 'blue',
        },
        {
            title: 'Qualified Leads',
            value: s.qualified,
            change: '+8%',
            trend: 'up',
            icon: 'i-carbon-checkmark-filled',
            color: 'green',
        },
        {
            title: 'In Pipeline',
            value: s.inPipeline,
            change: '+15%',
            trend: 'up',
            icon: 'i-carbon-chart-line',
            color: 'purple',
        },
        {
            title: 'Conversion Rate',
            value: `${s.conversionRate}%`,
            change: '-2%',
            trend: 'down',
            icon: 'i-carbon-analytics',
            color: 'orange',
        },
    ];
}

export const keyMetrics = buildKeyMetrics(stats);
