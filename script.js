// Intern Management System Application - Vanilla JavaScript Implementation
// State Management and Application Logic

// Application State
const AppState = {
    currentUser: null,
    currentPage: 'landing-page',
    interns: [
        {
            id: '1',
            name: 'Alice Johnson',
            email: 'alice@example.com',
            phone: '(555) 123-4567',
            university: 'MIT',
            program: 'Computer Science',
            skills: ['React', 'JavaScript', 'Python'],
            status: 'active',
            startDate: '2024-01-15',
            endDate: '2024-06-15',
            assignedAdminId: '1'
        },
        {
            id: '2',
            name: 'Bob Smith',
            email: 'bob@example.com',
            phone: '(555) 987-6543',
            university: 'Stanford',
            program: 'Data Science',
            skills: ['Python', 'Machine Learning', 'SQL'],
            status: 'active',
            startDate: '2024-02-01',
            endDate: '2024-07-01',
            assignedAdminId: '1'
        }
    ],
    admins: [
        {
            id: '1',
            name: 'Dr. Sarah Wilson',
            email: 'admin@company.com',
            role: 'HR',
            createdAt: '2024-01-01'
        }
    ],
    tasks: [
        {
            id: '1',
            internId: '1',
            assignedAdminId: '1',
            title: 'React Dashboard Development',
            description: 'Build a responsive dashboard using React and TypeScript',
            deadline: '2024-03-15',
            status: 'in-progress'
        },
        {
            id: '2',
            internId: '2',
            assignedAdminId: '1',
            title: 'Data Analysis Report',
            description: 'Analyze customer data and create visualization report',
            deadline: '2024-03-20',
            status: 'pending'
        }
    ],
    feedback: [],
    attendance: [],
    documents: [],
    news: [
        {
            id: '1',
            title: 'New AI-Powered Task Assignment Feature',
            description: 'InternHive now uses intelligent matching to assign the best tasks to interns based on their skills and interests.',
            date: 'Dec 20, 2024',
            image: 'public/hero-image.jpg',
            createdBy: '1',
            createdAt: '2024-12-20T00:00:00Z'
        },
        {
            id: '2',
            title: 'Real-Time Performance Analytics Dashboard',
            description: 'Track intern progress with comprehensive analytics, including performance trends and achievement milestones.',
            date: 'Dec 15, 2024',
            image: 'public/hero-image.jpg',
            createdBy: '1',
            createdAt: '2024-12-15T00:00:00Z'
        },
        {
            id: '3',
            title: 'Mobile App Now Available',
            description: 'Access InternHive on the go with our new mobile application for both iOS and Android platforms.',
            date: 'Dec 10, 2024',
            image: 'public/hero-image.jpg',
            createdBy: '1',
            createdAt: '2024-12-10T00:00:00Z'
        }
    ]
};

// Utility Functions
function generateId() {
    return Date.now().toString();
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function createBadge(text, variant = '') {
    return `<span class="badge ${variant}">${text}</span>`;
}

// Navigation Functions
function navigateTo(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        AppState.currentPage = pageId;
        
        // Update header visibility
        const header = document.getElementById('header');
        if (pageId === 'admin-dashboard' || pageId === 'intern-dashboard') {
            header.classList.remove('hidden');
            updateHeader();
        } else {
            header.classList.add('hidden');
        }
        
        // Initialize page-specific functionality
        initializePage(pageId);
    }
}

function updateHeader() {
    if (AppState.currentUser) {
        const userName = document.getElementById('user-name');
        const headerSubtitle = document.getElementById('header-subtitle');
        
        userName.textContent = AppState.currentUser.name;
        headerSubtitle.textContent = AppState.currentUser.role === 'admin' ? 'Admin Dashboard' : 'Intern Portal';
    }
}

// Page Initialization
function initializePage(pageId) {
    switch (pageId) {
        case 'landing-page':
            initializeLandingPage();
            break;
        case 'admin-dashboard':
            initializeAdminDashboard();
            break;
        case 'intern-dashboard':
            initializeInternDashboard();
            break;
        case 'database-schema':
            initializeDatabaseSchema();
            break;
    }
}

// Landing Page Functions
function initializeLandingPage() {
    initializeNewsCarousel();
}

let currentNewsIndex = 0;
let newsTimer;

async function initializeNewsCarousel() {
    const newsContainer = document.getElementById('news-container');
    const indicatorsContainer = document.getElementById('news-indicators');
    
    if (!newsContainer || !indicatorsContainer) return;
    
    // Try to load news from Supabase, fallback to local data
    let newsData = AppState.news;
    try {
        if (window.SupabaseDB) {
            const supabaseNews = await window.SupabaseDB.getNews();
            if (supabaseNews && supabaseNews.length > 0) {
                // Transform Supabase data to match our format
                newsData = supabaseNews.map(item => ({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    content: item.content,
                    date: new Date(item.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                    }),
                    image: item.image_url || 'public/hero-image.jpg',
                    createdBy: item.created_by,
                    createdAt: item.created_at
                }));
                // Update AppState with fresh data
                AppState.news = newsData;
            }
        }
    } catch (error) {
        console.error('Error loading news from Supabase:', error);
        // Continue with local data
    }
    
    // Create news items
    newsContainer.innerHTML = newsData.map((item, index) => `
        <div class="news-item ${index === 0 ? 'active' : ''}" data-index="${index}">
            <div class="news-content">
                <div class="news-date">${item.date}</div>
                <h3 class="news-title">${item.title}</h3>
                <p class="news-description">${item.description}</p>
                <button class="btn btn-outline">Read More</button>
            </div>
            <div class="news-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
        </div>
    `).join('');
    
    // Create indicators
    indicatorsContainer.innerHTML = newsData.map((_, index) => `
        <button class="indicator ${index === 0 ? 'active' : ''}" onclick="goToNews(${index})"></button>
    `).join('');
    
    // Set up navigation
    document.getElementById('news-prev').onclick = prevNews;
    document.getElementById('news-next').onclick = nextNews;
    
    // Start auto-rotation
    startNewsTimer();
}

