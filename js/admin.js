// Admin Dashboard JavaScript
class AdminDashboard {
    constructor() {
        this.init();
    }

    init() {
        this.initializeCharts();
        this.initializeEventListeners();
        this.initializeSidebar();
    }

    initializeCharts() {
        this.createRevenueExpenditureChart();
        this.createBudgetChart();
    }

    createRevenueExpenditureChart() {
        const ctx = document.getElementById('revenueExpenditureChart')?.getContext('2d');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    {
                        label: 'Revenue (₱)',
                        data: [450000, 520000, 480000, 510000, 490000, 397350, 420000, 460000, 500000, 480000, 520000, 550000],
                        borderColor: '#27ae60',
                        backgroundColor: 'rgba(39, 174, 96, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Expenditure (₱)',
                        data: [420000, 480000, 450000, 470000, 460000, 380000, 400000, 420000, 450000, 430000, 460000, 480000],
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Monthly Revenue vs Expenditure 2024',
                        font: { size: 16, weight: 'bold' }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₱' + (value / 1000).toLocaleString() + 'K';
                            }
                        }
                    }
                }
            }
        });
    }

    createBudgetChart() {
        const ctx = document.getElementById('budgetChart')?.getContext('2d');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Health Services', 'Education', 'Infrastructure', 'Waste Management', 'Peace and Order'],
                datasets: [{
                    data: [25, 20, 30, 15, 10],
                    backgroundColor: [
                        '#3498db', '#2ecc71', '#9b59b6', '#f1c40f', '#e67e22'
                    ],
                    borderColor: 'white',
                    borderWidth: 3,
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                cutout: '60%'
            }
        });
    }

    initializeEventListeners() {
        // Sidebar toggle for mobile
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                document.querySelector('.admin-sidebar').classList.toggle('active');
            });
        }

        // Notification bell
        const notificationBtn = document.querySelector('.btn-notification');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', this.showNotifications);
        }

        // Initialize tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    initializeSidebar() {
        // Add active class to current page
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }

    showNotifications() {
        // In a real application, this would show a notifications dropdown
        AdminUtils.showToast('Showing notifications...', 'info');
    }
}

// Utility functions for admin
class AdminUtils {
    static showToast(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `alert alert-${type} alert-dismissible fade show`;
        toast.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.querySelector('.admin-content').prepend(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    static confirmAction(message) {
        return confirm(message);
    }

    static formatCurrency(amount) {
        return '₱' + parseFloat(amount).toLocaleString('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
}

// Initialize admin dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new AdminDashboard();
});

// Global admin functions
function showAddProjectModal() {
    const modal = new bootstrap.Modal(document.getElementById('addProjectModal'));
    modal.show();
}

function saveProject() {
    AdminUtils.showToast('Project saved successfully!', 'success');
    const modal = bootstrap.Modal.getInstance(document.getElementById('addProjectModal'));
    modal.hide();
}

function showAddTaxModal() {
    const modal = new bootstrap.Modal(document.getElementById('addTaxModal'));
    modal.show();
}

function saveTaxRecord() {
    AdminUtils.showToast('Tax record saved successfully!', 'success');
    const modal = bootstrap.Modal.getInstance(document.getElementById('addTaxModal'));
    modal.hide();
}

function showAddUserModal() {
    const modal = new bootstrap.Modal(document.getElementById('addUserModal'));
    modal.show();
}

function saveUser() {
    AdminUtils.showToast('User saved successfully!', 'success');
    const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
    modal.hide();
}

function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const dateRange = document.getElementById('dateRange').value;
    const format = document.getElementById('reportFormat').value;
    
    AdminUtils.showToast(`Generating ${reportType} report for ${dateRange} in ${format.toUpperCase()} format...`, 'info');
}