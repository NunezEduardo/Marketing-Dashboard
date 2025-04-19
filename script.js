// Variables globales
let customerData = [];
let filteredData = [];
let charts = {};

// Función principal que se ejecuta cuando el documento está listo
document.addEventListener('DOMContentLoaded', function() {
    // Cargar los datos del CSV
    loadCSVData();
    
    // Configurar los eventos de los botones de filtro
    document.getElementById('apply-filters').addEventListener('click', applyFilters);
    document.getElementById('reset-filters').addEventListener('click', resetFilters);
});

// Función para cargar los datos del CSV
function loadCSVData() {
    Papa.parse('marketing_campaign.csv', {
        download: true,
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: function(results) {
            customerData = results.data;
            filteredData = [...customerData];
            
            // Procesar los datos
            processData();
            
            // Inicializar los filtros
            initializeFilters();
            
            // Actualizar el dashboard
            updateDashboard();
        },
        error: function(error) {
            console.error('Error al cargar el archivo CSV:', error);
        }
    });
}

// Función para procesar los datos
function processData() {
    // Calcular la edad a partir del año de nacimiento
    const currentYear = new Date().getFullYear();
    customerData.forEach(customer => {
        customer.Age = currentYear - customer.Year_Birth;
        
        // Calcular el gasto total
        customer.TotalSpending = (
            (customer.MntWines || 0) + 
            (customer.MntFruits || 0) + 
            (customer.MntMeatProducts || 0) + 
            (customer.MntFishProducts || 0) + 
            (customer.MntSweetProducts || 0) + 
            (customer.MntGoldProds || 0)
        );
        
        // Convertir la fecha de cliente a formato legible
        if (customer.Dt_Customer) {
            const dateParts = customer.Dt_Customer.split('-');
            if (dateParts.length === 3) {
                customer.Dt_Customer = `${dateParts[0]}/${dateParts[1]}/${dateParts[2]}`;
            }
        }
    });
}

// Función para inicializar los filtros
function initializeFilters() {
    // Obtener valores únicos para los filtros
    const educationValues = [...new Set(customerData.map(customer => customer.Education))].filter(Boolean);
    const maritalValues = [...new Set(customerData.map(customer => customer.Marital_Status))].filter(Boolean);
    
    // Llenar los selectores de filtro
    const educationFilter = document.getElementById('education-filter');
    educationValues.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        educationFilter.appendChild(option);
    });
    
    const maritalFilter = document.getElementById('marital-filter');
    maritalValues.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        maritalFilter.appendChild(option);
    });
}

// Función para aplicar filtros
function applyFilters() {
    const educationFilter = document.getElementById('education-filter').value;
    const maritalFilter = document.getElementById('marital-filter').value;
    const incomeFilter = document.getElementById('income-filter').value;
    
    filteredData = customerData.filter(customer => {
        // Filtro de educación
        if (educationFilter !== 'all' && customer.Education !== educationFilter) {
            return false;
        }
        
        // Filtro de estado civil
        if (maritalFilter !== 'all' && customer.Marital_Status !== maritalFilter) {
            return false;
        }
        
        // Filtro de ingresos
        if (incomeFilter !== 'all') {
            const income = customer.Income || 0;
            
            if (incomeFilter === '0-30000' && (income < 0 || income > 30000)) {
                return false;
            } else if (incomeFilter === '30001-60000' && (income < 30001 || income > 60000)) {
                return false;
            } else if (incomeFilter === '60001-90000' && (income < 60001 || income > 90000)) {
                return false;
            } else if (incomeFilter === '90001+' && income < 90001) {
                return false;
            }
        }
        
        return true;
    });
    
    updateDashboard();
}

// Función para restablecer filtros
function resetFilters() {
    document.getElementById('education-filter').value = 'all';
    document.getElementById('marital-filter').value = 'all';
    document.getElementById('income-filter').value = 'all';
    
    filteredData = [...customerData];
    updateDashboard();
}

// Función para actualizar el dashboard
function updateDashboard() {
    updateKPIs();
    updateCharts();
    updateTable();
}