function goToNews(index) {
    currentNewsIndex = index;
    updateNewsDisplay();
    resetNewsTimer();
}

function nextNews() {
    currentNewsIndex = (currentNewsIndex + 1) % AppState.news.length;
    updateNewsDisplay();
    resetNewsTimer();
}

function prevNews() {
    currentNewsIndex = (currentNewsIndex - 1 + AppState.news.length) % AppState.news.length;
    updateNewsDisplay();
    resetNewsTimer();
}

function updateNewsDisplay() {
    // Update news items
    document.querySelectorAll('.news-item').forEach((item, index) => {
        item.classList.toggle('active', index === currentNewsIndex);
    });
    
    // Update indicators
    document.querySelectorAll('.indicator').forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentNewsIndex);
    });
}

function startNewsTimer() {
    newsTimer = setInterval(() => {
        nextNews();
    }, 5000);
}

function resetNewsTimer() {
    clearInterval(newsTimer);
    startNewsTimer();
}

// Authentication Functions
async function handleAdminLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Check hardcoded demo admin first
    if (email === 'admin@company.com' && password === 'admin123') {
        AppState.currentUser = {
            id: '1',
            name: 'Dr. Sarah Wilson',
            email: 'admin@company.com',
            role: 'admin',
            isLoggedIn: true
        };
        showToast('Login successful!');
        navigateTo('admin-dashboard');
        return;
    }
    
    // Check locally created admins
    const localAdmin = AppState.admins.find(a => a.email === email && a.password === password);
    if (localAdmin) {
        AppState.currentUser = {
            id: localAdmin.id,
            name: localAdmin.name,
            email: localAdmin.email,
            role: localAdmin.role,
            isLoggedIn: true
        };
        showToast('Login successful!');
        navigateTo('admin-dashboard');
        return;
    }
    
    // Try Supabase authentication
    try {
        if (window.SupabaseDB) {
            const supabaseAdmin = await window.SupabaseDB.getAdminByEmail(email);
            if (supabaseAdmin && supabaseAdmin.password_hash === password) {
                AppState.currentUser = {
                    id: supabaseAdmin.id,
                    name: supabaseAdmin.name,
                    email: supabaseAdmin.email,
                    role: supabaseAdmin.role,
                    isLoggedIn: true
                };
                showToast('Login successful!');
                navigateTo('admin-dashboard');
                return;
            }
        }
    } catch (error) {
        console.error('Supabase login error:', error);
    }
    
    showToast('Invalid credentials. Try admin@company.com / admin123 or create a new account', 'error');
}

async function handleInternLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Check demo interns first
    const demoIntern = AppState.interns.find(i => i.email === email);
    if (demoIntern && password === 'intern123') {
        AppState.currentUser = {
            id: demoIntern.id,
            name: demoIntern.name,
            email: demoIntern.email,
            role: 'intern',
            isLoggedIn: true
        };
        showToast(`Welcome back, ${demoIntern.name}!`);
        navigateTo('intern-dashboard');
        return;
    }
    
    // Check locally created interns
    const localIntern = AppState.interns.find(i => i.email === email && i.password === password);
    if (localIntern) {
        AppState.currentUser = {
            id: localIntern.id,
            name: localIntern.name,
            email: localIntern.email,
            role: 'intern',
            isLoggedIn: true
        };
        showToast(`Welcome back, ${localIntern.name}!`);
        navigateTo('intern-dashboard');
        return;
    }
    
    // Try Supabase authentication
    try {
        if (window.SupabaseDB) {
            const supabaseIntern = await window.SupabaseDB.getInternByEmail(email);
            if (supabaseIntern && supabaseIntern.password_hash === password) {
                AppState.currentUser = {
                    id: supabaseIntern.id,
                    name: supabaseIntern.name,
                    email: supabaseIntern.email,
                    role: 'intern',
                    isLoggedIn: true
                };
                showToast(`Welcome back, ${supabaseIntern.name}!`);
                navigateTo('intern-dashboard');
                return;
            }
        }
    } catch (error) {
        console.error('Supabase login error:', error);
    }
    
    showToast('Invalid credentials. Try alice@example.com / intern123 or create a new account', 'error');
}

async function handleAdminSignup(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const role = formData.get('role');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    // Basic validation
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters long', 'error');
        return;
    }
    
    // Check if email already exists locally
    const existingAdmin = AppState.admins.find(a => a.email === email);
    if (existingAdmin) {
        showToast('An admin with this email already exists', 'error');
        return;
    }
    
    try {
        // Try to create admin in Supabase first
        if (window.SupabaseDB) {
            const adminData = {
                name,
                email,
                role,
                password_hash: password // In production, this should be properly hashed
            };
            
            const result = await window.SupabaseDB.createAdmin(adminData);
            if (result) {
                showToast('Admin account created successfully!');
                navigateTo('admin-login');
                return;
            }
        }
    } catch (error) {
        console.error('Supabase error, falling back to local storage:', error);
        showToast('Database connection issue. Creating account locally.', 'warning');
    }
    
    // Fallback to local storage
    const newAdmin = {
        id: generateId(),
        name,
        email,
        role,
        password, // Store password for demo purposes
        createdAt: new Date().toISOString()
    };
    
    AppState.admins.push(newAdmin);
    showToast('Admin account created successfully! (Local storage)');
    navigateTo('admin-login');
}

