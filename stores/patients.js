import { defineStore } from "pinia";
import { addDoc, collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export const usePatientStore = defineStore("patientStore", {
    state: () => ({
        patients: [],
    }),
    actions: {
        // fetching all patients
        async fetchPatients() {
            const { $db } = useNuxtApp()

            const snapshot = await getDocs(collection($db, "patients"))

            this.patients = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
        },

        // adding new patients
        async addPatient(payload) {
            const { $db } = useNuxtApp()

            const patient = {
                firstName: payload.firstName,
                lastName: payload.lastName,
                dateOfBirth: payload.dateOfBirth,
                email: payload.email,
                phoneNumber: payload.phoneNumber,
                medicalAid: payload.medicalAid,
                additionalNotes: payload.additionalNotes
            }

            try {
                const docRef = await addDoc(collection($db, "patients"), patient);
                console.log("Patient added successfully");
                this.patients.push({ id: docRef.id, ...patient });
            } catch (error) {
                console.error("Error adding patient: ", error);
            }
        },

        // updating patients
        async updatePatient(id, payload) {
            const { $db } = useNuxtApp()

            const docRef = doc($db, "patients", id)

            await updateDoc(docRef, payload)

            const index = this.patients.findIndex(patient => patient.id === id)

            if (index !== -1) {
                this.patients[index] = { ...this.patients[index], ...payload }
            }
        },

        // deleting patients
        async deletePatient(id) {
            const { $db } = useNuxtApp()

            const docRef = doc($db, "patients", id)

            await deleteDoc(docRef)

            this.patients = this.patients.filter(patient => patient.id !== id)
        }

    },
});