// Función para actualizar los KPIs
function updateKPIs() {
    // Total de clientes
    document.getElementById('total-customers').textContent = filteredData.length;
    
    // Ingreso promedio
    const avgIncome = filteredData.reduce((sum, customer) => sum + (customer.Income || 0), 0) / filteredData.length;
    document.getElementById('avg-income').textContent = '$' + avgIncome.toFixed(2);
    
    // Tasa de respuesta
    const responseCount = filteredData.filter(customer => customer.Response === 1).length;
    const responseRate = (responseCount / filteredData.length) * 100;
    document.getElementById('response-rate').textContent = responseRate.toFixed(2) + '%';
    
    // Tasa de quejas
    const complaintCount = filteredData.filter(customer => customer.Complain === 1).length;
    const complaintRate = (complaintCount / filteredData.length) * 100;
    document.getElementById('complaint-rate').textContent = complaintRate.toFixed(2) + '%';
}

// Función para actualizar los gráficos
function updateCharts() {
    // Destruir gráficos existentes para evitar duplicados
    Object.values(charts).forEach(chart => chart.destroy());
    charts = {};
    
    // Gráfico de distribución por educación
    createEducationChart();
    
    // Gráfico de distribución por estado civil
    createMaritalChart();
    
    // Gráfico de distribución por edad
    createAgeChart();
    
    // Gráfico de distribución por ingresos
    createIncomeChart();
    
    // Gráfico de gasto por categoría de producto
    createProductSpendingChart();
    
    // Gráfico de canales de compra
    createPurchaseChannelsChart();
    
    // Gráfico de relación ingresos vs gasto
    createIncomeSpendingChart();
    
    // Gráfico de tasa de aceptación por campaña
    createCampaignAcceptanceChart();
    
    // Gráfico de perfil de clientes que responden
    createRespondersProfileChart();
}