async function handleInternSignup(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const university = formData.get('university');
    const program = formData.get('program');
    const skillsString = formData.get('skills');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    // Basic validation
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters long', 'error');
        return;
    }
    
    // Check if email already exists locally
    const existingIntern = AppState.interns.find(i => i.email === email);
    if (existingIntern) {
        showToast('An intern with this email already exists', 'error');
        return;
    }
    
    // Parse skills
    const skills = skillsString.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    
    try {
        // Try to create intern in Supabase first
        if (window.SupabaseDB) {
            const internData = {
                name,
                email,
                phone,
                university,
                program,
                skills,
                status: 'active',
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                assignedAdminId: AppState.admins.length > 0 ? AppState.admins[0].id : null,
                password_hash: password // In production, this should be properly hashed
            };
            
            const result = await window.SupabaseDB.createIntern(internData);
            if (result) {
                showToast('Intern account created successfully!');
                navigateTo('intern-login');
                return;
            }
        }
    } catch (error) {
        console.error('Supabase error, falling back to local storage:', error);
        showToast('Database connection issue. Creating account locally.', 'warning');
    }
    
    // Fallback to local storage
    const newIntern = {
        id: generateId(),
        name,
        email,
        phone,
        university,
        program,
        skills,
        password, // Store password for demo purposes
        status: 'active',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        assignedAdminId: AppState.admins.length > 0 ? AppState.admins[0].id : null
    };
    
    AppState.interns.push(newIntern);
    showToast('Intern account created successfully! (Local storage)');
    navigateTo('intern-login');
}

function handleLogout() {
    AppState.currentUser = null;
    navigateTo('landing-page');
    showToast('Logged out successfully');
}

// Admin Dashboard Functions
function initializeAdminDashboard() {
    updateAdminStats();
    renderRecentActivity();
    setupAdminTabs();
    renderInternsList();
    renderTasksList();
    renderAttendanceList();
    renderNewsList();
}

function updateAdminStats() {
    const activeInterns = AppState.interns.filter(i => i.status === 'active').length;
    const totalTasks = AppState.tasks.length;
    const completedTasks = AppState.tasks.filter(t => t.status === 'completed').length;
    const pendingTasks = AppState.tasks.filter(t => t.status === 'pending').length;
    
    document.getElementById('active-interns-count').textContent = activeInterns;
    document.getElementById('total-tasks-count').textContent = totalTasks;
    document.getElementById('completed-tasks-count').textContent = completedTasks;
    document.getElementById('pending-tasks-count').textContent = pendingTasks;
}

function renderRecentActivity() {
    const recentActivityList = document.getElementById('recent-activity-list');
    if (!recentActivityList) return;
    
    const recentTasks = AppState.tasks.slice(0, 5);
    recentActivityList.innerHTML = recentTasks.map(task => {
        const intern = AppState.interns.find(i => i.id === task.internId);
        const statusVariant = task.status === 'completed' ? 'success' : task.status === 'in-progress' ? 'warning' : '';
        
        return `
            <div class="flex items-center justify-between border-b pb-2 mb-2">
                <div>
                    <p class="font-medium">${task.title}</p>
                    <p class="text-sm text-muted-foreground">Assigned to: ${intern?.name || 'Unknown'}</p>
                </div>
                ${createBadge(task.status, statusVariant)}
            </div>
        `;
    }).join('');
}

function setupAdminTabs() {
    const navButtons = document.querySelectorAll('#admin-dashboard .nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            switchAdminTab(tabId);
        });
    });
}

function switchAdminTab(tabId) {
    // Update nav buttons
    document.querySelectorAll('#admin-dashboard .nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    
    // Update tab content
    document.querySelectorAll('#admin-dashboard .tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `${tabId}-tab`);
    });
}

