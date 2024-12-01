<template>
    <div id="Main">
        <div id="Navigation">
            <h1 class="busName text-2xl font-bold mb-8">
                Medi-Link
            </h1>
            <section class="nav-items">
                <NuxtLink to="/" class="nav-item1">Home</NuxtLink>
                <NuxtLink to="/patients" class="nav-item2">Patients</NuxtLink>
                <NuxtLink to="/visits" class="nav-item3">visits</NuxtLink>
            </section>
        </div>
        <section id="page">
            <div id="search-profile">
                <div class="profile">
                    <p>DR</p>
                </div>
            </div>
            <div id="content">
                <NuxtPage />
            </div>
        </section>

    </div>

</template>

<script setup>


</script>

<style scoped>
/* =================================== grid layout for responsiveness =================================== */
#Main {
    background-color: #7FBCD2;
    display: grid;
    grid-template-columns: 250px 1fr;
    /* Sidebar width 250px, content takes remaining space */
    min-height: 100vh;
    /* Full viewport height */
}
.busName{
    color: #F5F5F5;
}
#content {
    overflow-y: auto;
    /* Allows scrolling if content is too long */
}

/* ============================ Navigation ============================ */
#Navigation {
    background-color: #7FBCD2;
    padding: 1rem;
    border-right: 1px solid #e0e0e0;
}
.nav-items {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 2rem;
}
.router-link-exact-active {
    color: black !important;
    background-color: #F5F5F5;
}
[class*="nav-item"] {
    color: #F5F5F5;
    text-decoration: none;
    font-size: 1.2rem;
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    transition: all 0.3s ease;
}

#page {
    display: grid;
    grid-template-rows: 80px 1fr;
    background-color: #7FBCD2;
}
#search-profile {
    background-color: #7FBCD2;
    display: flex;
    align-items: center;
    padding: 1rem;
    z-index: 0;
}
.profile {
    background-color: #E9C46A;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #7FBCD2;
    font-weight: 600;
    font-size: 1.2rem;
}
.profile p {
    margin: 0;
    color: black;
}

/* Main content area */
#content {
    background-color: #F5F5F5;
    padding: 1rem;
    overflow-y: auto;
    /* Allows scrolling if content is too long */
}

.searchbar {
    outline: none;
    box-shadow: none;
    border: none;
    border-radius: 5px;
    height: 40px;
}
</style>