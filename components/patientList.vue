<template>
    <div class="patient-list-container">
        <div class="controls-wrapper mb-4">
            <!-- <div class="search-box">
                <input type="text" class="form-control" placeholder="Search patients..."
                    v-model="searchQuery" @keyup="handleSearch">
            </div> -->
            <div class="search-box">
                <input type="text" v-model="searchQuery" @keyup="handleSearch" placeholder="Search patients..." class="form-control">
                <span class="search-icon">🔍</span>
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
                    <button @click="editPatient(patient)" data-edit>Edit Patient</button>
                    <button @click="deletePatient(patient.id)" data-delete>Delete Patient</button>
                </li>
            </ul>
        </div>

        <div v-if="showEditModal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Edit Patient</h3>
                    <button class="close-button" @click="handleCancel">&times;</button>
                </div>
                <div class="modal-body">
                    <!-- Your edit form goes here -->
                    <form @submit.prevent="handleEditComplete">
                        <div class="form-group">
                            <label>First Name:</label>
                            <input type="text" v-model="selectedPatient.firstName">
                        </div>
                        <div class="form-group">
                            <label>Last Name:</label>
                            <input type="text" v-model="selectedPatient.lastName">
                        </div>
                        <div class="form-group">
                            <label>Email:</label>
                            <input type="email" v-model="selectedPatient.email">
                        </div>
                        <div class="form-group">
                            <label>Phone Number:</label>
                            <input type="tel" v-model="selectedPatient.phoneNumber">
                        </div>
                        <div class="form-group">
                            <label>Medical Aid:</label>
                            <input type="text" v-model="selectedPatient.medicalAid">
                        </div>
                        <div class="form-group">
                            <label>Additional Notes:</label>
                            <textarea v-model="selectedPatient.additionalNotes"></textarea>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="cancel-btn" @click="handleCancel">Cancel</button>
                            <button type="submit" class="save-btn">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
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

onMounted(() => {
    useGsap.from(".patient-list-container", {
        opacity: 0,
        y: 50,
        duration: 0.5,
        ease: 'power2.out'
    })
})

const patientStore = usePatientStore();
const showEditModal = ref(false);
const selectedPatient = ref(null);

const editPatient = (patient) => {
    selectedPatient.value = patient;
    showEditModal.value = true;
};

const handleEditComplete = async () => {
    try {
        // Create a payload with only the fields that can be updated
        const payload = {
            firstName: selectedPatient.value.firstName,
            lastName: selectedPatient.value.lastName,
            email: selectedPatient.value.email,
            phoneNumber: selectedPatient.value.phoneNumber,
            medicalAid: selectedPatient.value.medicalAid,
            additionalNotes: selectedPatient.value.additionalNotes
        };

        // Call the store's updatePatient method with the id and payload
        await patientStore.updatePatient(selectedPatient.value.id, payload);

        // Close the modal and reset selected patient
        showEditModal.value = false;
        selectedPatient.value = null;
    } catch (error) {
        console.error('Error updating patient:', error);
    }
};


const handleCancel = () => {
    showEditModal.value = false;
    selectedPatient.value = null;
};

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
    flex-wrap: wrap;
    flex-direction: column;
    padding-top: 1rem;
    width: 100%;
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
    max-width: 300px;
    width: 100%;
}

.form-control {
    width: 100%;
    padding: 10px 40px 10px 15px;
    border: 1px solid #ddd;
    border-radius: 20px;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.form-control:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

.search-icon {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
    pointer-events: none;
}


/* ============================= patient list ============================= */
.patient-list {
    width: 100%;
    display: flex;
}

.p-list {
    width: 100%;
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
    gap: 1rem;
    width: 100%;
}

.patient-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.notes {
    display: block;
}

li button {
    background: none;
    border: none;
    cursor: pointer;
    margin-top: 1rem;
}

[data-edit]{
    color: #7FBCD2;
}
[data-delete]{
    color: #d12f42;
}

/* ================================== modal ================================== */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.cancel-btn,
.save-btn {
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}

.cancel-btn {
    background-color: #f8f9fa;
    border: 1px solid #ddd;
}

.save-btn {
    background-color: #007bff;
    color: white;
    border: none;
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