function renderInternsList() {
    const internsList = document.getElementById('interns-list');
    if (!internsList) return;
    
    internsList.innerHTML = AppState.interns.map(intern => `
        <div class="item-card">
            <div class="item-header">
                <div class="item-info">
                    <h3>${intern.name}</h3>
                    <p>${intern.email}</p>
                    <p>${intern.university} - ${intern.program}</p>
                    <div class="skills-list">
                        ${intern.skills.map(skill => createBadge(skill, 'secondary')).join('')}
                    </div>
                </div>
                <div class="item-actions">
                    ${createBadge(intern.status, intern.status === 'active' ? 'success' : 'secondary')}
                    <button class="btn btn-outline btn-sm" onclick="editIntern('${intern.id}')">
                        <i data-lucide="edit"></i>
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="deleteIntern('${intern.id}')" style="color: var(--destructive);">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function renderTasksList() {
    const tasksList = document.getElementById('tasks-list');
    if (!tasksList) return;
    
    tasksList.innerHTML = AppState.tasks.map(task => {
        const intern = AppState.interns.find(i => i.id === task.internId);
        const statusVariant = task.status === 'completed' ? 'success' : task.status === 'in-progress' ? 'warning' : '';
        
        return `
            <div class="item-card">
                <div class="item-header">
                    <div class="item-info">
                        <h3>${task.title}</h3>
                        <p>${task.description}</p>
                        <div style="display: flex; gap: 1rem; margin-top: 0.5rem; font-size: 0.875rem;">
                            <span>Assigned to: <strong>${intern?.name || 'Unknown'}</strong></span>
                            <span>Deadline: <strong>${formatDate(task.deadline)}</strong></span>
                        </div>
                        ${task.submissionUrl ? '<div style="margin-top: 0.5rem;"><span style="color: var(--success); font-size: 0.875rem;">✓ Submitted</span></div>' : ''}
                    </div>
                    <div class="item-actions">
                        ${createBadge(task.status, statusVariant)}
                        <button class="btn btn-outline btn-sm">
                            <i data-lucide="edit"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function renderAttendanceList() {
    const attendanceList = document.getElementById('attendance-list');
    if (!attendanceList) return;
    
    attendanceList.innerHTML = AppState.interns.map(intern => `
        <div class="item-card">
            <div class="item-header">
                <div class="item-info">
                    <h3>${intern.name}</h3>
                    <p>${intern.email}</p>
                </div>
                <div class="item-actions">
                    <button class="btn btn-outline btn-sm" onclick="markAttendance('${intern.id}', 'present')" style="color: var(--success);">
                        Present
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="markAttendance('${intern.id}', 'late')" style="color: var(--warning);">
                        Late
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="markAttendance('${intern.id}', 'absent')" style="color: var(--destructive);">
                        Absent
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderNewsList() {
    const newsList = document.getElementById('news-list');
    if (!newsList) return;
    
    newsList.innerHTML = AppState.news.map(newsItem => `
        <div class="item-card">
            <div class="item-header">
                <div class="item-info" style="flex: 1;">
                    <h3>${newsItem.title}</h3>
                    <p>${newsItem.description}</p>
                    <div style="display: flex; gap: 1rem; margin-top: 0.5rem; font-size: 0.875rem;">
                        <span>Date: <strong>${newsItem.date}</strong></span>
                        <span>Created: <strong>${formatDate(newsItem.createdAt)}</strong></span>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn btn-outline btn-sm" onclick="editNews('${newsItem.id}')">
                        <i data-lucide="edit"></i>
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="deleteNews('${newsItem.id}')" style="color: var(--destructive);">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Admin Action Functions
function editIntern(internId) {
    const intern = AppState.interns.find(i => i.id === internId);
    if (!intern) {
        showToast('Intern not found', 'error');
        return;
    }
    
    openEditInternModal(intern);
}

function openEditInternModal(intern) {
    const modal = document.getElementById('edit-intern-modal');
    if (!modal) {
        showToast('Edit intern modal not found', 'error');
        return;
    }
    
    // Populate form fields with intern data
    document.getElementById('edit-intern-name').value = intern.name || '';
    document.getElementById('edit-intern-email').value = intern.email || '';
    document.getElementById('edit-intern-phone').value = intern.phone || '';
    document.getElementById('edit-intern-university').value = intern.university || '';
    document.getElementById('edit-intern-program').value = intern.program || '';
    document.getElementById('edit-intern-skills').value = intern.skills ? intern.skills.join(', ') : '';
    document.getElementById('edit-intern-status').value = intern.status || 'active';
    document.getElementById('edit-intern-start-date').value = intern.startDate || '';
    document.getElementById('edit-intern-end-date').value = intern.endDate || '';
    
    // Store intern ID for form submission
    modal.dataset.internId = intern.id;
    
    // Show modal
    modal.style.display = 'flex';
    
    // Set up form handler
    const form = document.getElementById('edit-intern-form');
    if (form) {
        form.onsubmit = handleEditIntern;
    }
}

function closeEditInternModal() {
    const modal = document.getElementById('edit-intern-modal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('edit-intern-form').reset();
        delete modal.dataset.internId;
    }
}

async function handleEditIntern(event) {
    event.preventDefault();
    const modal = document.getElementById('edit-intern-modal');
    const internId = modal.dataset.internId;
    
    if (!internId) {
        showToast('Intern ID not found', 'error');
        return;
    }
    
    const formData = new FormData(event.target);
    const skillsString = formData.get('skills');
    const skills = skillsString ? skillsString.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0) : [];
    
    // Find and update the intern
    const internIndex = AppState.interns.findIndex(i => i.id === internId);
    if (internIndex === -1) {
        showToast('Intern not found', 'error');
        return;
    }
    
    // Update intern data
    AppState.interns[internIndex] = {
        ...AppState.interns[internIndex],
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        university: formData.get('university'),
        program: formData.get('program'),
        skills: skills,
        status: formData.get('status'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate')
    };
    
    try {
        // Try to update in Supabase if available
        if (window.SupabaseDB) {
            const result = await window.SupabaseDB.updateIntern(internId, AppState.interns[internIndex]);
            if (result) {
                showToast('Intern updated successfully!');
            } else {
                showToast('Intern updated locally (Supabase not available)');
            }
        } else {
            showToast('Intern updated successfully!');
        }
        
        // Refresh the interns list
        renderInternsList();
        updateAdminStats();
        closeEditInternModal();
        
    } catch (error) {
        console.error('Error updating intern:', error);
        showToast('Error updating intern', 'error');
    }
}

function deleteIntern(internId) {
    if (confirm('Are you sure you want to delete this intern?')) {
        AppState.interns = AppState.interns.filter(i => i.id !== internId);
        renderInternsList();
        updateAdminStats();
        showToast('Intern deleted successfully');
    }
}

function markAttendance(internId, status) {
    const attendance = {
        id: generateId(),
        internId,
        date: new Date().toISOString().split('T')[0],
        status,
        checkInTime: status === 'present' ? new Date().toLocaleTimeString() : undefined
    };
    
    AppState.attendance.push(attendance);
    showToast(`Attendance marked as ${status}`);
}

function openCreateTaskModal() {
    const modal = document.getElementById('create-task-modal');
    if (modal) {
        modal.style.display = 'flex';
        populateTaskAssigneeOptions();
        
        // Set up form handler
        const form = document.getElementById('create-task-form');
        if (form) {
            form.onsubmit = handleCreateTask;
        }
    }
}

function closeCreateTaskModal() {
    const modal = document.getElementById('create-task-modal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('create-task-form').reset();
    }
}

function populateTaskAssigneeOptions() {
    const select = document.getElementById('task-assignee');
    if (select) {
        select.innerHTML = '<option value="">Select an intern</option>' +
            AppState.interns.map(intern => 
                `<option value="${intern.id}">${intern.name} (${intern.email})</option>`
            ).join('');
    }
}

function handleCreateTask(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const newTask = {
        id: generateId(),
        title: formData.get('title'),
        description: formData.get('description'),
        internId: formData.get('assignedTo'),
        assignedAdminId: AppState.currentUser?.id,
        status: 'pending',
        priority: formData.get('priority'),
        deadline: formData.get('dueDate'),
        createdAt: new Date().toISOString()
    };
    
    AppState.tasks.push(newTask);
    renderTasksList();
    updateAdminStats();
    closeCreateTaskModal();
    showToast('Task created successfully!');
}

function openCreateNewsModal() {
    const modal = document.getElementById('create-news-modal');
    if (modal) {
        modal.style.display = 'flex';
        
        // Set up form handler
        const form = document.getElementById('create-news-form');
        if (form) {
            form.onsubmit = handleCreateNews;
        }
    }
}

function closeCreateNewsModal() {
    const modal = document.getElementById('create-news-modal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('create-news-form').reset();
    }
}

async function handleCreateNews(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const title = formData.get('title');
    const content = formData.get('content');
    const published = formData.get('published') === 'on';
    const imageFile = formData.get('image');
    
    // Validate required fields
    if (!title || !content) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    // Handle image upload
    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
        // Create a data URL for the uploaded image
        try {
            imageUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = reject;
                reader.readAsDataURL(imageFile);
            });
        } catch (error) {
            console.error('Error reading image file:', error);
            showToast('Error processing image file', 'error');
            return;
        }
    }
    
    const newsData = {
        title: title,
        description: content.substring(0, 150) + (content.length > 150 ? '...' : ''),
        content: content,
        image_url: imageUrl,
        created_by: AppState.currentUser?.id,
        published: published
    };
    
    let supabaseSuccess = false;
    
    // Try to save to Supabase first
    if (window.SupabaseDB) {
        try {
            const result = await window.SupabaseDB.createNews(newsData);
            if (result) {
                supabaseSuccess = true;
                showToast('News article created successfully!');
                // Refresh news list
                await loadNewsFromSupabase();
                renderNewsList();
                closeCreateNewsModal();
                return;
            }
        } catch (error) {
            console.error('Supabase error, falling back to local storage:', error);
            // Continue to local fallback
        }
    }
    
    // Fallback to local storage if Supabase failed or is not available
    if (!supabaseSuccess) {
        try {
            const newNews = {
                id: generateId(),
                title: newsData.title,
                description: newsData.description,
                content: newsData.content,
                date: new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                }),
                image: newsData.image_url || 'public/hero-image.jpg',
                createdBy: newsData.created_by,
                createdAt: new Date().toISOString(),
                published: newsData.published
            };
            
            AppState.news.unshift(newNews);
            renderNewsList();
            closeCreateNewsModal();
            showToast('News article created successfully! (Local storage)');
            
        } catch (error) {
            console.error('Error creating news locally:', error);
            showToast('Error creating news article', 'error');
        }
    }
}

