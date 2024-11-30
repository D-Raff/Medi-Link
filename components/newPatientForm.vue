<template>
    <form @submit.prevent="handleSubmit" ref="formRef" class="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        <h2>
            New Patient Registration
        </h2>

        <div class="grid md:grid-cols-2 gap-6">
            <div>
                <h3 class="text-lg font-medium mb-4">
                    Personal Details
                </h3>
                <div class="space-y-4">
                    <input v-model="patient.firstName" type="text" placeholder="First Name"
                        style="border-color: #7FBCD2;" required />
                    <input v-model="patient.lastName" type="text" placeholder="Last Name" style="border-color: #7FBCD2;"
                        required />
                    <input v-model="patient.dateOfBirth" type="date" placeholder="Date of Birth"
                        style="border-color: #7FBCD2;" required />
                </div>
            </div>

            <!-- Contact Information -->
            <div>
                <h3 class="text-lg font-medium mb-4">
                    Contact Information
                </h3>
                <div class="space-y-4">
                    <input v-model="patient.email" type="email" placeholder="Email Address"
                            style=" border-color: #7FBCD2" required />
                    <input v-model="patient.phoneNumber" type="tel" placeholder="Phone Number"
                            style=" border-color: #7FBCD2" required />
                    <select v-model="patient.medicalAid"
                            style=" border-color: #7FBCD2" required>
                        <option value="">Select Medical Aid</option>
                        <option value="Private">Private</option>
                        <option value="Discovery_Health">Discovery Health</option>
                        <option value="Momentum">Momentum</option>
                        <option value="MotoHealth">MotoHealth</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Additional Notes -->
        <div class="mt-6">
            <h3 class="text-lg font-medium mb-4">
                Additional Notes
            </h3>
            <textarea v-model="patient.additionalNotes" placeholder="Any additional information (optional)"
                class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 h-24"
                style="border-color: #7FBCD2"></textarea>
        </div>

        <!-- Submit Button -->
        <div class="mt-8 flex justify-end">
            <button type="submit"
                class="px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 ease-in-out transform hover:scale-105"
                style="background-color: #5C9EAD">
                Register Patient
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref } from 'vue'
import { gsap } from 'gsap'
import { usePatientStore } from '~/stores/patients'

const patientStore = usePatientStore()

const formRef = ref(null)
const patient = ref({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phoneNumber: '',
    medicalAid: '',
    additionalNotes: ''
})

const handleSubmit = async () => {
    // Form submission logic
    await patientStore.addPatient(patient.value)
    

    // GSAP Animation on successful submission
    gsap.to(formRef.value, {
        scale: 1.02,
        backgroundColor: '#E9C46A',
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
    })

    // Reset all inputs in the form
    formRef.value.querySelectorAll('input, select, textarea').forEach(input => {
        input.value = ''
    })

    // reset the patient ref object
    patient.value = {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        email: '',
        phoneNumber: '',
        medicalAid: '',
        additionalNotes: ''
    }
}

// GSAP Entry Animation
onMounted(() => {
    gsap.from(formRef.value, {
        opacity: 0,
        y: 50,
        duration: 0.5,
        ease: 'power2.out'
    })
})

</script>

<style scoped>
input:focus,
select:focus,
textarea:focus {
    border-color: #5C9EAD;
    box-shadow: 0 0 0 3px rgba(92, 158, 173, 0.2);
}

h2 {
    font-weight: bold;
    margin-bottom: 20px;
    color: #7FBCD2;
}

h3 {
    font-weight: bold;
    margin-bottom: 20px;
    color: #E9C46A;
}
</style>