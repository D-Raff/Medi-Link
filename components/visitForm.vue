<template>
    <div id="visit-form">
        <h1>Details for patient visit @ {{ fullDate }}</h1>
        <form @submit.prevent="handleSubmit" ref="formRef">
            <!-- Patient Search/Select -->
            <div class="form-group">
                <label>Search Patient:</label>
                <input type="text" v-model="searchQuery" @input="filterPatients" placeholder="Search by name..."
                    class="search-input">
                <!-- Dropdown for filtered patients -->
                <div v-if="filteredPatients.length && searchQuery" class="patient-dropdown">
                    <div v-for="patient in filteredPatients" :key="patient.id" @click="selectPatient(patient)"
                        class="patient-option">
                        {{ patient.firstName }} {{ patient.lastName }}
                    </div>
                </div>
            </div>

            <!-- Patient Details -->
            <div class="form-group">
                <label>First Name:</label>
                <input type="text" v-model="visit.firstName" readonly>
            </div>

            <div class="form-group">
                <label>Last Name:</label>
                <input type="text" v-model="visit.lastName" readonly>
            </div>

            <div class="form-group">
                <label>Date:</label>
                <input type="date" data-date v-model="visit.date" required>
            </div>

            <div class="form-group">
                <label>Medical Aid:</label>
                <select v-model="visit.medicalAid" required>
                    <option value="">Select option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
            </div>

            <div class="form-group">
                <label>Diagnosis:</label>
                <textarea v-model="visit.diagnosis" required rows="4"></textarea>
            </div>

            <button type="submit" class="submit-btn">Submit Visit</button>
        </form>
    </div>
</template>

<script setup>
import { useVisitStore } from '~/stores/visits';
import { usePatientStore } from '~/stores/patients';
const visitStore = useVisitStore()
const patientStore = usePatientStore();
const formRef = ref(null);

const getCurrentDate = {
    formatted: () => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    },
};
const fullDate = getCurrentDate.formatted();

// Search and filter functionality
const searchQuery = ref('');
const filteredPatients = ref([]);

const filterPatients = () => {
    if (!searchQuery.value) {
        filteredPatients.value = [];
        return;
    }

    const query = searchQuery.value.toLowerCase();
    filteredPatients.value = patientStore.patients.filter(patient =>
        patient.firstName.toLowerCase().includes(query) ||
        patient.lastName.toLowerCase().includes(query)
    );
};
const selectPatient = (patient) => {
    visit.value.firstName = patient.firstName;
    visit.value.lastName = patient.lastName;
    searchQuery.value = `${patient.firstName} ${patient.lastName}`;
    filteredPatients.value = [];
};
const visit = ref({
    firstName: '',
    lastName: '',
    date: getCurrentDate.formatted(),
    medicalAid: '',
    diagnosis: ''
});

const handleSubmit = async () => {
    // Form submission logic
    await visitStore.addVisit(visit.value)



    // GSAP Animation on successful submission
    useGsap.to(formRef.value, {
        scale: 1.02,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
    })

    // Reset all inputs in the form
    formRef.value.querySelectorAll('input, select, textarea').forEach(input => {
        input.value = ''
    })

    // Clear the search query
    searchQuery.value = ''

    // Clear filtered patients list
    filteredPatients.value = []

    // reset the visit ref object
    visit.value = {
        firstName: '',
        lastName: '',
        date: '',
        medicalAid: '',
        diagnosis: ''
    }
}

onMounted(() => {
    useGsap.from("#visit-form", {
        opacity: 0,
        y: 50,
        duration: 0.5,
        ease: 'power2.out'
    })
    document.querySelector('[data-date]').value = fullDate
})

</script>

<style scoped>
#visit-form {
    margin-top: 1rem;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

.form-group {
    margin-bottom: 1rem;
    position: relative;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

.search-input {
    margin-bottom: 0;
}

.patient-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ddd;
    border-top: none;
    border-radius: 0 0 4px 4px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.patient-option {
    padding: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.patient-option:hover {
    background-color: #f5f5f5;
}

.submit-btn {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s;
}

.submit-btn:hover {
    background-color: #0056b3;
}

/* Read-only input styling */
input[readonly] {
    background-color: #f8f9fa;
    cursor: not-allowed;
}
</style>