async function loadNewsFromSupabase() {
    try {
        if (window.SupabaseDB) {
            const supabaseNews = await window.SupabaseDB.getNews();
            if (supabaseNews && supabaseNews.length > 0) {
                AppState.news = supabaseNews.map(item => ({
                    id: item.id,
                    title: item.title,
                    description: item.content.substring(0, 150) + '...',
                    content: item.content,
                    date: new Date(item.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                    }),
                    image: item.image_url || 'public/hero-image.jpg',
                    createdBy: item.author_id,
                    createdAt: item.created_at,
                    published: item.published
                }));
            }
        }
    } catch (error) {
        console.error('Error loading news from Supabase:', error);
    }
}

function editNews(newsId) {
    const newsItem = AppState.news.find(n => n.id === newsId);
    if (!newsItem) {
        showToast('News article not found', 'error');
        return;
    }
    
    openEditNewsModal(newsItem);
}

function openEditNewsModal(newsItem) {
    const modal = document.getElementById('edit-news-modal');
    if (!modal) {
        showToast('Edit news modal not found', 'error');
        return;
    }
    
    // Populate form fields with news data
    document.getElementById('edit-news-title').value = newsItem.title || '';
    document.getElementById('edit-news-content').value = newsItem.content || '';
    document.getElementById('edit-news-published').checked = newsItem.published || false;
    
    // Store news ID for form submission
    modal.dataset.newsId = newsItem.id;
    
    // Show modal
    modal.style.display = 'flex';
    
    // Set up form handler
    const form = document.getElementById('edit-news-form');
    if (form) {
        form.onsubmit = handleEditNews;
    }
}

