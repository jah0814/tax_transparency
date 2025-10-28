// User Dashboard JavaScript
class UserDashboard {
    constructor() {
        this.init();
    }

    init() {
        this.initializeCharts();
        this.initializeEventListeners();
        this.loadUserData();
    }

    initializeCharts() {
        this.createPublicRevenueChart();
    }

    createPublicRevenueChart() {
        const ctx = document.getElementById('publicRevenueChart')?.getContext('2d');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Health', 'Education', 'Infrastructure', 'Environment', 'Security'],
                datasets: [{
                    label: 'Budget Allocation (₱)',
                    data: [875000, 700000, 1050000, 525000, 350000],
                    backgroundColor: [
                        '#3498db',
                        '#2ecc71',
                        '#9b59b6',
                        '#f1c40f',
                        '#e67e22'
                    ],
                    borderColor: 'white',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: '2024 Public Budget Allocation',
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

    initializeEventListeners() {
        // User action buttons
        const actionButtons = document.querySelectorAll('.user-action-btn');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleUserAction(btn);
            });
        });

        // Project items
        const projectItems = document.querySelectorAll('.project-item');
        projectItems.forEach(item => {
            item.addEventListener('click', () => {
                this.viewProjectDetails(item);
            });
        });

        // Announcement items
        const announcementItems = document.querySelectorAll('.announcement-item');
        announcementItems.forEach(item => {
            item.addEventListener('click', () => {
                this.viewAnnouncement(item);
            });
        });
    }

    loadUserData() {
        // Simulate loading user-specific data
        const userData = {
            name: document.querySelector('.welcome-section h1').textContent.replace('Welcome back, ', '').replace('! 👋', ''),
            taxCompliance: 85,
            paidAmount: 12500,
            pendingAmount: 2300,
            properties: 2
        };

        // Update UI with user data
        this.updateUserStats(userData);
    }

    updateUserStats(userData) {
        // In a real application, this would update the stats cards
        console.log('Updating user stats:', userData);
    }

    handleUserAction(button) {
        const action = button.querySelector('span').textContent;
        
        switch(action) {
            case 'Pay Taxes':
                window.location.href = 'taxes.php';
                break;
            case 'View Tax History':
                window.location.href = 'taxes.php#history';
                break;
            case 'Track Projects':
                window.location.href = 'projects.php';
                break;
            case 'Update Profile':
                window.location.href = 'profile.php';
                break;
        }
    }

    viewProjectDetails(projectItem) {
        const projectName = projectItem.querySelector('h6').textContent;
        UserUtils.showToast(`Viewing details for: ${projectName}`, 'info');
    }

    viewAnnouncement(announcementItem) {
        const title = announcementItem.querySelector('h6').textContent;
        UserUtils.showToast(`Reading: ${title}`, 'info');
    }
}

