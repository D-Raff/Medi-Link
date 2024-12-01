<template>
    <div id="Patients">
        <div id="pat-nav">
            <button @click="changePatientDisplay('Patient-list')" class="btn-1"
                :class="{ 'btn-active': patientDisplay === 'Patient-list' }">
                All Patients
            </button>
            <button @click="changePatientDisplay('new-form')" class="btn-2"
                :class="{ 'btn-active': patientDisplay === 'new-form' }">
                Add new Patient
            </button>
        </div>

        <div v-if="patientDisplay === 'Patient-list'" data-list>
            <PatientList :patients="patientStore.patients" />
        </div>
        <div v-else-if="patientDisplay === 'new-form'">
            <NewPatientForm />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePatientStore } from '~/stores/patients'

const patientStore = usePatientStore()
patientStore.fetchPatients()


let patientDisplay = ref('Patient-list')

function changePatientDisplay(view) {
    patientDisplay.value = view
}

</script>

<style scoped>
[data-list] {
    padding: 0 !important;
    display: flex;
    flex-direction: column;
    align-items: start;
}

[class*="btn"] {
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
    /* or any color you prefer */
    color: white;
}
</style>