function closeEditNewsModal() {
    const modal = document.getElementById('edit-news-modal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('edit-news-form').reset();
        delete modal.dataset.newsId;
    }
}

async function handleEditNews(event) {
    event.preventDefault();
    const modal = document.getElementById('edit-news-modal');
    const newsId = modal.dataset.newsId;
    
    if (!newsId) {
        showToast('News ID not found', 'error');
        return;
    }
    
    const formData = new FormData(event.target);
    const title = formData.get('title');
    const content = formData.get('content');
    const published = formData.get('published') === 'on';
    const imageFile = formData.get('image');
    
    // Validate required fields
    if (!title || !content) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    // Handle image upload (only if a new image is selected)
    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
        try {
            imageUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = reject;
                reader.readAsDataURL(imageFile);
            });
        } catch (error) {
            console.error('Error reading image file:', error);
            showToast('Error processing image file', 'error');
            return;
        }
    }
    
    // Find and update the news item
    const newsIndex = AppState.news.findIndex(n => n.id === newsId);
    if (newsIndex === -1) {
        showToast('News article not found', 'error');
        return;
    }
    
    // Update news data (keep existing image if no new image uploaded)
    const updatedNews = {
        ...AppState.news[newsIndex],
        title: title,
        description: content.substring(0, 150) + (content.length > 150 ? '...' : ''),
        content: content,
        published: published
    };
    
    // Only update image if a new one was uploaded
    if (imageUrl) {
        updatedNews.image = imageUrl;
    }
    
    let supabaseSuccess = false;
    
    // Try to update in Supabase first
    if (window.SupabaseDB) {
        try {
            const supabaseData = {
                title: title,
                description: updatedNews.description,
                content: content,
                published: published
            };
            
            // Only include image_url if a new image was uploaded
            if (imageUrl) {
                supabaseData.image_url = imageUrl;
            }
            
            const result = await window.SupabaseDB.updateNews(newsId, supabaseData);
            if (result) {
                supabaseSuccess = true;
                showToast('News article updated successfully!');
                // Refresh news list
                await loadNewsFromSupabase();
                renderNewsList();
                closeEditNewsModal();
                return;
            }
        } catch (error) {
            console.error('Supabase error, falling back to local storage:', error);
            // Continue to local fallback
        }
    }
    
    // Fallback to local storage if Supabase failed or is not available
    if (!supabaseSuccess) {
        try {
            AppState.news[newsIndex] = updatedNews;
            renderNewsList();
            closeEditNewsModal();
            showToast('News article updated successfully! (Local storage)');
            
        } catch (error) {
            console.error('Error updating news locally:', error);
            showToast('Error updating news article', 'error');
        }
    }
}

function deleteNews(newsId) {
    if (confirm('Are you sure you want to delete this news item?')) {
        AppState.news = AppState.news.filter(n => n.id !== newsId);
        renderNewsList();
        showToast('News deleted successfully');
    }
}

// Intern Dashboard Functions
function initializeInternDashboard() {
    updateInternStats();
    renderInternRecentTasks();
    renderInternPerformance();
    setupInternTabs();
    renderInternTasksList();
    renderInternAttendanceSummary();
    renderInternPersonalInfo();
    renderInternDetails();
}

function updateInternStats() {
    if (!AppState.currentUser || AppState.currentUser.role !== 'intern') return;
    
    const myTasks = AppState.tasks.filter(t => t.internId === AppState.currentUser.id);
    const completedTasks = myTasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = myTasks.filter(t => t.status === 'in-progress').length;
    const pendingTasks = myTasks.filter(t => t.status === 'pending').length;
    
    document.getElementById('intern-total-tasks').textContent = myTasks.length;
    document.getElementById('intern-completed-tasks').textContent = completedTasks;
    document.getElementById('intern-progress-tasks').textContent = inProgressTasks;
    document.getElementById('intern-pending-tasks').textContent = pendingTasks;
    
    // Update welcome message
    const currentIntern = AppState.interns.find(i => i.id === AppState.currentUser.id);
    if (currentIntern) {
        document.getElementById('intern-welcome').textContent = `Welcome back, ${currentIntern.name}! 👋`;
    }
}

function renderInternRecentTasks() {
    const recentTasksContainer = document.getElementById('intern-recent-tasks');
    if (!recentTasksContainer || !AppState.currentUser) return;
    
    const myTasks = AppState.tasks.filter(t => t.internId === AppState.currentUser.id).slice(0, 3);
    
    recentTasksContainer.innerHTML = myTasks.map(task => {
        const statusVariant = task.status === 'completed' ? 'success' : task.status === 'in-progress' ? 'warning' : '';
        
        return `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem; border: 1px solid var(--border); border-radius: calc(var(--radius) - 2px); margin-bottom: 0.75rem;">
                <div>
                    <p style="font-weight: 500; font-size: 0.875rem;">${task.title}</p>
                    <p style="font-size: 0.75rem; color: var(--muted-foreground);">Due: ${formatDate(task.deadline)}</p>
                </div>
                ${createBadge(task.status, statusVariant)}
            </div>
        `;
    }).join('');
}

