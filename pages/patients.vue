<template>
    <div id="Patients">
        <div id="pat-nav">
            <button @click="changePatientDisplay('Patient-list')">All Patients</button>
            <button @click="changePatientDisplay('new-form')">Add new Patient</button>
            <button @click="changePatientDisplay('visit-form')">New Visit</button>
        </div>
        <div v-if="patientDisplay === 'Patient-list'">
            <PatientList :patients="patientStore.patients" />
        </div>
        <div v-else-if="patientDisplay === 'new-form'">
            <NewPatientForm/>
        </div>
        <div v-else-if="patientDisplay === 'visit-form'">
            <VisitForm/>
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

</style>