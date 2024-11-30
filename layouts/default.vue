<template>
    <div id="Main">
        <div id="Navigation">
            <h1 class="text-white text-2xl font-bold mb-8">
                Medi-Link
            </h1>
            <section class="nav-items">
                <NuxtLink to="/" class="nav-item1">Home</NuxtLink>
            </section>
        </div>
        <section id="page">
            <div id="search-profile">
                <input type="text" class="searchbar" placeholder="Search patients...">
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

/* Navigation sidebar */
#Navigation {
    background-color: #7FBCD2;
    padding: 1rem;
    border-right: 1px solid #e0e0e0;
}

#page {
    display: grid;
    grid-template-rows: 85px 1fr;
    background-color: #7FBCD2;
}
#search-profile {
    background-color: #7FBCD2;
    display: flex;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #e0e0e0;
}
/* Main content area */
#content {
    height: 90vh;
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