function renderInternPerformance() {
    const performanceContainer = document.getElementById('intern-performance');
    if (!performanceContainer || !AppState.currentUser) return;
    
    const myTasks = AppState.tasks.filter(t => t.internId === AppState.currentUser.id);
    const completedTasks = myTasks.filter(t => t.status === 'completed').length;
    const myFeedback = AppState.feedback.filter(f => f.internId === AppState.currentUser.id);
    
    const completionRate = myTasks.length > 0 ? ((completedTasks / myTasks.length) * 100).toFixed(1) : 0;
    const averageRating = myFeedback.length > 0 ? 
        (myFeedback.reduce((sum, f) => sum + f.rating, 0) / myFeedback.length).toFixed(1) : 'N/A';
    
    performanceContainer.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
            <span>Task Completion Rate</span>
            <span style="font-weight: 500;">${completionRate}%</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
            <span>Average Rating</span>
            <span style="font-weight: 500;">${averageRating}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
            <span>Feedback Count</span>
            <span style="font-weight: 500;">${myFeedback.length}</span>
        </div>
    `;
}

function setupInternTabs() {
    const navButtons = document.querySelectorAll('#intern-dashboard .nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            switchInternTab(tabId);
        });
    });
}

function switchInternTab(tabId) {
    // Update nav buttons
    document.querySelectorAll('#intern-dashboard .nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    
    // Update tab content
    document.querySelectorAll('#intern-dashboard .tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `${tabId}-tab`);
    });
}

function renderInternTasksList() {
    const tasksListContainer = document.getElementById('intern-tasks-list');
    if (!tasksListContainer || !AppState.currentUser) return;
    
    const myTasks = AppState.tasks.filter(t => t.internId === AppState.currentUser.id);
    
    tasksListContainer.innerHTML = myTasks.map(task => {
        const statusVariant = task.status === 'completed' ? 'success' : task.status === 'in-progress' ? 'warning' : '';
        
        return `
            <div class="item-card">
                <div style="margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                        <div>
                            <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">${task.title}</h3>
                            <p style="color: var(--muted-foreground); margin-bottom: 0.5rem;">${task.description}</p>
                            <p style="font-size: 0.875rem;"><strong>Deadline:</strong> ${formatDate(task.deadline)}</p>
                        </div>
                        ${createBadge(task.status, statusVariant)}
                    </div>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        ${task.status === 'pending' ? `
                            <button class="btn btn-sm" onclick="startTask('${task.id}')">Start Task</button>
                        ` : ''}
                        ${task.status === 'in-progress' ? `
                            <button class="btn btn-sm" onclick="submitTask('${task.id}')">
                                <i data-lucide="upload"></i>
                                Submit Assignment
                            </button>
                            <button class="btn btn-outline btn-sm" onclick="completeTask('${task.id}')">Mark Complete</button>
                        ` : ''}
                        ${task.status === 'completed' && task.submissionUrl ? `
                            <button class="btn btn-outline btn-sm">
                                <i data-lucide="download"></i>
                                View Submission
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function renderInternAttendanceSummary() {
    const summaryContainer = document.getElementById('intern-attendance-summary');
    if (!summaryContainer || !AppState.currentUser) return;
    
    const myAttendance = AppState.attendance.filter(a => a.internId === AppState.currentUser.id);
    const presentDays = myAttendance.filter(a => a.status === 'present').length;
    const lateDays = myAttendance.filter(a => a.status === 'late').length;
    const absentDays = myAttendance.filter(a => a.status === 'absent').length;
    
    summaryContainer.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span>Total Days</span>
            <span style="font-weight: 500;">${myAttendance.length}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span>Present</span>
            <span style="font-weight: 500; color: var(--success);">${presentDays}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span>Late</span>
            <span style="font-weight: 500; color: var(--warning);">${lateDays}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
            <span>Absent</span>
            <span style="font-weight: 500; color: var(--destructive);">${absentDays}</span>
        </div>
    `;
}

function renderInternPersonalInfo() {
    const personalInfoContainer = document.getElementById('intern-personal-info');
    if (!personalInfoContainer || !AppState.currentUser) return;
    
    const currentIntern = AppState.interns.find(i => i.id === AppState.currentUser.id);
    if (!currentIntern) return;
    
    personalInfoContainer.innerHTML = `
        <div style="margin-bottom: 0.75rem;">
            <label style="font-size: 0.875rem; font-weight: 500; display: block; margin-bottom: 0.25rem;">Name</label>
            <p>${currentIntern.name}</p>
        </div>
        <div style="margin-bottom: 0.75rem;">
            <label style="font-size: 0.875rem; font-weight: 500; display: block; margin-bottom: 0.25rem;">Email</label>
            <p>${currentIntern.email}</p>
        </div>
        <div style="margin-bottom: 0.75rem;">
            <label style="font-size: 0.875rem; font-weight: 500; display: block; margin-bottom: 0.25rem;">Phone</label>
            <p>${currentIntern.phone}</p>
        </div>
        <div style="margin-bottom: 0.75rem;">
            <label style="font-size: 0.875rem; font-weight: 500; display: block; margin-bottom: 0.25rem;">University</label>
            <p>${currentIntern.university}</p>
        </div>
        <div>
            <label style="font-size: 0.875rem; font-weight: 500; display: block; margin-bottom: 0.25rem;">Program</label>
            <p>${currentIntern.program}</p>
        </div>
    `;
}

function renderInternDetails() {
    const detailsContainer = document.getElementById('intern-details');
    if (!detailsContainer || !AppState.currentUser) return;
    
    const currentIntern = AppState.interns.find(i => i.id === AppState.currentUser.id);
    if (!currentIntern) return;
    
    detailsContainer.innerHTML = `
        <div style="margin-bottom: 0.75rem;">
            <label style="font-size: 0.875rem; font-weight: 500; display: block; margin-bottom: 0.25rem;">Status</label>
            <div>${createBadge(currentIntern.status, currentIntern.status === 'active' ? 'success' : 'secondary')}</div>
        </div>
        <div style="margin-bottom: 0.75rem;">
            <label style="font-size: 0.875rem; font-weight: 500; display: block; margin-bottom: 0.25rem;">Start Date</label>
            <p>${formatDate(currentIntern.startDate)}</p>
        </div>
        <div style="margin-bottom: 0.75rem;">
            <label style="font-size: 0.875rem; font-weight: 500; display: block; margin-bottom: 0.25rem;">End Date</label>
            <p>${formatDate(currentIntern.endDate)}</p>
        </div>
        <div>
            <label style="font-size: 0.875rem; font-weight: 500; display: block; margin-bottom: 0.25rem;">Skills</label>
            <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
                ${currentIntern.skills.map(skill => createBadge(skill, 'secondary')).join('')}
            </div>
        </div>
    `;
}

// Intern Action Functions
function startTask(taskId) {
    const task = AppState.tasks.find(t => t.id === taskId);
    if (task) {
        task.status = 'in-progress';
        renderInternTasksList();
        updateInternStats();
        showToast('Task started successfully');
    }
}

function submitTask(taskId) {
    showToast('File upload functionality would be implemented here');
}

function completeTask(taskId) {
    const task = AppState.tasks.find(t => t.id === taskId);
    if (task) {
        task.status = 'completed';
        renderInternTasksList();
        updateInternStats();
        showToast('Task marked as completed');
    }
}

function checkIn() {
    if (!AppState.currentUser) return;
    
    const attendance = {
        id: generateId(),
        internId: AppState.currentUser.id,
        date: new Date().toISOString().split('T')[0],
        status: 'present',
        checkInTime: new Date().toLocaleTimeString()
    };
    
    AppState.attendance.push(attendance);
    renderInternAttendanceSummary();
    showToast('Checked in successfully!');
}

function editProfile() {
    showToast('Edit profile functionality would open a modal here');
}

// Database Schema Functions
function initializeDatabaseSchema() {
    // Schema is already in HTML, just need to set up copy/download functions
}

function copySchema() {
    const schemaText = document.getElementById('sql-schema').textContent;
    navigator.clipboard.writeText(schemaText).then(() => {
        showToast('SQL schema copied to clipboard!');
    }).catch(() => {
        showToast('Failed to copy schema', 'error');
    });
}

function downloadSchema() {
    const schemaText = document.getElementById('sql-schema').textContent;
    const blob = new Blob([schemaText], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'internhive_schema.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('SQL schema downloaded!');
}

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Set up form handlers
    const adminLoginForm = document.getElementById('admin-login-form');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }
    
    const adminSignupForm = document.getElementById('admin-signup-form');
    if (adminSignupForm) {
        adminSignupForm.addEventListener('submit', handleAdminSignup);
    }
    
    const internLoginForm = document.getElementById('intern-login-form');
    if (internLoginForm) {
        internLoginForm.addEventListener('submit', handleInternLogin);
    }
    
    const internSignupForm = document.getElementById('intern-signup-form');
    if (internSignupForm) {
        internSignupForm.addEventListener('submit', handleInternSignup);
    }
    
    // Set up modal close handlers for clicking outside modal
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            if (event.target.id === 'create-news-modal') {
                closeCreateNewsModal();
            } else if (event.target.id === 'create-task-modal') {
                closeCreateTaskModal();
            } else if (event.target.id === 'edit-intern-modal') {
                closeEditInternModal();
            }
        }
    });
    
    // Set up logout handler
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Initialize landing page
    initializeLandingPage();
    
    // Set up search functionality
    const internSearch = document.getElementById('intern-search');
    if (internSearch) {
        internSearch.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const filteredInterns = AppState.interns.filter(intern => 
                intern.name.toLowerCase().includes(searchTerm) ||
                intern.email.toLowerCase().includes(searchTerm)
            );
            
            // Re-render interns list with filtered results
            const internsList = document.getElementById('interns-list');
            if (internsList) {
                internsList.innerHTML = filteredInterns.map(intern => `
                    <div class="item-card">
                        <div class="item-header">
                            <div class="item-info">
                                <h3>${intern.name}</h3>
                                <p>${intern.email}</p>
                                <p>${intern.university} - ${intern.program}</p>
                                <div class="skills-list">
                                    ${intern.skills.map(skill => createBadge(skill, 'secondary')).join('')}
                                </div>
                            </div>
                            <div class="item-actions">
                                ${createBadge(intern.status, intern.status === 'active' ? 'success' : 'secondary')}
                                <button class="btn btn-outline btn-sm" onclick="editIntern('${intern.id}')">
                                    <i data-lucide="edit"></i>
                                </button>
                                <button class="btn btn-outline btn-sm" onclick="deleteIntern('${intern.id}')" style="color: var(--destructive);">
                                    <i data-lucide="trash-2"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('');
                
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        });
    }
});