// User utility functions
class UserUtils {
    static showToast(message, type = 'info') {
        // Create toast notification
        const toastContainer = document.getElementById('toastContainer') || this.createToastContainer();
        const toastId = 'toast-' + Date.now();
        
        const toastHTML = `
            <div id="${toastId}" class="toast align-items-center text-bg-${type} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">${message}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;
        
        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        const toast = new bootstrap.Toast(document.getElementById(toastId));
        toast.show();
        
        // Remove toast after it's hidden
        document.getElementById(toastId).addEventListener('hidden.bs.toast', function() {
            this.remove();
        });
    }

    static createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
        return container;
    }

    static formatCurrency(amount) {
        return '₱' + parseFloat(amount).toLocaleString('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    static calculateTax(type, value) {
        // Tax calculation logic
        const calculations = {
            property: value * 0.01,
            business: value * 0.02,
            community: 50 + (value * 0.001),
            professional: 300
        };
        
        return calculations[type] || 0;
    }
}

// Initialize user dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new UserDashboard();
});

// Global user functions
function editProfile() {
    const modal = new bootstrap.Modal(document.getElementById('editProfileModal'));
    modal.show();
}

function changePassword() {
    const modal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
    modal.show();
}

function saveProfile() {
    UserUtils.showToast('Profile updated successfully!', 'success');
    const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
    modal.hide();
}

function savePassword() {
    UserUtils.showToast('Password updated successfully!', 'success');
    const modal = bootstrap.Modal.getInstance(document.getElementById('changePasswordModal'));
    modal.hide();
}

function showPaymentModal() {
    const modal = new bootstrap.Modal(document.getElementById('paymentModal'));
    modal.show();
}

function processPayment() {
    UserUtils.showToast('Redirecting to payment gateway...', 'info');
    const modal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
    modal.hide();
}

function calculateTax() {
    const type = document.getElementById('calcTaxType').value;
    const value = parseFloat(document.getElementById('calcTaxValue').value) || 0;
    const taxAmount = UserUtils.calculateTax(type, value);

    document.getElementById('calcResult').innerHTML = `
        <div class="alert alert-info">
            <h4>${UserUtils.formatCurrency(taxAmount)}</h4>
            <p class="mb-0">Estimated tax amount</p>
        </div>
    `;
}

// Project filtering
function filterProjects() {
    const status = document.getElementById('statusFilter').value;
    const category = document.getElementById('categoryFilter').value;
    const location = document.getElementById('locationFilter').value;
    
    const projects = document.querySelectorAll('#projectsGrid > div');
    
    projects.forEach(project => {
        const projectStatus = project.getAttribute('data-status');
        const projectCategory = project.getAttribute('data-category');
        const projectLocation = project.getAttribute('data-location');
        
        const statusMatch = status === 'all' || projectStatus === status;
        const categoryMatch = category === 'all' || projectCategory === category;
        const locationMatch = location === 'all' || projectLocation === location;
        
        if (statusMatch && categoryMatch && locationMatch) {
            project.style.display = 'block';
        } else {
            project.style.display = 'none';
        }
    });
}

function viewProjectDetails(projectId) {
    const projectDetails = {
        1: {
            title: 'Road Rehabilitation - Purok 3',
            description: 'Comprehensive road improvement project including asphalt overlay, drainage installation, and sidewalk construction.',
            budget: '₱520,000',
            status: 'In Progress',
            progress: '75%',
            startDate: 'March 1, 2024',
            endDate: 'June 15, 2024',
            contractor: 'ABC Construction Company',
            updates: [
                'May 15: Asphalt laying completed for 75% of the road',
                'April 30: Drainage system installation in progress',
                'March 15: Site preparation and excavation completed'
            ]
        },
        2: {
            title: 'Public Park Development',
            description: 'Development of community park with playground equipment, benches, walking paths, and green spaces.',
            budget: '₱450,000',
            status: 'In Progress',
            progress: '60%',
            startDate: 'April 5, 2024',
            endDate: 'July 30, 2024',
            contractor: 'Green Spaces Inc.',
            updates: [
                'June 10: Playground equipment installation started',
                'May 25: Walking path construction 50% complete',
                'April 20: Landscaping and tree planting in progress'
            ]
        }
    };

    const project = projectDetails[projectId] || projectDetails[1];
    
    document.getElementById('projectModalTitle').textContent = project.title;
    document.getElementById('projectModalBody').innerHTML = `
        <div>
            <p>${project.description}</p>
            
            <div class="row mb-3">
                <div class="col-md-6">
                    <strong>Budget:</strong> ${project.budget}
                </div>
                <div class="col-md-6">
                    <strong>Status:</strong> <span class="badge bg-${project.status === 'Completed' ? 'success' : project.status === 'In Progress' ? 'warning' : 'secondary'}">${project.status}</span>
                </div>
            </div>
            
            <div class="row mb-3">
                <div class="col-md-6">
                    <strong>Start Date:</strong> ${project.startDate}
                </div>
                <div class="col-md-6">
                    <strong>End Date:</strong> ${project.endDate}
                </div>
            </div>
            
            <div class="mb-3">
                <strong>Contractor:</strong> ${project.contractor}
            </div>
            
            <div class="mb-3">
                <strong>Progress:</strong>
                <div class="progress mt-1">
                    <div class="progress-bar bg-${project.status === 'Completed' ? 'success' : project.status === 'In Progress' ? 'warning' : 'secondary'}" style="width: ${project.progress}">${project.progress}</div>
                </div>
            </div>
            
            <div>
                <strong>Recent Updates:</strong>
                <ul class="mt-2">
                    ${project.updates.map(update => `<li>${update}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    
    const modal = new bootstrap.Modal(document.getElementById('projectDetailsModal'));
    modal.show();
}