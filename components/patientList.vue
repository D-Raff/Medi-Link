<template>
    <div class="patient-list-container">
        <div class="controls-wrapper mb-4">
            <div class="search-box">
                <input type="text" class="form-control border-0 shadow-none" placeholder="Search patients..."
                    v-model="searchQuery" @keyup="handleSearch">
                <i class="bi bi-search search-icon"></i>
            </div>
        </div>

        <div class="patient-list">
            <!-- No results message -->
            <div v-if="searchQuery && filteredPatients.length === 0" class="no-results">
                <div class="no-results-content">
                    <i class="bi bi-search"></i>
                    <h3>No patients found</h3>
                    <p>No patients match the search "{{ searchQuery }}"</p>
                </div>
            </div>

            <!-- Patient list -->
            <ul v-else class="p-list">
                <li v-for="patient in filteredPatients" :key="patient.id" class="patient-card">
                    <div>
                        <div>
                            Patient Name: {{ patient.firstName }} {{ patient.lastName }}
                        </div>
                        <div>
                            <section>Date Of Birth: {{ patient.dateOfBirth }}</section>
                            <section>Email Address: {{ patient.email }}</section>
                            <section>Contact Number: {{ patient.phoneNumber }}</section>
                            <section>Medical Aid: {{ patient.medicalAid }}</section>
                        </div>
                    </div>
                    <div>
                        <section class="notes">
                            <p>Additional notes</p>
                            <p>{{ patient.additionalNotes }}</p>
                        </section>
                    </div>
                    <button @click="deletePatient(patient.id)">Delete Patient</button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { usePatientStore } from '~/stores/patients';

const props = defineProps({
    patients: {
        type: Array,
    }
});

const patientStore = usePatientStore();

const deletePatient = async (id) => {
    await patientStore.deletePatient(id);
};

const searchQuery = ref('');

const filteredPatients = computed(() => {
    if (!searchQuery.value) return props.patients;

    const query = searchQuery.value.toLowerCase();
    return props.patients.filter(patient => {
        return (
            patient.firstName?.toLowerCase().includes(query) ||
            patient.lastName?.toLowerCase().includes(query) ||
            patient.email?.toLowerCase().includes(query) ||
            patient.phoneNumber?.includes(query) ||
            patient.medicalAid?.toLowerCase().includes(query)
        );
    });
});

// Add debouncing if you want to limit the number of filter operations
let timeout = null;
const handleSearch = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        // You can emit an event here if you need to notify the parent component
        // emit('search', searchQuery.value);
    }, 300);
};

</script>

<style scoped>
.patient-list-container {
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
}

.controls-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.search-box {
    position: relative;
    flex: 1;
    min-width: 200px;
}

.search-box input {
    padding-left: 2.5rem;
    background-color: white;
    border-radius: 8px;
}

.search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6c757d;
}

/* ============================= patient list ============================= */
.p-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.patient-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    display: grid;
    grid-template-columns: 1fr 1fr;
}

.patient-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.notes {
    display: block;
}

@media (max-width: 768px) {
    .controls-wrapper {
        flex-direction: column;
    }

    .search-box {
        width: 100%;
    }

    .filter-buttons {
        width: 100%;
        justify-content: space-between;
    }

    .patients-grid {
        grid-template-columns: 1fr;
    }
}
</style>
