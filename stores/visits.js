import { defineStore } from "pinia";
import { addDoc, collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export const useVisitStore = defineStore("visitStore", {
    state: () => ({
        visits: [],
    }),
    actions: {
        // fetching all visits
        async fetchVisits() {
            const { $db } = useNuxtApp()

            const snapshot = await getDocs(collection($db, "visits"))

            this.visits = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
        },

        // adding new visits
        async addVisit(payload) {
            const { $db } = useNuxtApp()

            const visit = {
                firstName: payload.firstName,
                lastName: payload.lastName,
                date: payload.date,
                medicalAid: payload.medicalAid,
                diagnosis: payload.diagnosis
            }

            try {
                const docRef = await addDoc(collection($db, "visits"), visit);
                this.visits.push({ id: docRef.id, ...visit });
            } catch (error) {
                console.error("Error adding visitation: ", error);
            }
        },

        // updating visits
        async updateVisit(id, payload) {
            const { $db } = useNuxtApp()

            const docRef = doc($db, "visits", id)

            await updateDoc(docRef, payload)

            const index = this.visits.findIndex(visit => visit.id === id)

            if (index !== -1) {
                this.visits[index] = { ...this.visits[index], ...payload }
            }
        },

        // deleting visits
        async deleteVisit(id) {
            const { $db } = useNuxtApp()

            const docRef = doc($db, "visits", id)

            await deleteDoc(docRef)

            this.visits = this.visits.filter(visit => visit.id !== id)
        }

    },
});