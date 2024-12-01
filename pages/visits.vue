<template>
    <div class="visits-container">
        <div id="vis-nav">
            <button @click="changeVisitDisplay('Visit-list')" class="btn-1"
                :class="{ 'btn-active': visitDisplay === 'Visit-list' }">
                Previous visits
            </button>
            <button @click="changeVisitDisplay('Visit-form')" class="btn-2"
                :class="{ 'btn-active': visitDisplay === 'Visit-form' }">
                New Visit
            </button>
        </div>
        <div v-if="visitDisplay === 'Visit-list'" data-list>
            <div class="header-section">
                <!-- Search Bar -->
                <div class="search-container">
                    <input type="text" v-model="searchTerm" placeholder="Search by patient name..."
                        class="search-input">
                    <span class="search-icon">🔍</span>
                </div>
            </div>
            <!-- Loading State -->
            <div v-if="loading" class="loading">
                Loading visits...
            </div>
            <!-- Visits Grid -->
            <div class="visits-grid">
                <div v-for="visit in filteredVisits" :key="visit.id" class="visit-card" @click="selectVisit(visit)">
                    <div class="visit-header">
                        <h3>{{ visit.firstName }} {{ visit.lastName }}</h3>
                        <span class="visit-date">{{ formatDate(visit.date) }}</span>
                    </div>
                    <div class="visit-details">
                        <p><strong>Medical Aid:</strong>
                            <span :class="visit.medicalAid === 'yes' ? 'status-yes' : 'status-no'">
                                {{ visit.medicalAid }}
                            </span>
                        </p>
                        <p class="see-more">click to view more</p>
                    </div>
                </div>
            </div>
            <!-- No Results Message -->
            <div v-if="!loading && filteredVisits.length === 0" class="no-visits">
                {{ searchTerm ? 'No matching visits found' : 'No visits found' }}
            </div>
            <!-- Modal -->
            <div v-if="selectedVisit" class="modal-overlay" @click="closeModal">
                <div class="modal-content" @click.stop>
                    <div class="modal-header">
                        <h2>Visit Details</h2>
                        <button class="close-button" @click="closeModal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="detail-row">
                            <strong>Patient:</strong>
                            {{ selectedVisit.firstName }} {{ selectedVisit.lastName }}
                        </div>
                        <div class="detail-row">
                            <strong>Date:</strong>
                            {{ formatDate(selectedVisit.date) }}
                        </div>
                        <div class="detail-row">
                            <strong>Medical Aid: </strong>
                            <span :class="selectedVisit.medicalAid === 'yes' ? 'status-yes' : 'status-no'">
                                {{ selectedVisit.medicalAid }}
                            </span>
                        </div>
                        <div class="detail-row">
                            <strong>Diagnosis: </strong>
                            <span>
                                {{ selectedVisit.diagnosis }}
                            </span>
                        </div>
                        <div class="crud">
                            <button class="btn-edit" @click="openEditModal">
                                Edit
                            </button>
                            <button class="btn-delete" @click="openDeleteConfirm">
                                Delete Visit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Delete Confirmation Modal -->
            <div v-if="showDeleteConfirm" class="modal-overlay" @click="closeDeleteConfirm">
                <div class="modal-content delete-confirm-modal" @click.stop>
                    <div class="modal-header">
                        <h2>Confirm Delete</h2>
                        <button class="close-button" @click="closeDeleteConfirm">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p class="delete-warning">
                            Are you sure you want to delete this visit record for
                            <strong>{{ selectedVisit?.firstName }} {{ selectedVisit?.lastName }}</strong>?
                        </p>
                        <p class="delete-warning-sub">This action cannot be undone.</p>
                        <div class="delete-actions">
                            <button class="btn-cancel" @click="closeDeleteConfirm">Cancel</button>
                            <button class="btn-delete" @click="confirmDelete" :disabled="isDeleting">
                                {{ isDeleting ? 'Deleting...' : 'Delete' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Edit Visit Modal -->
            <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
                <div class="modal-content edit-modal" @click.stop>
                    <div class="modal-header">
                        <h2>Edit Visit</h2>
                        <button class="close-button" @click="closeEditModal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="handleEditSubmit">
                            <div class="form-group">
                                <label for="firstName">First Name</label>
                                <input type="text" id="firstName" v-model="editForm.firstName" required>
                            </div>
                            <div class="form-group">
                                <label for="lastName">Last Name</label>
                                <input type="text" id="lastName" v-model="editForm.lastName" required>
                            </div>
                            <div class="form-group">
                                <label for="date">Date</label>
                                <input type="date" id="date" v-model="editForm.date" required>
                            </div>
                            <div class="form-group">
                                <label for="medicalAid">Medical Aid</label>
                                <select id="medicalAid" v-model="editForm.medicalAid" required>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="diagnosis">Diagnosis</label>
                                <textarea id="diagnosis" v-model="editForm.diagnosis" required></textarea>
                            </div>
                            <div class="modal-actions">
                                <button type="button" class="btn-cancel" @click="closeEditModal">
                                    Cancel
                                </button>
                                <button type="submit" class="btn-save" :disabled="isEditing">
                                    {{ isEditing ? 'Saving...' : 'Save Changes' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="visitDisplay === 'Visit-form'">
            <VisitForm />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useVisitStore } from '~/stores/visits';

const visits = computed(() => visitStore.visits)
const loading = ref(true)
const searchTerm = ref('')
const selectedVisit = ref(null)
const visitStore = useVisitStore()
const showEditModal = ref(false)
const isEditing = ref(false)

let visitDisplay = ref('Visit-list')

function changeVisitDisplay(view) {
    visitDisplay.value = view
}

// edit modal code =============================================
const editForm = ref({
    firstName: '',
    lastName: '',
    date: '',
    medicalAid: '',
    diagnosis: ''
})

const openEditModal = () => {
    // Populate the form with current visit data
    editForm.value = {
        firstName: selectedVisit.value.firstName,
        lastName: selectedVisit.value.lastName,
        date: selectedVisit.value.date,
        medicalAid: selectedVisit.value.medicalAid,
        diagnosis: selectedVisit.value.diagnosis
    }
    showEditModal.value = true
}
const closeEditModal = () => {
    showEditModal.value = false
    // Reset form
    editForm.value = {
        firstName: '',
        lastName: '',
        date: '',
        medicalAid: '',
        diagnosis: ''
    }
}
const handleEditSubmit = async () => {
    if (!selectedVisit.value) return

    try {
        isEditing.value = true
        // Create a payload with only the fields that can be updated
        const payload = {
            firstName: editForm.value.firstName,
            lastName: editForm.value.lastName,
            date: editForm.value.date,
            medicalAid: editForm.value.medicalAid,
            diagnosis: editForm.value.diagnosis,
        };
         // Call the store's updatePatient method with the id and payload
         await visitStore.updateVisit(selectedVisit.value.id, payload);
         
        closeEditModal()
        closeModal()
        await fetchVisits()
    } catch (error) {
        console.error('Error updating visit:', error)
    } finally {
        isEditing.value = false
    }
}

// delete modal code =============================================
const showDeleteConfirm = ref(false)
const isDeleting = ref(false)

const openDeleteConfirm = () => {
    showDeleteConfirm.value = true
}

const closeDeleteConfirm = () => {
    showDeleteConfirm.value = false
}

const confirmDelete = async () => {
    if (!selectedVisit.value) return

    try {
        isDeleting.value = true
        await visitStore.deleteVisit(selectedVisit.value.id)
        closeDeleteConfirm()
        closeModal()
        // Optionally refresh the visits list
        await fetchVisits()
    } catch (error) {
        console.error('Error deleting visit:', error)
        // You might want to add error handling/user notification here
    } finally {
        isDeleting.value = false
    }
}

// Computed property for filtered visits
const filteredVisits = computed(() => {
    if (!searchTerm.value) return visits.value

    const search = searchTerm.value.toLowerCase()
    return visits.value.filter(visit =>
        visit.firstName.toLowerCase().includes(search) ||
        visit.lastName.toLowerCase().includes(search)
    )
})

// Fetch visits from Firestore
const fetchVisits = async () => {
    try {
        loading.value = true
        await visitStore.fetchVisits()
    } catch (error) {
        console.error('Error fetching visits:', error)
    } finally {
        loading.value = false
    }
}

// Format date helper function
const formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const selectVisit = (visit) => {
    selectedVisit.value = visit
}
const closeModal = () => {
    selectedVisit.value = null
}

onMounted(() => {
    fetchVisits()
})
</script>

<style scoped>
.visits-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

[class*="btn-"] {
    border: none;
    background-color: white;
    height: 40px;
}

.btn-1 {
    border-radius: 8px 0 0 8px;
}

.btn-2 {
    border-radius: 0 8px 8px 0;
}

.btn-active {
    background-color: #007bff;
    color: white;
}

.header-section {
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 20px;
}

.search-container {
    position: relative;
    max-width: 300px;
    width: 100%;
}

.search-input {
    width: 100%;
    padding: 10px 40px 10px 15px;
    border: 1px solid #ddd;
    border-radius: 20px;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.search-input:focus {
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

.visits-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.visit-card {
    background: white;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
}

.visit-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.visit-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    border-bottom: 1px solid #eee;
    padding-bottom: 8px;
}

.visit-header h3 {
    margin: 0;
    font-size: 1.1rem;
    color: #333;
}

.visit-date {
    color: #666;
    font-size: 0.9rem;
}

.visit-details {
    font-size: 0.95rem;
}

.visit-details p {
    margin: 8px 0;
}

.diagnosis {
    white-space: pre-wrap;
    color: #555;
}

.status-yes {
    color: #28a745;
    font-weight: 500;
}

.status-no {
    color: #dc3545;
    font-weight: 500;
}

.loading {
    text-align: center;
    padding: 40px;
    color: #666;
}

.no-visits {
    text-align: center;
    padding: 40px;
    color: #666;
    font-style: italic;
}

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
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    animation: modalSlideIn 0.3s ease-out;
}

.modal-header {
    padding: 16px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-body {
    padding: 20px;
}

.close-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.close-button:hover {
    background-color: #f0f0f0;
}

.detail-row {
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #eee;
}

.detail-row:last-child {
    border-bottom: none;
}

.btn-delete {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.btn-delete:hover {
    background-color: #c82333;
}

.btn-delete:disabled {
    background-color: #c82333;
    cursor: not-allowed;
}

.btn-cancel {
    background-color: #7FBCD2;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.btn-cancel:hover {
    background-color: #5a6268;
}

@keyframes modalSlideIn {
    from {
        transform: translateY(-20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

/* Add responsive styles for modal */
@media (max-width: 768px) {
    .modal-content {
        width: 95%;
        margin: 10px;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.visit-card {
    animation: fadeIn 0.3s ease-out forwards;
}

/* ================================================ edit modal ================================================ */
.crud {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

.btn-edit {
    background-color: #4CAF50;
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
}

.btn-edit:hover {
    background-color: #45a049;
}

.form-group {
    margin-bottom: 1rem;
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

.form-group textarea {
    min-height: 100px;
    resize: vertical;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.btn-save {
    background-color: #4CAF50;
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
}

.btn-save:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}
</style>
