<template>
    <div class="dashboard-container">
        <!-- Header Section -->
        <header class="dashboard-header">
            <h1>Doctor's Dashboard</h1>
            <div class="doctor-info">
                <span>Welcome, Dr. {{ doctorName }}</span>
            </div>
        </header>

        <div class="dashboard-grid">
            <!-- Appointments Section -->
            <div class="appointments-section">
                <h2>Upcoming Appointments</h2>
                <div class="appointments-list">
                    <div v-for="appointment in upcomingAppointments" :key="appointment.id" class="appointment-card">
                        <div class="appointment-time">
                            {{ formatDate(appointment.datetime) }}
                        </div>
                        <div class="appointment-details">
                            <h3>{{ appointment.patientName }}</h3>
                            <p>{{ appointment.reason }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Medical News Section -->
            <div class="news-section">
                <h2>Latest Medical Updates</h2>
                <div class="news-list">
                    <div v-for="news in medicalNews" :key="news.id" class="news-card">
                        <h3>{{ news.title }}</h3>
                        <p>{{ news.summary }}</p>
                        <span class="news-date">{{ formatDate(news.publishedDate) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { format } from 'date-fns'

// Mock data - Replace with real API calls
const doctorName = ref('Khan')
const upcomingAppointments = ref([
    {
        id: 1,
        patientName: 'Jane Smith',
        datetime: new Date('2024-01-20T09:00:00'),
        reason: 'Annual Checkup'
    },
])

const medicalNews = ref([
    {
        id: 1,
        title: 'New Research in Vaccine Development',
        summary: 'Recent breakthrough in vaccine technology shows promising results...',
        publishedDate: new Date()
    },
])

// Date formatting function
const formatDate = (date) => {
    return format(new Date(date), 'MMM dd, yyyy HH:mm')
}

</script>

<style scoped>
.dashboard-container {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.dashboard-header {
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.dashboard-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
}

.appointments-section,
.news-section {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.appointment-card,
.news-card {
    border-bottom: 1px solid #eee;
    padding: 1rem 0;
}

.appointment-card {
    display: flex;
    gap: 1rem;
}

.appointment-time {
    min-width: 140px;
    font-weight: bold;
}

.news-card h3 {
    margin-bottom: 0.5rem;
    color: #2c3e50;
}

.news-date {
    color: #666;
    font-size: 0.9rem;
}

@media (max-width: 768px) {
    .dashboard-grid {
        grid-template-columns: 1fr;
    }
}
</style>