// Función para crear el gráfico de distribución por educación
function createEducationChart() {
    const educationCounts = {};
    
    filteredData.forEach(customer => {
        if (customer.Education) {
            educationCounts[customer.Education] = (educationCounts[customer.Education] || 0) + 1;
        }
    });
    
    const ctx = document.getElementById('education-chart').getContext('2d');
    charts.education = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(educationCounts),
            datasets: [{
                data: Object.values(educationCounts),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

// Función para crear el gráfico de distribución por estado civil
function createMaritalChart() {
    const maritalCounts = {};
    
    filteredData.forEach(customer => {
        if (customer.Marital_Status) {
            maritalCounts[customer.Marital_Status] = (maritalCounts[customer.Marital_Status] || 0) + 1;
        }
    });
    
    const ctx = document.getElementById('marital-chart').getContext('2d');
    charts.marital = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(maritalCounts),
            datasets: [{
                data: Object.values(maritalCounts),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

// Función para crear el gráfico de distribución por edad
function createAgeChart() {
    // Crear rangos de edad
    const ageRanges = {
        '18-30': 0,
        '31-40': 0,
        '41-50': 0,
        '51-60': 0,
        '61-70': 0,
        '71+': 0
    };
    
    filteredData.forEach(customer => {
        const age = customer.Age;
        
        if (age <= 30) {
            ageRanges['18-30']++;
        } else if (age <= 40) {
            ageRanges['31-40']++;
        } else if (age <= 50) {
            ageRanges['41-50']++;
        } else if (age <= 60) {
            ageRanges['51-60']++;
        } else if (age <= 70) {
            ageRanges['61-70']++;
        } else {
            ageRanges['71+']++;
        }
    });
    
    const ctx = document.getElementById('age-chart').getContext('2d');
    charts.age = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(ageRanges),
            datasets: [{
                label: 'Número de Clientes',
                data: Object.values(ageRanges),
                backgroundColor: '#36A2EB'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Función para crear el gráfico de distribución por ingresos
function createIncomeChart() {
    // Crear rangos de ingresos
    const incomeRanges = {
        '0-30K': 0,
        '30K-60K': 0,
        '60K-90K': 0,
        '90K-120K': 0,
        '120K+': 0
    };
    
    filteredData.forEach(customer => {
        const income = customer.Income || 0;
        
        if (income <= 30000) {
            incomeRanges['0-30K']++;
        } else if (income <= 60000) {
            incomeRanges['30K-60K']++;
        } else if (income <= 90000) {
            incomeRanges['60K-90K']++;
        } else if (income <= 120000) {
            incomeRanges['90K-120K']++;
        } else {
            incomeRanges['120K+']++;
        }
    });
    
    const ctx = document.getElementById('income-chart').getContext('2d');
    charts.income = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(incomeRanges),
            datasets: [{
                label: 'Número de Clientes',
                data: Object.values(incomeRanges),
                backgroundColor: '#FF6384'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Función para crear el gráfico de gasto por categoría de producto
function createProductSpendingChart() {
    // Calcular el gasto total por categoría
    const totalSpending = {
        'Vinos': 0,
        'Frutas': 0,
        'Carne': 0,
        'Pescado': 0,
        'Dulces': 0,
        'Oro': 0
    };
    
    filteredData.forEach(customer => {
        totalSpending['Vinos'] += customer.MntWines || 0;
        totalSpending['Frutas'] += customer.MntFruits || 0;
        totalSpending['Carne'] += customer.MntMeatProducts || 0;
        totalSpending['Pescado'] += customer.MntFishProducts || 0;
        totalSpending['Dulces'] += customer.MntSweetProducts || 0;
        totalSpending['Oro'] += customer.MntGoldProds || 0;
    });
    
    const ctx = document.getElementById('product-spending-chart').getContext('2d');
    charts.productSpending = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(totalSpending),
            datasets: [{
                label: 'Gasto Total',
                data: Object.values(totalSpending),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ]
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Función para crear el gráfico de canales de compra
function createPurchaseChannelsChart() {
    // Calcular el total de compras por canal
    let webPurchases = 0;
    let catalogPurchases = 0;
    let storePurchases = 0;
    
    filteredData.forEach(customer => {
        webPurchases += customer.NumWebPurchases || 0;
        catalogPurchases += customer.NumCatalogPurchases || 0;
        storePurchases += customer.NumStorePurchases || 0;
    });
    
    const totalPurchases = webPurchases + catalogPurchases + storePurchases;
    const webPercentage = (webPurchases / totalPurchases) * 100;
    const catalogPercentage = (catalogPurchases / totalPurchases) * 100;
    const storePercentage = (storePurchases / totalPurchases) * 100;
    
    const ctx = document.getElementById('purchase-channels-chart').getContext('2d');
    charts.purchaseChannels = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Web', 'Catálogo', 'Tienda'],
            datasets: [{
                data: [webPercentage, catalogPercentage, storePercentage],
                backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.raw.toFixed(2) + '%';
                        }
                    }
                }
            }
        }
    });
}

// Función para crear el gráfico de relación ingresos vs gasto
function createIncomeSpendingChart() {
    // Preparar datos para el gráfico de dispersión
    const scatterData = filteredData.map(customer => ({
        x: customer.Income || 0,
        y: customer.TotalSpending || 0
    }));
    
    const ctx = document.getElementById('income-spending-chart').getContext('2d');
    charts.incomeSpending = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Ingresos vs Gasto',
                data: scatterData,
                backgroundColor: 'rgba(54, 162, 235, 0.5)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Ingresos'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Gasto Total'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

// Función para crear el gráfico de tasa de aceptación por campaña
function createCampaignAcceptanceChart() {
    // Calcular la tasa de aceptación para cada campaña
    const campaignAcceptance = {
        'Campaña 1': 0,
        'Campaña 2': 0,
        'Campaña 3': 0,
        'Campaña 4': 0,
        'Campaña 5': 0,
        'Última Campaña': 0
    };
    
    filteredData.forEach(customer => {
        if (customer.AcceptedCmp1 === 1) campaignAcceptance['Campaña 1']++;
        if (customer.AcceptedCmp2 === 1) campaignAcceptance['Campaña 2']++;
        if (customer.AcceptedCmp3 === 1) campaignAcceptance['Campaña 3']++;
        if (customer.AcceptedCmp4 === 1) campaignAcceptance['Campaña 4']++;
        if (customer.AcceptedCmp5 === 1) campaignAcceptance['Campaña 5']++;
        if (customer.Response === 1) campaignAcceptance['Última Campaña']++;
    });
    
    // Calcular porcentajes
    const totalCustomers = filteredData.length;
    Object.keys(campaignAcceptance).forEach(campaign => {
        campaignAcceptance[campaign] = (campaignAcceptance[campaign] / totalCustomers) * 100;
    });
    
    const ctx = document.getElementById('campaign-acceptance-chart').getContext('2d');
    charts.campaignAcceptance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(campaignAcceptance),
            datasets: [{
                label: 'Tasa de Aceptación (%)',
                data: Object.values(campaignAcceptance),
                backgroundColor: '#4BC0C0'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Función para crear el gráfico de perfil de clientes que responden
function createRespondersProfileChart() {
    // Separar clientes que responden y que no responden
    const responders = filteredData.filter(customer => customer.Response === 1);
    const nonResponders = filteredData.filter(customer => customer.Response === 0);
    
    // Calcular promedios para ambos grupos
    const calculateAverage = (data, field) => {
        return data.reduce((sum, customer) => sum + (customer[field] || 0), 0) / data.length;
    };
    
    const avgAgeResponders = calculateAverage(responders, 'Age');
    const avgAgeNonResponders = calculateAverage(nonResponders, 'Age');
    
    const avgIncomeResponders = calculateAverage(responders, 'Income');
    const avgIncomeNonResponders = calculateAverage(nonResponders, 'Income');
    
    const avgSpendingResponders = calculateAverage(responders, 'TotalSpending');
    const avgSpendingNonResponders = calculateAverage(nonResponders, 'TotalSpending');
    
    const ctx = document.getElementById('responders-profile-chart').getContext('2d');
    charts.respondersProfile = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Edad', 'Ingresos (÷1000)', 'Gasto Total (÷100)'],
            datasets: [
                {
                    label: 'Responden',
                    data: [avgAgeResponders, avgIncomeResponders / 1000, avgSpendingResponders / 100],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgb(54, 162, 235)',
                    pointBackgroundColor: 'rgb(54, 162, 235)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(54, 162, 235)'
                },
                {
                    label: 'No Responden',
                    data: [avgAgeNonResponders, avgIncomeNonResponders / 1000, avgSpendingNonResponders / 100],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgb(255, 99, 132)',
                    pointBackgroundColor: 'rgb(255, 99, 132)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(255, 99, 132)'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0
                }
            }
        }
    });
}

// Función para actualizar la tabla de datos
function updateTable() {
    const tableBody = document.querySelector('#customers-table tbody');
    tableBody.innerHTML = '';
    
    // Limitar a 100 filas para rendimiento
    const displayData = filteredData.slice(0, 100);
    
    displayData.forEach(customer => {
        const row = document.createElement('tr');
        
        // Crear celdas para cada columna
        row.innerHTML = `
            <td>${customer.ID}</td>
            <td>${customer.Year_Birth}</td>
            <td>${customer.Education || ''}</td>
            <td>${customer.Marital_Status || ''}</td>
            <td>${customer.Income ? '$' + customer.Income.toFixed(2) : ''}</td>
            <td>${customer.Kidhome}</td>
            <td>${customer.Teenhome}</td>
            <td>${customer.Dt_Customer || ''}</td>
            <td>${customer.Recency}</td>
            <td>$${customer.TotalSpending.toFixed(2)}</td>
            <td>${customer.Response === 1 ? 'Sí' : 'No'}</td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Inicializar DataTable si no está ya inicializada
    if (!$.fn.DataTable.isDataTable('#customers-table')) {
        $('#customers-table').DataTable({
            paging: true,
            searching: true,
            ordering: true,
            info: true,
            language: {
                search: "Buscar:",
                lengthMenu: "Mostrar _MENU_ registros por página",
                zeroRecords: "No se encontraron registros",
                info: "Mostrando página _PAGE_ de _PAGES_",
                infoEmpty: "No hay registros disponibles",
                infoFiltered: "(filtrado de _MAX_ registros totales)",
                paginate: {
                    first: "Primero",
                    last: "Último",
                    next: "Siguiente",
                    previous: "Anterior"
                }
            }
        });
    } else {
        // Refrescar la tabla si ya está inicializada
        $('#customers-table').DataTable().clear().rows.add($(tableBody).find('tr')).draw();
    }
}